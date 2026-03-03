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
  { docId: 'wo1', docType: 'workOrder', data: { name: 'entrix Ltd', workCenterId: 'wc1', status: 'complete', startDate: '2024-08-01', endDate: '2024-09-15' } },
  { docId: 'wo2', docType: 'workOrder', data: { name: 'Konsulting Inc', workCenterId: 'wc3', status: 'in-progress', startDate: '2024-09-10', endDate: '2024-10-20' } },
  { docId: 'wo3', docType: 'workOrder', data: { name: 'Compleks Systems', workCenterId: 'wc3', status: 'in-progress', startDate: '2025-01-05', endDate: '2025-02-15' } },
  { docId: 'wo4', docType: 'workOrder', data: { name: 'McMarrow Distribution', workCenterId: 'wc4', status: 'blocked', startDate: '2024-09-01', endDate: '2025-01-20' } },
  { docId: 'wo5', docType: 'workOrder', data: { name: 'Order A', workCenterId: 'wc2', status: 'open', startDate: '2024-10-01', endDate: '2024-10-15' } },
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
