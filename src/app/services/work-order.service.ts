/**
 * Work Order Service - State management, CRUD, overlap validation
 */

import { Injectable, signal, computed } from '@angular/core';
import type { WorkCenterDocument, WorkOrderDocument } from '../models/work-order.model';
import { SAMPLE_WORK_CENTERS, SAMPLE_WORK_ORDERS } from '../data/sample-data';
import { parseDate } from '../utils/date.utils';

@Injectable({ providedIn: 'root' })
export class WorkOrderService {
  private workCentersSignal = signal<WorkCenterDocument[]>(SAMPLE_WORK_CENTERS);
  private workOrdersSignal = signal<WorkOrderDocument[]>(SAMPLE_WORK_ORDERS);

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

    this.workOrdersSignal.update((orders) => [...orders, newOrder]);
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

    this.workOrdersSignal.update((orders) =>
      orders.map((o) =>
        o.docId === docId ? { ...o, data: merged } : o
      )
    );
    return { success: true };
  }

  /**
   * Delete a work order
   */
  deleteOrder(docId: string): void {
    this.workOrdersSignal.update((orders) =>
      orders.filter((o) => o.docId !== docId)
    );
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
