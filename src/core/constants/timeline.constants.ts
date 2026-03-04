export type TimelineZoomLevel = 'day' | 'week' | 'month';

export const TIMELINE_ZOOM_LEVELS: TimelineZoomLevel[] = ['day', 'week', 'month'];

export const STATUS_DISPLAY_LABELS: Record<string, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  complete: 'Complete',
  blocked: 'Blocked',
};

/** Status badge/text colors per NDS */
export const STATUS_COLORS: Record<string, string> = {
  open: 'rgba(62, 64, 219, 1)',
  'in-progress': 'rgba(62, 64, 219, 1)',
  complete: 'rgba(8, 162, 104, 1)',
  blocked: 'rgba(177, 54, 0, 1)',
};

/** Light bar background tints (image: light green, light purple, light orange bars) */
export const STATUS_BAR_BG: Record<string, string> = {
  open: 'rgba(62, 64, 219, 0.12)',
  'in-progress': 'rgba(62, 64, 219, 0.12)',
  complete: 'rgba(8, 162, 104, 0.15)',
  blocked: 'rgba(177, 54, 0, 0.12)',
};

export const STATUS_BAR_BORDER: Record<string, string> = {
  open: 'rgba(62, 64, 219, 0.25)',
  'in-progress': 'rgba(62, 64, 219, 0.25)',
  complete: 'rgba(8, 162, 104, 0.35)',
  blocked: 'rgba(177, 54, 0, 0.3)',
};

/** Muted background for status pill inside the bar */
export const STATUS_PILL_BG: Record<string, string> = {
  open: 'rgba(209, 242, 255, 1)',
  'in-progress': 'rgba(214, 216, 255, 1)',
  complete: 'rgba(209, 250, 179, 1)',
  blocked: 'rgba(255, 235, 207, 1)',
};
