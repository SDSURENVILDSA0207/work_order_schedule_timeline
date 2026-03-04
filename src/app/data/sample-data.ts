/**
 * Sample data for Work Order Schedule Timeline
 * - 5+ work centers
 * - 8+ work orders across different centers
 * - All 4 status types represented
 * - At least one work center with multiple non-overlapping orders
 */

import type { WorkCenterDocument, WorkOrderDocument } from '../models/work-order.model';

export const SAMPLE_WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-1', docType: 'workCenter', data: { name: 'Genesis Hardware' } },
  { docId: 'wc-2', docType: 'workCenter', data: { name: 'Rodriques Electrics' } },
  { docId: 'wc-3', docType: 'workCenter', data: { name: 'Konsulting Inc' } },
  { docId: 'wc-4', docType: 'workCenter', data: { name: 'McMarrow Distribution' } },
  { docId: 'wc-5', docType: 'workCenter', data: { name: 'Spartan Manufacturing' } },
];

export const SAMPLE_WORK_ORDERS: WorkOrderDocument[] = [
  // 1. Genesis Hardware (wc-1) – no overlap, gap between orders
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'entrix Ltd',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: '2024-08-01',
      endDate: '2024-09-30',
    },
  },
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'TechFlow Solutions',
      workCenterId: 'wc-1',
      status: 'open',
      startDate: '2024-11-15',
      endDate: '2025-01-15',
    },
  },
  // 2. Rodriques Electrics (wc-2) – no overlap, gap between orders
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Precision Parts Co',
      workCenterId: 'wc-2',
      status: 'complete',
      startDate: '2024-08-01',
      endDate: '2024-10-15',
    },
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'Rodriques Electrics',
      workCenterId: 'wc-2',
      status: 'in-progress',
      startDate: '2024-12-01',
      endDate: '2025-01-31',
    },
  },
  // 3. Konsulting Inc (wc-3) – no overlap, gap between orders
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'Konsulting Inc',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: '2024-09-01',
      endDate: '2024-10-31',
    },
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'Compleks Systems',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: '2024-12-15',
      endDate: '2025-01-31',
    },
  },
  // 4. McMarrow Distribution (wc-4) – single order
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'McMarrow Distribution',
      workCenterId: 'wc-4',
      status: 'blocked',
      startDate: '2024-10-01',
      endDate: '2024-12-15',
    },
  },
  // 5. Spartan Manufacturing (wc-5) – single order
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Acme Inc',
      workCenterId: 'wc-5',
      status: 'open',
      startDate: '2025-01-15',
      endDate: '2025-02-28',
    },
  },
];
