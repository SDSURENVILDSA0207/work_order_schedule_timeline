import { Injectable } from '@angular/core';
import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';

const SAMPLE_WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc1', docType: 'workCenter', data: { name: 'Genesis Hardware' } },
  { docId: 'wc2', docType: 'workCenter', data: { name: 'Rodriques Electrics' } },
  { docId: 'wc3', docType: 'workCenter', data: { name: 'Konsulting Inc' } },
  { docId: 'wc4', docType: 'workCenter', data: { name: 'McMarrow Distribution' } },
  { docId: 'wc5', docType: 'workCenter', data: { name: 'Spartan Manufacturing' } },
];

const SAMPLE_WORK_ORDERS: WorkOrderDocument[] = [
  // 1. Genesis Hardware (wc1) – no overlap, gap between orders
  { docId: 'wo1', docType: 'workOrder', data: { name: 'entrix Ltd', workCenterId: 'wc1', status: 'complete', startDate: '2024-08-01', endDate: '2024-09-30' } },
  { docId: 'wo6', docType: 'workOrder', data: { name: 'TechFlow Solutions', workCenterId: 'wc1', status: 'open', startDate: '2024-11-15', endDate: '2025-01-15' } },
  // 2. Rodriques Electrics (wc2) – no overlap, gap between orders
  { docId: 'wo7', docType: 'workOrder', data: { name: 'Precision Parts Co', workCenterId: 'wc2', status: 'complete', startDate: '2024-08-01', endDate: '2024-10-15' } },
  { docId: 'wo5', docType: 'workOrder', data: { name: 'Rodriques Electrics', workCenterId: 'wc2', status: 'in-progress', startDate: '2024-12-01', endDate: '2025-01-31' } },
  // 3. Konsulting Inc (wc3) – no overlap, gap between orders
  { docId: 'wo2', docType: 'workOrder', data: { name: 'Konsulting Inc', workCenterId: 'wc3', status: 'in-progress', startDate: '2024-09-01', endDate: '2024-10-31' } },
  { docId: 'wo3', docType: 'workOrder', data: { name: 'Compleks Systems', workCenterId: 'wc3', status: 'in-progress', startDate: '2024-12-15', endDate: '2025-01-31' } },
  // 4. McMarrow Distribution (wc4) – single order
  { docId: 'wo4', docType: 'workOrder', data: { name: 'McMarrow Distribution', workCenterId: 'wc4', status: 'blocked', startDate: '2024-10-01', endDate: '2024-12-15' } },
  // 5. Spartan Manufacturing (wc5) – single order
  { docId: 'wo8', docType: 'workOrder', data: { name: 'Acme Inc', workCenterId: 'wc5', status: 'open', startDate: '2025-01-15', endDate: '2025-02-28' } },
];

@Injectable({
  providedIn: 'root',
})
export class WorkOrderDataService {
  private workCenters = SAMPLE_WORK_CENTERS;
  private workOrders = [...SAMPLE_WORK_ORDERS];

  getWorkCenters(): WorkCenterDocument[] {
    return this.workCenters;
  }

  getWorkOrders(): WorkOrderDocument[] {
    return this.workOrders;
  }

  getOrdersForWorkCenter(workCenterId: string): WorkOrderDocument[] {
    return this.workOrders.filter((o) => o.data.workCenterId === workCenterId);
  }
}
