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
 * Add hours to a date
 */
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Difference in days between two dates (can be fractional)
 */
export function diffDays(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);
}

/**
 * Parse ISO date string (YYYY-MM-DD) to Date at local midnight.
 * Accepts YYYY-MM-DD only; if string has more (e.g. YYYY-MM-DDTHH:mm:ss), uses first 10 chars.
 * Returns invalid-date-safe: if parsing fails, returns a fallback date so bar logic never breaks.
 */
export function parseDate(iso: string | null | undefined): Date {
  const s = typeof iso === 'string' ? iso.trim().slice(0, 10) : '';
  const parts = s.split('-');
  if (parts.length !== 3) return new Date();
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) return new Date();
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return new Date();
  return date;
}

/**
 * Format date to ISO YYYY-MM-DD in local time (so saved dates match what the user picked).
 */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Get start of day for a date
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get start of hour for a date (minutes, seconds, ms zeroed)
 */
export function startOfHour(date: Date): Date {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  return d;
}

/**
 * Get start of week (Sunday 00:00) for a date
 */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

/**
 * Get first day of month at 00:00 for a date
 */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Add months to a date (same day of month when possible)
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Number of days in the month of the given date (28–31)
 */
export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
