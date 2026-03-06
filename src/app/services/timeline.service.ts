/**
 * Timeline Service - Date-to-pixel math and column generation
 * Handles the trickiest part: converting dates to pixel positions across zoom levels
 */

import { Injectable } from '@angular/core';
import type { TimelineZoom } from '../models/work-order.model';
import {
  addDays,
  addHours,
  addMonths,
  diffDays,
  parseDate,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
} from '../utils/date.utils';

export interface TimelineRange {
  start: Date;
  end: Date;
}

export interface TimelineColumn {
  label: string;
  date: Date;
}

/** Fixed timeline range: Jan 2023 through Dec 2026 (all columns in this span). */
const TIMELINE_RANGE_START = new Date(2023, 0, 1, 0, 0, 0, 0);   // Jan 1, 2023
const TIMELINE_RANGE_END = new Date(2027, 0, 1, 0, 0, 0, 0);     // Jan 1, 2027 (exclusive, so Dec 2026 included)

@Injectable({ providedIn: 'root' })
export class TimelineService {
  /**
   * Initial range for infinite scroll: centered on today with default window.
   */
  getInitialRange(zoom: TimelineZoom): TimelineRange {
    const now = new Date();
    switch (zoom) {
      case 'hour':
        return {
          start: startOfHour(addHours(now, -12 * 24)),
          end: startOfHour(addHours(now, 12 * 24)),
        };
      case 'day':
        return {
          start: startOfDay(addDays(now, -90)),
          end: startOfDay(addDays(now, 90)),
        };
      case 'week':
        return {
          start: startOfWeek(addDays(now, -52 * 7)),
          end: startOfWeek(addDays(now, 52 * 7)),
        };
      case 'month':
        return {
          start: startOfMonth(addMonths(now, -12)),
          end: startOfMonth(addMonths(now, 13)), // 13 so end is exclusive and we include +12
        };
      default:
        return {
          start: startOfDay(addDays(now, -90)),
          end: startOfDay(addDays(now, 90)),
        };
    }
  }

  /**
   * Extend range by N periods to the past (for prepend when scrolling left).
   */
  extendRangeStart(range: TimelineRange, zoom: TimelineZoom, periods: number): Date {
    const start = new Date(range.start);
    switch (zoom) {
      case 'hour':
        start.setTime(start.getTime() - periods * 60 * 60 * 1000);
        return startOfHour(start);
      case 'day':
        return startOfDay(addDays(start, -periods));
      case 'week':
        return startOfWeek(addDays(start, -periods * 7));
      case 'month':
        return startOfMonth(addMonths(start, -periods));
      default:
        return startOfDay(addDays(start, -periods));
    }
  }

  /**
   * Extend range by N periods to the future (for append when scrolling right).
   */
  extendRangeEnd(range: TimelineRange, zoom: TimelineZoom, periods: number): Date {
    const end = new Date(range.end);
    switch (zoom) {
      case 'hour':
        end.setTime(end.getTime() + periods * 60 * 60 * 1000);
        return startOfHour(end);
      case 'day':
        return startOfDay(addDays(end, periods));
      case 'week':
        return startOfWeek(addDays(end, periods * 7));
      case 'month':
        return startOfMonth(addMonths(end, periods));
      default:
        return startOfDay(addDays(end, periods));
    }
  }

  /**
   * Get visible date range: fixed Jan 2023 – Dec 2026 for all zoom levels.
   * Month view shows 48 columns (Jan 2023 … Dec 2026).
   */
  getVisibleRange(zoom: TimelineZoom): TimelineRange {
    switch (zoom) {
      case 'hour':
        return {
          start: startOfHour(new Date(TIMELINE_RANGE_START)),
          end: startOfHour(new Date(TIMELINE_RANGE_END)),
        };
      case 'day':
        return {
          start: startOfDay(new Date(TIMELINE_RANGE_START)),
          end: startOfDay(new Date(TIMELINE_RANGE_END)),
        };
      case 'week':
        return {
          start: startOfWeek(new Date(TIMELINE_RANGE_START)),
          end: startOfWeek(new Date(TIMELINE_RANGE_END)),
        };
      case 'month':
        return {
          start: startOfMonth(new Date(TIMELINE_RANGE_START)),
          end: startOfMonth(new Date(TIMELINE_RANGE_END)),
        };
      default:
        return {
          start: startOfDay(new Date(TIMELINE_RANGE_START)),
          end: startOfDay(new Date(TIMELINE_RANGE_END)),
        };
    }
  }

