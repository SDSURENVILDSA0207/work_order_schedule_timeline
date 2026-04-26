/**
 * Timeline Service — all date ↔ pixel math and column generation.
 *
 * Conventions (important):
 * - `TimelineRange` uses a **half-open** interval: [start, end). `end` is the
 *   first instant **not** included in the grid. This matches `while (c < end)`
 *   column generation and makes linear mapping use `end - start` in ms so
 *   column count matches the time span (fixes day/week off-by-one).
 * - Work-order YYYY-MM-DD values use **local** calendar interpretation (see
 *   `parseDate` / `toISODate`).
 * - Pixels are **linear in time** between `start` and `end` (so within a month
 *   column, X is proportional to calendar progress through that month, even
 *   though the column’s pixel width is fixed).
 *
 * @upgrade Column `label` strings are en-US; pipe through Angular i18n or a date adapter if
 *   localized headers are required.
 */

import { Injectable } from '@angular/core';
import type { TimelineZoom } from '../models/work-order.model';
import { TIMELINE_CONFIG } from '../timeline/timeline.config';
import {
  addDays,
  addHours,
  addMonths,
  diffLocalCalendarDays,
  parseDate,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
} from '../utils/date.utils';

export interface TimelineRange {
  /** First instant shown (inclusive), aligned to period start for that zoom. */
  start: Date;
  /**
   * First instant **not** shown (exclusive). The last period in the grid ends at
   * this instant.
   */
  end: Date;
}

