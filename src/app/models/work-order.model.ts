/**
 * Work Order Schedule Timeline — data models
 * Document shape: { docId, docType, data }
 */

export const WORK_ORDER_STATUSES = ['open', 'in-progress', 'complete', 'blocked'] as const;

export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

export const WORK_ORDER_STATUS_LABELS: Readonly<Record<WorkOrderStatus, string>> = {
  open: 'Open',
  'in-progress': 'In progress',
  complete: 'Complete',
  blocked: 'Blocked',
};

/** Options for &lt;select&gt; / ng-select (value + human label). */
export const WORK_ORDER_STATUS_OPTIONS: ReadonlyArray<{ value: WorkOrderStatus; label: string }> =
  WORK_ORDER_STATUSES.map((value) => ({
    value,
    label: WORK_ORDER_STATUS_LABELS[value],
  }));

export function isWorkOrderStatus(s: string): s is WorkOrderStatus {
  return (WORK_ORDER_STATUSES as readonly string[]).includes(s);
}

export interface WorkCenterDocument {
  docId: string;
  docType: 'workCenter';
  data: {
    name: string;
  };
}

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string;
    status: WorkOrderStatus;
    startDate: string; // YYYY-MM-DD
    endDate: string;
  };
}

export type TimelineZoom = 'hour' | 'day' | 'week' | 'month';

export type PanelMode = 'create' | 'edit';

export interface CreateWorkOrderContext {
  workCenterId: string;
  startDate: string;
}

export interface DraftOrderDateRange {
  startDate: string;
  endDate: string;
}
