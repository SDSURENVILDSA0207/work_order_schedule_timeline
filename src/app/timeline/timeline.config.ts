/**
 * Central numeric knobs for the interactive timeline. Change here instead of
 * sprinkling magic numbers in components and services.
 *
 * @upgrade If column counts or radii are tuned up further, add virtualization for the header/body
 *   rows so DOM size stays bounded on low-end devices.
 */
export const TIMELINE_UI_STORAGE_KEY = 'work_order_timeline_state';

export const TIMELINE_CONFIG = {
  /** Pixels from viewport edge that triggers load-more when scrolling. */
  loadMoreThresholdPx: 600,
  /** Day / week / month (or hours) to prepend or append in one grow step. */
  prependAppendStep: 6,
  // --- initial window (half-open [start, end)) for each zoom ---
  /** Day view: this many local calendar days before and after "today" (inclusive of today). */
  dayViewRadiusDays: 90,
  /**
   * Week view: this many 7-day columns on each side of the week that contains
   * "today" (not counting that center week) → (2*52 + 1) week columns in total.
   */
  weekViewRadiusWeeks: 52,
  /** Month view: this many first-of-month columns before/after the month of "today" (exclusive end adds one more). */
  monthViewRadiusMonths: 12,
  /**
   * Hour view: "radius" in hours (12 days before and after the current hour
   * bucket, in whole-hour steps).
   */
  hourViewRadiusHours: 12 * 24,
} as const;
