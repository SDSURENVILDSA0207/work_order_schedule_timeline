/**
 * Sample data for Work Order Schedule Timeline
 * - 5+ work centers
 * - 8+ work orders across different centers
 * - All 4 status types represented
 * - At least one work center with multiple non-overlapping orders
 *
 * Dates are in the 2026 calendar window so the default month (and day/week) range
 * around “today” still shows these bars without extreme horizontal scrolling.
 * @upgrade For a production seed, consider generating ranges relative to `new Date()` on deploy.
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
      startDate: '2026-05-01',
      endDate: '2026-06-30',
    },
  },
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'TechFlow Solutions',
      workCenterId: 'wc-1',
      status: 'open',
      startDate: '2026-08-15',
      endDate: '2026-10-15',
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
      startDate: '2026-04-01',
      endDate: '2026-05-31',
    },
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'Rodriques Electrics',
      workCenterId: 'wc-2',
      status: 'in-progress',
      startDate: '2026-07-01',
      endDate: '2026-08-31',
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
      startDate: '2026-04-10',
      endDate: '2026-05-20',
    },
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'Compleks Systems',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: '2026-09-01',
      endDate: '2026-10-31',
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
      startDate: '2026-11-01',
      endDate: '2026-12-15',
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
      startDate: '2026-03-01',
      endDate: '2026-04-15',
    },
  },
];
