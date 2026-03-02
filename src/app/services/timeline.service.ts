/**
 * Timeline Service - Date-to-pixel math and column generation
 * Handles the trickiest part: converting dates to pixel positions across zoom levels
 */

import { Injectable } from '@angular/core';
import type { TimelineZoom } from '../models/work-order.model';
import { addDays, diffDays, parseDate } from '../utils/date.utils';

export interface TimelineRange {
  start: Date;
  end: Date;
}

export interface TimelineColumn {
  label: string;
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class TimelineService {
  /**
   * Get visible date range centered on today.
   * Extended range for infinite horizontal scrolling - users can scroll to see all dates.
   */
  getVisibleRange(zoom: TimelineZoom): TimelineRange {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (zoom) {
      case 'day':
        return {
          start: addDays(today, -365),
          end: addDays(today, 365),
        };
      case 'week':
        return {
          start: addDays(today, -730),
          end: addDays(today, 730),
        };
      case 'month':
        return {
          start: addDays(today, -1095),
          end: addDays(today, 1095),
        };
      default:
        return {
          start: addDays(today, -365),
          end: addDays(today, 365),
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
    const daysFromStart = diffDays(rangeStart, d);

    if (daysFromStart < 0) return 0;
    if (daysFromStart > totalDays) return totalWidth;

    return (daysFromStart / totalDays) * totalWidth;
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
    start.setHours(0, 0, 0, 0);

    const end = new Date(range.end);
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
      // Align to week start (Sunday)
      const day = current.getDay();
      current.setDate(current.getDate() - day);
      while (current <= end) {
        const weekEnd = addDays(current, 6);
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
      // month
      const current = new Date(start.getFullYear(), start.getMonth(), 1);
      while (current <= end) {
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
    const colWidth = zoom === 'day' ? 80 : zoom === 'week' ? 120 : 160;
    return columns.length * colWidth;
  }

  getColumnWidth(zoom: TimelineZoom): number {
    return zoom === 'day' ? 80 : zoom === 'week' ? 120 : 160;
  }
}
