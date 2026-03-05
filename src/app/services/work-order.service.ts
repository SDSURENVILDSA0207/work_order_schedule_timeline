/**
 * Work Order Service - State management, CRUD, overlap validation, local persistence
 */

import { Injectable, signal } from '@angular/core';
import type { WorkCenterDocument, WorkOrderDocument, WorkOrderStatus } from '../models/work-order.model';
import { SAMPLE_WORK_CENTERS, SAMPLE_WORK_ORDERS } from '../data/sample-data';
import { parseDate } from '../utils/date.utils';

const WORK_ORDERS_STORAGE_KEY = 'work_order_timeline_work_orders';

function loadWorkOrdersFromStorage(): WorkOrderDocument[] | null {
  try {
    const raw = localStorage.getItem(WORK_ORDERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];
    const result: WorkOrderDocument[] = [];
    for (const item of parsed) {
      if (
        item &&
        typeof item === 'object' &&
        typeof (item as WorkOrderDocument).docId === 'string' &&
        (item as WorkOrderDocument).docType === 'workOrder' &&
        (item as WorkOrderDocument).data &&
        typeof (item as WorkOrderDocument).data === 'object' &&
        typeof (item as WorkOrderDocument).data.name === 'string' &&
        typeof (item as WorkOrderDocument).data.workCenterId === 'string' &&
        statuses.includes((item as WorkOrderDocument).data.status) &&
        typeof (item as WorkOrderDocument).data.startDate === 'string' &&
        typeof (item as WorkOrderDocument).data.endDate === 'string'
      ) {
        result.push(item as WorkOrderDocument);
      }
    }
    return result.length > 0 ? result : null;
  } catch {
    return null;
  }
}

function saveWorkOrdersToStorage(orders: WorkOrderDocument[]): void {
  try {
    localStorage.setItem(WORK_ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

@Injectable({ providedIn: 'root' })
export class WorkOrderService {
  private workCentersSignal = signal<WorkCenterDocument[]>(SAMPLE_WORK_CENTERS);
  private workOrdersSignal = signal<WorkOrderDocument[]>(
    loadWorkOrdersFromStorage() ?? SAMPLE_WORK_ORDERS
  );

  readonly workCenters = this.workCentersSignal.asReadonly();
  readonly workOrders = this.workOrdersSignal.asReadonly();

  /**
   * Get work orders for a specific work center
   */
  getOrdersForWorkCenter(workCenterId: string): WorkOrderDocument[] {
    return this.workOrdersSignal().filter(
      (o) => o.data.workCenterId === workCenterId
    );
  }

  /**
   * Check if a date range overlaps with existing orders on the same work center.
   * Overlap formula: startA < endB AND endA > startB
   * @param excludeId - When editing, exclude this order from the check
   */
  hasOverlap(
    workCenterId: string,
    startDate: string,
    endDate: string,
    excludeId?: string
  ): boolean {
    const newStart = parseDate(startDate);
    const newEnd = parseDate(endDate);

    const orders = this.workOrdersSignal().filter(
      (o) =>
        o.data.workCenterId === workCenterId && o.docId !== excludeId
    );

    return orders.some((o) => {
      const existingStart = parseDate(o.data.startDate);
      const existingEnd = parseDate(o.data.endDate);
      return newStart < existingEnd && newEnd > existingStart;
    });
  }

  /**
   * Create a new work order (validates overlap before adding)
   */
  createOrder(order: WorkOrderDocument['data']): { success: boolean; error?: string } {
    if (this.hasOverlap(order.workCenterId, order.startDate, order.endDate)) {
      return { success: false, error: 'This work order overlaps with an existing order on the same work center.' };
    }

    const docId = 'wo-' + Date.now();
    const newOrder: WorkOrderDocument = {
      docId,
      docType: 'workOrder',
      data: { ...order },
    };

    this.workOrdersSignal.update((orders) => {
      const next = [...orders, newOrder];
      saveWorkOrdersToStorage(next);
      return next;
    });
    return { success: true };
  }

  /**
   * Update an existing work order (validates overlap excluding self)
   */
  updateOrder(
    docId: string,
    updates: Partial<WorkOrderDocument['data']>
  ): { success: boolean; error?: string } {
    const existing = this.workOrdersSignal().find((o) => o.docId === docId);
    if (!existing) return { success: false, error: 'Order not found.' };

    const merged = { ...existing.data, ...updates };

    if (this.hasOverlap(merged.workCenterId, merged.startDate, merged.endDate, docId)) {
      return { success: false, error: 'This work order overlaps with an existing order on the same work center.' };
    }

    this.workOrdersSignal.update((orders) => {
      const next = orders.map((o) =>
        o.docId === docId ? { ...o, data: merged } : o
      );
      saveWorkOrdersToStorage(next);
      return next;
    });
    return { success: true };
  }

  /**
   * Delete a work order
   */
  deleteOrder(docId: string): void {
    this.workOrdersSignal.update((orders) => {
      const next = orders.filter((o) => o.docId !== docId);
      saveWorkOrdersToStorage(next);
      return next;
    });
  }

  /**
   * Get work order by id
   */
  getOrderById(docId: string): WorkOrderDocument | undefined {
    return this.workOrdersSignal().find((o) => o.docId === docId);
  }

  /**
   * Get work center by id
   */
  getWorkCenterById(docId: string): WorkCenterDocument | undefined {
    return this.workCentersSignal().find((c) => c.docId === docId);
  }
}
