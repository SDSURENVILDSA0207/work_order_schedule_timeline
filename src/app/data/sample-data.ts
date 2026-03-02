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
  // Genesis Hardware - Complete
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'entrix Ltd',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: '2024-08-15',
      endDate: '2024-10-05',
    },
  },
  // Rodriques Electrics - In progress
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'Rodriques Electrics',
      workCenterId: 'wc-2',
      status: 'in-progress',
      startDate: '2024-09-01',
      endDate: '2024-12-15',
    },
  },
  // Konsulting Inc - Multiple non-overlapping orders
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'Konsulting Inc',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: '2024-09-15',
      endDate: '2024-10-10',
    },
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'Compleks Systems',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: '2024-11-20',
      endDate: '2025-02-15',
    },
  },
  // McMarrow Distribution - Blocked
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'McMarrow Distribution',
      workCenterId: 'wc-4',
      status: 'blocked',
      startDate: '2024-10-01',
      endDate: '2024-12-20',
    },
  },
  // Spartan Manufacturing - Open
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Acme Inc',
      workCenterId: 'wc-5',
      status: 'open',
      startDate: '2025-01-10',
      endDate: '2025-01-24',
    },
  },
  // Additional orders for variety
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'TechFlow Solutions',
      workCenterId: 'wc-1',
      status: 'open',
      startDate: '2025-02-01',
      endDate: '2025-02-15',
    },
  },
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Precision Parts Co',
      workCenterId: 'wc-2',
      status: 'complete',
      startDate: '2024-07-01',
      endDate: '2024-08-15',
    },
  },
];