export interface TimelineColumn {
  label: string;
  /** Start of the period for this column (hour / day / week / first-of-month). */
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class TimelineService {
  // ─── Initial range (symmetric around “now”, half-open) ────────────────────

  /** Windows are half-open [start, end); `end` aligns to the first tick after the last visible column. */
  getInitialRange(zoom: TimelineZoom): TimelineRange {
    const now = new Date();
    if (zoom === 'hour') {
      const h = TIMELINE_CONFIG.hourViewRadiusHours;
      const start = startOfHour(addHours(now, -h));
      const lastHour = startOfHour(addHours(now, h));
      const end = addHours(lastHour, 1);
      return { start, end };
    }
    if (zoom === 'day') {
      const d = TIMELINE_CONFIG.dayViewRadiusDays;
      const start = startOfDay(addDays(now, -d));
      // Last included day: local midnight of (now + d). Exclusive: next day 00:00
      const end = addDays(startOfDay(addDays(now, d)), 1);
      return { start, end };
    }
    if (zoom === 'week') {
      const w = TIMELINE_CONFIG.weekViewRadiusWeeks;
      const colCount = 2 * w + 1;
      const start = startOfWeek(addDays(now, -w * 7));
      const end = addDays(start, colCount * 7);
      return { start, end };
    }
    if (zoom === 'month') {
      const m = TIMELINE_CONFIG.monthViewRadiusMonths;
      const start = startOfMonth(addMonths(now, -m));
      // Exclusive end = first of the month *after* the last included month → m months forward from start-of-(now) plus one boundary month.
      const end = startOfMonth(addMonths(now, m + 1));
      return { start, end };
    }
    return this.getInitialRange('day');
  }

  /** Extend the visible range to the left by `periods` column steps. */
  extendRangeStart(range: TimelineRange, zoom: TimelineZoom, periods: number): Date {
    const n = Math.max(1, periods);
    const start = new Date(range.start);
    switch (zoom) {
      case 'hour':
        start.setTime(start.getTime() - n * 60 * 60 * 1000);
        return startOfHour(start);
      case 'day':
        return startOfDay(addDays(start, -n));
      case 'week':
        return startOfWeek(addDays(start, -n * 7));
      case 'month':
        return startOfMonth(addMonths(start, -n));
      default:
        return startOfDay(addDays(start, -n));
    }
  }

  /** Move the exclusive `end` forward by `periods` column steps. */
  extendRangeEnd(range: TimelineRange, zoom: TimelineZoom, periods: number): Date {
    const n = Math.max(1, periods);
    const end = new Date(range.end);
    switch (zoom) {
      case 'hour':
        return addHours(end, n);
      case 'day':
        return addDays(end, n);
      case 'week':
        return addDays(end, n * 7);
      case 'month':
        return startOfMonth(addMonths(end, n));
      default:
        return addDays(end, n);
    }
  }

  /**
   * Map a date to pixel X in [0, totalWidth] using **milliseconds** on [start, end).
   */
  dateToPixel(date: Date | string, range: TimelineRange, totalWidth: number): number {
    const d = typeof date === 'string' ? parseDate(date) : new Date(date.getTime());
    return this.timeToPixel(d.getTime(), range, totalWidth);
  }

  /** Linear map: milliseconds in [range.start, range.end) map linearly to [0, totalWidth]. */
  timeToPixel(tMs: number, range: TimelineRange, totalWidth: number): number {
    const t0 = range.start.getTime();
    const t1 = range.end.getTime();
    const span = t1 - t0;
    if (span <= 0) return 0;
    if (tMs <= t0) return 0;
    if (tMs >= t1) return totalWidth;
    return ((tMs - t0) / span) * totalWidth;
  }

  /**
   * Inverse: pixel along full content (0…totalWidth) → instant in the range.
   */
  pixelToDate(pixelX: number, range: TimelineRange, totalWidth: number): Date {
    const t0 = range.start.getTime();
    const t1 = range.end.getTime();
    const span = t1 - t0;
    if (span <= 0) return new Date(t0);
    if (totalWidth <= 0) return new Date(t0);
    const f = Math.max(0, Math.min(1, pixelX / totalWidth));
    return new Date(t0 + f * span);
  }

  /**
   * Number of columns (same as `getColumns().length` but without building labels).
   * Keeps `getColumnIndexForDate` cheap for repeated calls.
   */
  getColumnCount(range: TimelineRange, zoom: TimelineZoom): number {
    const s = range.start;
    const e = range.end;
    const span = e.getTime() - s.getTime();
    if (span <= 0) return 0;
    if (zoom === 'hour') {
      return Math.max(0, Math.floor(span / 3600000));
    }
    if (zoom === 'day') {
      // end is 00:00 the day *after* the last column
      return Math.max(0, diffLocalCalendarDays(startOfDay(s), addDays(new Date(e), -1)) + 1);
    }
    if (zoom === 'week') {
      return Math.max(0, Math.round(span / (7 * 86400000)));
    }
    if (zoom === 'month') {
      const a = startOfMonth(s);
      const b = e;
      return Math.max(0, (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()));
    }
    return 0;
  }

  /**
   * Index of the column that contains the **start** of the period for `date`.
   * Clamps to the last column when at/after `range.end`.
   */
  getColumnIndexForDate(date: Date, range: TimelineRange, zoom: TimelineZoom): number {
    if (date.getTime() < range.start.getTime()) {
      return 0;
    }
    const n = this.getColumnCount(range, zoom);
    if (n === 0) {
      return 0;
    }
    if (date.getTime() >= range.end.getTime()) {
      return n - 1;
    }
    switch (zoom) {
      case 'hour': {
        const hours = (date.getTime() - range.start.getTime()) / 3600000;
        return Math.max(0, Math.min(n - 1, Math.floor(hours)));
      }
      case 'day': {
        const i = diffLocalCalendarDays(startOfDay(range.start), startOfDay(date));
        return Math.max(0, Math.min(n - 1, i));
      }
      case 'week': {
        const w0 = startOfWeek(new Date(range.start.getTime()));
        const w1 = startOfWeek(startOfDay(date));
        const days = diffLocalCalendarDays(w0, w1);
        const idx = Math.floor(days / 7);
        return Math.max(0, Math.min(n - 1, idx));
      }
      case 'month': {
        const s = range.start;
        const m =
          (date.getFullYear() - s.getFullYear()) * 12 + (date.getMonth() - s.getMonth());
        return Math.max(0, Math.min(n - 1, m));
      }
      default: {
        const i = diffLocalCalendarDays(startOfDay(range.start), startOfDay(date));
        return Math.max(0, Math.min(n - 1, i));
      }
    }
  }

  /**
   * First column index **strictly after** the period containing `endDate` (work
   * order bar’s exclusive end in day space is the morning after the last day).
   */
  getExclusiveEndColumnIndex(
    endDate: Date,
    range: TimelineRange,
    zoom: TimelineZoom
  ): number {
    switch (zoom) {
      case 'hour':
      case 'day':
        return this.getColumnIndexForDate(addDays(startOfDay(endDate), 1), range, zoom);
      case 'week':
        return this.getColumnIndexForDate(addDays(startOfWeek(endDate), 7), range, zoom);
      case 'month': {
        const d = startOfDay(endDate);
        // First moment after the calendar month of `endDate` (local)
        const firstOfNext = new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0, 0);
        return this.getColumnIndexForDate(firstOfNext, range, zoom);
      }
      default:
        return this.getColumnIndexForDate(addDays(startOfDay(endDate), 1), range, zoom);
    }
  }