  /**
   * Convert a date to pixel position (left offset) within the visible range
   * Formula: position = (days from rangeStart / total days) * totalWidth
   */
  dateToPixel(
    date: Date | string,
    rangeStart: Date,
    rangeEnd: Date,
    totalWidth: number,
    zoom: TimelineZoom
  ): number {
    const d = typeof date === 'string' ? parseDate(date) : date;
    const totalDays = diffDays(rangeStart, rangeEnd);
    if (totalDays <= 0) return 0;
    const daysFromStart = diffDays(rangeStart, d);

    if (daysFromStart <= 0) return 0;
    if (daysFromStart >= totalDays) return totalWidth;

    return (daysFromStart / totalDays) * totalWidth;
  }

  /**
   * Get the column index for a date so bar positions snap to grid cell boundaries.
   * Returns the index of the column that contains this date (start of that period).
   */
  getColumnIndexForDate(
    date: Date,
    range: TimelineRange,
    zoom: TimelineZoom
  ): number {
    const totalDays = diffDays(range.start, range.end);
    if (totalDays <= 0) return 0;

    switch (zoom) {
      case 'hour': {
        const hoursFromStart = diffDays(range.start, date) * 24;
        return Math.max(0, Math.floor(hoursFromStart));
      }
      case 'day': {
        const daysFromStart = diffDays(range.start, date);
        return Math.max(0, Math.floor(daysFromStart));
      }
      case 'week': {
        const daysFromStart = diffDays(range.start, date);
        return Math.max(0, Math.floor(daysFromStart / 7));
      }
      case 'month': {
        const monthsFromStart =
          (date.getFullYear() - range.start.getFullYear()) * 12 +
          (date.getMonth() - range.start.getMonth());
        return Math.max(0, Math.floor(monthsFromStart));
      }
      default: {
        const daysFromStart = diffDays(range.start, date);
        return Math.max(0, Math.floor(daysFromStart));
      }
    }
  }

  /**
   * Get the column index of the period boundary *after* the end date.
   * Bar width = (this - startCol) * colWidth so the bar ends at the right edge of the end date's period.
   */
  getExclusiveEndColumnIndex(
    endDate: Date,
    range: TimelineRange,
    zoom: TimelineZoom
  ): number {
    switch (zoom) {
      case 'hour':
      case 'day':
        return this.getColumnIndexForDate(addDays(endDate, 1), range, zoom);
      case 'week':
        return this.getColumnIndexForDate(
          addDays(startOfWeek(endDate), 7),
          range,
          zoom
        );
      case 'month':
        return this.getColumnIndexForDate(
          new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1),
          range,
          zoom
        );
      default:
        return this.getColumnIndexForDate(addDays(endDate, 1), range, zoom);
    }
  }

  /**
   * Convert pixel position to date (for click-to-create)
   */
  pixelToDate(
    pixelX: number,
    rangeStart: Date,
    rangeEnd: Date,
    totalWidth: number
  ): Date {
    const totalDays = diffDays(rangeStart, rangeEnd);
    const fraction = pixelX / totalWidth;
    const daysToAdd = fraction * totalDays;
    return addDays(rangeStart, daysToAdd);
  }

  /**
   * Generate column headers for the timeline based on zoom level
   */
  getColumns(range: TimelineRange, zoom: TimelineZoom): TimelineColumn[] {
    const columns: TimelineColumn[] = [];
    const start = new Date(range.start);
    const end = new Date(range.end);

    if (zoom === 'hour') {
      const current = startOfHour(new Date(start));
      const endHour = startOfHour(new Date(end));
      while (current <= endHour) {
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

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (zoom === 'day') {
      const current = new Date(start);
      while (current <= end) {
        columns.push({
          label: current.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          date: new Date(current),
        });
        current.setDate(current.getDate() + 1);
      }
    } else if (zoom === 'week') {
      const current = new Date(start);
      while (current <= end) {
        columns.push({
          label: `Week of ${current.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}`,
          date: new Date(current),
        });
        current.setDate(current.getDate() + 7);
      }
    } else {
      // month: Jan 2023 through Dec 2026 (exclude Jan 2027)
      const current = new Date(start.getFullYear(), start.getMonth(), 1);
      while (current < end) {
        columns.push({
          label: current.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
          date: new Date(current),
        });
        current.setMonth(current.getMonth() + 1);
      }
    }

    return columns;
  }

  /**
   * Calculate total pixel width for the timeline grid based on columns
   */
  getTotalWidth(columns: TimelineColumn[], zoom: TimelineZoom): number {
    const colWidth = this.getColumnWidth(zoom);
    return columns.length * colWidth;
  }

  /** Column width per zoom so labels (month/week/day/hour) are readable and not shrunk. */
  getColumnWidth(zoom: TimelineZoom): number {
    switch (zoom) {
      case 'hour':
        return 100;  // "Jan 1, 10 AM"
      case 'day':
        return 120;  // "Mar 1, 2026"
      case 'week':
        return 160;  // "Week of Jan 5"
      case 'month':
        return 130;  // "Dec 2024"
      default:
        return 120;
    }
  }
}
