import {
  Component,
  inject,
  signal,
  computed,
  afterNextRender,
  ViewChild,
  ElementRef,
} from '@angular/core';
import type { WorkCenterDocument, WorkOrderDocument, TimelineZoom } from '../../models/work-order.model';
import { WorkOrderService } from '../../services/work-order.service';
import { TimelineService } from '../../services/timeline.service';
import { parseDate, toISODate, addDays } from '../../utils/date.utils';
import { TimescaleSelectorComponent } from '../timescale-selector/timescale-selector.component';
import { WorkOrderBarComponent } from '../work-order-bar/work-order-bar.component';
import { WorkOrderPanelComponent } from '../work-order-panel/work-order-panel.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TimescaleSelectorComponent, WorkOrderBarComponent, WorkOrderPanelComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  protected workOrderService = inject(WorkOrderService);
  protected timelineService = inject(TimelineService);

  /** Default timescale on load/reload. */
  zoom = signal<TimelineZoom>('month');
  hoveredRowId = signal<string | null>(null);
  /** Work center ids of rows that have a bar actions menu open; all get raised z-index so multiple dropdowns can display. */
  openMenuRowIds = signal<string[]>([]);
  /** X position (px) of pointer in timeline content; used to show "Click to add dates" at hovered cell. */
  hoveredCellX = signal<number | null>(null);
  panelOpen = signal<'create' | 'edit' | null>(null);
  createContext = signal<{ workCenterId: string; startDate: string } | null>(null);
  editOrder = signal<WorkOrderDocument | null>(null);
  /** Draft start/end from panel while editing; bar uses these for live preview. */
  draftOrderDates = signal<{ startDate: string; endDate: string } | null>(null);

  @ViewChild('gridScroll') gridScrollRef?: ElementRef<HTMLElement>;

  workCenters = this.workOrderService.workCenters;
  workOrders = this.workOrderService.workOrders;

  range = computed(() => this.timelineService.getVisibleRange(this.zoom()));
  columns = computed(() =>
    this.timelineService.getColumns(this.range(), this.zoom())
  );
  totalWidth = computed(() => {
    const cols = this.columns();
    const colWidth = this.timelineService.getColumnWidth(this.zoom());
    return cols.length * colWidth;
  });

  /** Column width in px for placeholder and layout (exposed to template). */
  colWidth = computed(() => this.timelineService.getColumnWidth(this.zoom()));
  todayPosition = computed(() => {
    const range = this.range();
    const total = this.totalWidth();
    const pos = this.timelineService.dateToPixel(
      new Date(),
      range.start,
      range.end,
      total,
      this.zoom()
    );
    return pos;
  });
  /** Left edge of the cell containing today (so vertical line and badge stick to cell left). */
  todayCellLeft = computed(() => {
    const pos = this.todayPosition();
    const cw = this.colWidth();
    return Math.floor(pos / cw) * cw;
  });
  isTodayInRange = computed(() => {
    const today = new Date();
    const range = this.range();
    return today >= range.start && today <= range.end;
  });

  setZoom(z: TimelineZoom): void {
    this.zoom.set(z);
    this.scrollToCurrentPeriod();
  }

  /** X position in timeline content (0..totalWidth); accounts for horizontal scroll. */
  private contentXFromEvent(rowRect: DOMRect, clientX: number): number {
    const scrollEl = this.gridScrollRef?.nativeElement;
    const scrollLeft = scrollEl ? scrollEl.scrollLeft : 0;
    return clientX - rowRect.left + scrollLeft;
  }

  openCreatePanel(workCenterId: string, contentX: number): void {
    this.draftOrderDates.set(null);
    const columns = this.columns();
    const colWidth = this.colWidth();
    const total = this.totalWidth();
    const clampedX = Math.max(0, Math.min(contentX, total - 1));
    const cellIndex = Math.min(
      Math.floor(clampedX / colWidth),
      columns.length - 1
    );
    const cellDate = columns[Math.max(0, cellIndex)]?.date;
    const startDate = cellDate ? toISODate(cellDate) : toISODate(this.timelineService.pixelToDate(clampedX, this.range().start, this.range().end, total));
    this.createContext.set({ workCenterId, startDate });
    this.editOrder.set(null);
    this.panelOpen.set('create');
  }

  openEditPanel(order: WorkOrderDocument): void {
    this.draftOrderDates.set(null);
    this.editOrder.set(order);
    this.createContext.set(null);
    this.panelOpen.set('edit');
  }

  closePanel(): void {
    this.panelOpen.set(null);
    this.createContext.set(null);
    this.editOrder.set(null);
  }

  /** Create panel opens only when clicking empty timeline area; work-order-bar stops propagation on bar click. */
  /** Start date = cell at click position (so created bar aligns with that cell). */
  onRowClick(workCenterId: string, event: MouseEvent): void {
    const row = event.currentTarget as HTMLElement;
    const rect = row.getBoundingClientRect();
    const contentX = this.contentXFromEvent(rect, event.clientX);
    this.openCreatePanel(workCenterId, contentX);
  }

  getBarPosition(order: WorkOrderDocument): { left: number; width: number } {
    const range = this.range();
    const zoom = this.zoom();
    const total = this.totalWidth();

    const isEditingThis = this.panelOpen() === 'edit' && this.editOrder()?.docId === order.docId;
    const draft = this.draftOrderDates();
    const useDraft = isEditingThis && draft != null;
    const startStr = useDraft ? draft.startDate : order.data.startDate;
    const endStr = useDraft ? draft.endDate : order.data.endDate;

    let startDate = parseDate(startStr);
    let endDate = parseDate(endStr);
    if (endDate.getTime() < startDate.getTime()) endDate = new Date(startDate.getTime());

    // Bar length = exact date range: from start date (00:00) to end of end date (start of next day)
    const leftPx = this.timelineService.dateToPixel(
      startDate,
      range.start,
      range.end,
      total,
      zoom
    );
    const rightPx = this.timelineService.dateToPixel(
      addDays(endDate, 1),
      range.start,
      range.end,
      total,
      zoom
    );
    const width = Math.max(rightPx - leftPx, 24);
    const left = Math.max(0, Math.min(leftPx, total - width));

    return { left, width };
  }

  onEdit(order: WorkOrderDocument): void {
    this.openEditPanel(order);
  }

  onDelete(order: WorkOrderDocument): void {
    this.workOrderService.deleteOrder(order.docId);
  }

  onPanelClosed(): void {
    this.draftOrderDates.set(null);
    this.closePanel();
  }

  onPanelDatesChange(dates: { startDate: string; endDate: string }): void {
    this.draftOrderDates.set(dates);
  }

  /** Track which rows have an open actions menu so all get raised z-index and multiple dropdowns can display. */
  onBarMenuOpenChange(workCenterId: string, open: boolean): void {
    this.openMenuRowIds.update((ids) =>
      open
        ? ids.includes(workCenterId)
          ? ids
          : [...ids, workCenterId]
        : ids.filter((id) => id !== workCenterId)
    );
  }

  onRowMouseEnter(workCenterId: string, event: MouseEvent): void {
    const row = event.currentTarget as HTMLElement;
    const rect = row.getBoundingClientRect();
    this.hoveredRowId.set(workCenterId);
    this.hoveredCellX.set(this.contentXFromEvent(rect, event.clientX));
  }

  onRowMouseMove(workCenterId: string, event: MouseEvent): void {
    const row = event.currentTarget as HTMLElement;
    const rect = row.getBoundingClientRect();
    this.hoveredRowId.set(workCenterId);
    this.hoveredCellX.set(this.contentXFromEvent(rect, event.clientX));
  }

  onRowMouseLeave(): void {
    this.hoveredRowId.set(null);
    this.hoveredCellX.set(null);
  }

  /** Returns { left, width } for the cell under the pointer in this row, or null if not hovering this row. */
  getCellHighlight(workCenterId: string): { left: number; width: number } | null {
    if (this.hoveredRowId() !== workCenterId) return null;
    const x = this.hoveredCellX();
    if (x == null) return null;
    const colWidth = this.timelineService.getColumnWidth(this.zoom());
    const total = this.totalWidth();
    const cellIndex = Math.floor(x / colWidth);
    const left = Math.max(0, Math.min(cellIndex * colWidth, total - colWidth));
    return { left, width: colWidth };
  }

  /** True if no work order bar overlaps this cell (placeholder should only show in empty cells). */
  isCellEmpty(workCenterId: string, cellLeft: number, cellWidth: number): boolean {
    const cellRight = cellLeft + cellWidth;
    const tolerance = 2; // px: don't show "Click to add dates" when a bar is even close to the cell
    const orders = this.workOrderService.getOrdersForWorkCenter(workCenterId);
    for (const order of orders) {
      const bar = this.getBarPosition(order);
      const barRight = bar.left + bar.width;
      if (bar.left - tolerance < cellRight && barRight + tolerance > cellLeft) return false;
    }
    return true;
  }

  constructor() {
    afterNextRender(() => {
      this.scrollToCurrentPeriod();
      // Run again after layout is fully ready so current period is reliably centered on load
      setTimeout(() => this.scrollToCurrentPeriod(), 100);
    });
  }

  /** Scroll so the current period (hour/day/week/month) is in view; used on load and when zoom changes. */
  scrollToToday(): void {
    this.scrollToCurrentPeriod();
  }

  /** Scroll timeline so current hour/day/week/month is centered in the viewport. */
  scrollToCurrentPeriod(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const scrollEl = document.querySelector('.timeline-grid-scroll') as HTMLElement;
        if (scrollEl) {
          const pos = this.todayPosition();
          const clientWidth = scrollEl.clientWidth;
          scrollEl.scrollLeft = Math.max(0, pos - clientWidth / 2);
        }
      });
    });
  }
}
