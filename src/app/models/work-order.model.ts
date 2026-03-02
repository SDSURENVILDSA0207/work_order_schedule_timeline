/**
 * Work Order Schedule Timeline - Data Models
 * Follows document structure: { docId, docType, data }
 */

export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

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
    startDate: string; // ISO format (e.g., "2025-01-15")
    endDate: string;
  };
}

export type TimelineZoom = 'day' | 'week' | 'month';
