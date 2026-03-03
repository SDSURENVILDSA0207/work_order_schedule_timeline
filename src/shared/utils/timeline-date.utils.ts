export function getVisibleDateRange(
  _centerDate: Date,
  _zoomLevel: string
): { start: Date; end: Date } {
  const start = new Date();
  const end = new Date();
  return { start, end };
}
