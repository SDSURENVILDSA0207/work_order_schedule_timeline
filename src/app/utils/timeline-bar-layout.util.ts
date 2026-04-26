import { addDays, parseDate, startOfDay } from './date.utils';
import type { DraftOrderDateRange, PanelMode, WorkOrderDocument } from '../models/work-order.model';
import type { TimelineService, TimelineRange } from '../services/timeline.service';

const MIN_BAR_WIDTH_PX = 24;

export interface BarLayoutContext {
  range: TimelineRange;
  totalWidth: number;
  panelMode: PanelMode | null;
  editingOrderId: string | null;
  draft: DraftOrderDateRange | null;
  dateToPixel: TimelineService['dateToPixel'];
}

/**
 * Resolves a work order to bar left/width in grid pixels, including draft
 * dates while the edit panel is open for that order.
 */
export function layoutWorkOrderBar(
  order: WorkOrderDocument,
  ctx: BarLayoutContext,
): { left: number; width: number } {
  const isEditingThis =
    ctx.panelMode === 'edit' && ctx.editingOrderId === order.docId;
  const draft = ctx.draft;
  const startStr = isEditingThis && draft ? draft.startDate : order.data.startDate;
  const endStr = isEditingThis && draft ? draft.endDate : order.data.endDate;

  let startDate = startOfDay(parseDate(startStr));
  let endDate = startOfDay(parseDate(endStr));
  if (endDate.getTime() < startDate.getTime()) {
    endDate = new Date(startDate.getTime());
  }
  // Half-open in time: [start 00:00, first instant of day after endDate) so last day is fully visible without bleeding into the next.
  const barEndExclusive = addDays(endDate, 1);
  const { range, totalWidth, dateToPixel } = ctx;
  const leftPx = dateToPixel(startDate, range, totalWidth);
  const rightPx = dateToPixel(barEndExclusive, range, totalWidth);
  const widthPx = Math.max(rightPx - leftPx, MIN_BAR_WIDTH_PX);
  const leftPxClamped = Math.max(0, Math.min(leftPx, totalWidth - widthPx));
  return {
    left: Math.round(leftPxClamped),
    width: Math.round(widthPx),
  };
}
