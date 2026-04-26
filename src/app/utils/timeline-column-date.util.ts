import type { TimelineZoom } from '../models/work-order.model';
import { toISODate } from './date.utils';

/**
 * Work Order create prefill: label column “period” → local start date (YYYY-MM-DD).
 * Month view uses the 1st of the month; day/hour/week use the column’s day.
 */
export function isoStartDateForColumn(periodStart: Date, zoom: TimelineZoom): string {
  const y = periodStart.getFullYear();
  const m = periodStart.getMonth();
  const d = zoom === 'month' ? 1 : periodStart.getDate();
  return toISODate(new Date(y, m, d));
}
