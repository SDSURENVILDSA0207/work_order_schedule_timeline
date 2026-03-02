/**
 * Pure date helper functions for timeline calculations
 */

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Difference in days between two dates (can be fractional)
 */
export function diffDays(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);
}

/**
 * Parse ISO date string to Date (start of day UTC)
 */
export function parseDate(iso: string): Date {
  return new Date(iso + 'T00:00:00.000Z');
}

/**
 * Format date to ISO YYYY-MM-DD
 */
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Get start of day for a date
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