  getColumns(range: TimelineRange, zoom: TimelineZoom): TimelineColumn[] {
    const columns: TimelineColumn[] = [];
    const start = new Date(range.start);
    const end = new Date(range.end);

    if (zoom === 'hour') {
      const current = startOfHour(new Date(start));
      const endH = new Date(end);
      while (current < endH) {
        columns.push({
          label: current.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            hour12: true,
          }),
          date: new Date(current),
        });
        current.setTime(current.getTime() + 60 * 60 * 1000);
      }
      return columns;
    }

    if (zoom === 'day') {
      let current = startOfDay(new Date(start));
      const endD = new Date(end);
      while (current < endD) {
        columns.push({
          label: current.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          date: new Date(current),
        });
        current = addDays(current, 1);
      }
      return columns;
    }

    if (zoom === 'week') {
      let current = new Date(start);
      const endW = new Date(end);
      while (current < endW) {
        columns.push({
          label: `Week of ${current.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}`,
          date: new Date(current),
        });
        current = addDays(current, 7);
      }
      return columns;
    }

    // month
    const current = new Date(start.getFullYear(), start.getMonth(), 1, 0, 0, 0, 0);
    const endM = new Date(end);
    while (current < endM) {
      columns.push({
        label: current.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        date: new Date(current),
      });
      current.setMonth(current.getMonth() + 1);
    }
    return columns;
  }

  getTotalWidth(columnCount: number, zoom: TimelineZoom): number {
    return columnCount * this.getColumnWidth(zoom);
  }

  getColumnWidth(zoom: TimelineZoom): number {
    switch (zoom) {
      case 'hour':
        return 100;
      case 'day':
        return 120;
      case 'week':
        return 160;
      case 'month':
        return 124;
      default:
        return 120;
    }
  }

  // ─── Legacy: fixed "catalog" range (rarely used; features folder) ───────────
  getVisibleRange(zoom: TimelineZoom): TimelineRange {
    const a = new Date(2023, 0, 1);
    const b = new Date(2027, 0, 1);
    if (zoom === 'hour') {
      return { start: startOfHour(a), end: addHours(b, 0) };
    }
    if (zoom === 'day') {
      return { start: startOfDay(a), end: startOfDay(b) };
    }
    if (zoom === 'week') {
      return { start: startOfWeek(a), end: startOfWeek(b) };
    }
    if (zoom === 'month') {
      return { start: startOfMonth(a), end: startOfMonth(b) };
    }
    return { start: startOfDay(a), end: startOfDay(b) };
  }
}
