/**
 * Click hit-testing and 1D **pixel** interval overlap for the scrollable grid.
 * (This is not the same as business-rule date overlap in WorkOrderService — that uses inclusive ISO day ranges.)
 */

const DEFAULT_BAR_EDGE_INSET_PX = 6;

export interface BarPixelBox {
  left: number;
  width: number;
}

/** Map pointer X to column index from the row’s inner content box. */
export function columnIndexFromRowPointerX(
  clientX: number,
  rowRect: DOMRect,
  columnCount: number,
  columnWidthPx: number,
): number | null {
  if (columnCount <= 0 || columnWidthPx <= 0) {
    return null;
  }
  const x = clientX - rowRect.left;
  if (x < -1 || x > rowRect.width + 1) {
    return null;
  }
  return Math.max(0, Math.min(columnCount - 1, Math.floor(x / columnWidthPx)));
}

/**
 * True when a bar (with an inset) overlaps a cell [cellLeft, cellLeft + cellWidth) on the x axis.
 * Used to block create-on-empty-cell when a bar would cover that column.
 */
export function cellIntersectsBarInset(
  cellLeft: number,
  cellWidth: number,
  bar: BarPixelBox,
  insetPx: number = DEFAULT_BAR_EDGE_INSET_PX,
): boolean {
  const cellRight = cellLeft + cellWidth;
  const barRight = bar.left + bar.width;
  const innerLeft = bar.left + insetPx;
  const innerRight = barRight - insetPx;
  return innerLeft < cellRight && innerRight > cellLeft;
}
