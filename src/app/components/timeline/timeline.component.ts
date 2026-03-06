import {
  Component,
  inject,
  signal,
  computed,
  effect,
  afterNextRender,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter, debounceTime } from 'rxjs/operators';
import type { WorkCenterDocument, WorkOrderDocument, TimelineZoom } from '../../models/work-order.model';
import { WorkOrderService } from '../../services/work-order.service';
import type { TimelineRange } from '../../services/timeline.service';
import { TimelineService } from '../../services/timeline.service';
import { parseDate, toISODate, addDays, startOfDay } from '../../utils/date.utils';
import { TimescaleSelectorComponent } from '../timescale-selector/timescale-selector.component';
import { WorkOrderBarComponent } from '../work-order-bar/work-order-bar.component';
import { WorkOrderPanelComponent } from '../work-order-panel/work-order-panel.component';

const TIMELINE_STATE_KEY = 'work_order_timeline_state';

interface TimelineState {
  zoom: TimelineZoom;
  scrollLeft: number;
}

function loadTimelineState(): TimelineState | null {
  try {
    const raw = localStorage.getItem(TIMELINE_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && 'zoom' in parsed && 'scrollLeft' in parsed) {
      const zoom = parsed.zoom as string;
      const scrollLeft = Number(parsed.scrollLeft);
      if (['hour', 'day', 'week', 'month'].includes(zoom) && Number.isFinite(scrollLeft) && scrollLeft >= 0) {
        return { zoom: zoom as TimelineZoom, scrollLeft };
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function saveTimelineState(state: TimelineState): void {
  try {
    localStorage.setItem(TIMELINE_STATE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

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
  zoom = signal<TimelineZoom>('day');
  hoveredRowId = signal<string | null>(null);
  /** Single open bar id "workCenterId:orderDocId"; when one menu opens, others close. */
  openMenuBarId = signal<string | null>(null);
  /** Column index of the hovered cell in the current row; placeholder is shown in that cell (stays attached on scroll). */
  hoveredCellIndex = signal<number | null>(null);
  panelOpen = signal<'create' | 'edit' | null>(null);
  createContext = signal<{ workCenterId: string; startDate: string } | null>(null);
  editOrder = signal<WorkOrderDocument | null>(null);
  /** Draft start/end from panel while editing; bar uses these for live preview. */
  draftOrderDates = signal<{ startDate: string; endDate: string } | null>(null);

  @ViewChild('gridScroll') gridScrollRef?: ElementRef<HTMLElement>;
  @ViewChildren('placeholderWrapperRef') placeholderWrappers!: QueryList<ElementRef<HTMLElement>>;

  private destroyRef = inject(DestroyRef);
  private savedStateOnLoad: TimelineState | null = null;

  /** Dynamic range for infinite scroll; extended when user scrolls near left/right edges. */
  private rangeSignal = signal<TimelineRange>(
    this.timelineService.getInitialRange(this.zoom())
  );
  range = computed(() => this.rangeSignal());

  private static readonly LOAD_MORE_THRESHOLD_PX = 600;
  private static readonly PREPEND_APPEND_PERIODS = 6;
  /** After prepending columns, add this to scrollLeft so the view doesn't jump. */
  private pendingPrependPx = signal(0);

  workCenters = this.workOrderService.workCenters;
  workOrders = this.workOrderService.workOrders;

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
  /** Column index for the current day (placeholder shows in this column when hovering a row). */
  currentDayColumnIndex = computed(() => {
    if (!this.isTodayInRange()) return null;
    const pos = this.todayPosition();
    const cw = this.colWidth();
    const cols = this.columns();
    const idx = Math.floor(pos / cw);
    return Math.max(0, Math.min(cols.length - 1, idx));
  });

  setZoom(z: TimelineZoom): void {
    this.zoom.set(z);
    this.rangeSignal.set(this.timelineService.getInitialRange(z));
    this.pendingPrependPx.set(0);
    this.scrollToCurrentPeriod();
  }

  /** X position in timeline content (0..totalWidth); accounts for horizontal scroll. */
  private contentXFromEvent(rowRect: DOMRect, clientX: number): number {
    const scrollEl = this.gridScrollRef?.nativeElement;
    const scrollLeft = scrollEl ? scrollEl.scrollLeft : 0;
    return clientX - rowRect.left + scrollLeft;
  }

  /** Open create panel with start date from the clicked cell (so the date matches the block). */
  onCellClick(workCenterId: string, cellIndex: number): void {
    this.draftOrderDates.set(null);
    const columns = this.columns();
    const col = columns[Math.max(0, Math.min(cellIndex, columns.length - 1))];
    const raw = col?.date;
    if (!raw) return;
    const zoom = this.zoom();
    const year = raw.getFullYear();
    const month = raw.getMonth();
    const day = zoom === 'month' ? 1 : raw.getDate();
    const dateForPrefill = new Date(year, month, day);
    const startDate = toISODate(dateForPrefill);
    this.createContext.set({ workCenterId, startDate });
    this.editOrder.set(null);
    this.panelOpen.set('create');
  }

  openCreatePanel(workCenterId: string, contentX: number): void {
    const columns = this.columns();
    const colWidth = this.colWidth();
    const total = this.totalWidth();
    const clampedX = Math.max(0, Math.min(contentX, total - 1));
    const cellIndex = Math.min(Math.floor(clampedX / colWidth), columns.length - 1);
    this.onCellClick(workCenterId, cellIndex);
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

    let startDate = startOfDay(parseDate(startStr));
    let endDate = startOfDay(parseDate(endStr));
    if (endDate.getTime() < startDate.getTime()) endDate = new Date(startDate.getTime());

    // Bar spans [startDate 00:00, end of endDate] = [startDate, start of next day after endDate]
    const barEndExclusive = addDays(endDate, 1);
    const leftPx = this.timelineService.dateToPixel(
      startDate,
      range.start,
      range.end,
      total,
      zoom
    );
    const rightPx = this.timelineService.dateToPixel(
      barEndExclusive,
      range.start,
      range.end,
      total,
      zoom
    );
    const widthPx = Math.max(rightPx - leftPx, 24);
    const leftPxClamped = Math.max(0, Math.min(leftPx, total - widthPx));
    // Round to whole pixels so bars align cleanly with the grid
    return {
      left: Math.round(leftPxClamped),
      width: Math.round(widthPx),
    };
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

  /** When a bar’s menu opens, set it as the only open one (others close via forceCloseMenu). */
  onBarMenuOpenChange(workCenterId: string, orderDocId: string, open: boolean): void {
    if (open) {
      this.openMenuBarId.set(`${workCenterId}:${orderDocId}`);
    } else if (this.openMenuBarId() === `${workCenterId}:${orderDocId}`) {
      this.openMenuBarId.set(null);
    }
  }

  onRowMouseEnter(workCenterId: string): void {
    this.hoveredRowId.set(workCenterId);
  }

  onRowMouseLeave(): void {
    this.hoveredRowId.set(null);
    this.hoveredCellIndex.set(null);
  }

  /** Cell hover: placeholder is rendered inside this cell DOM so it moves with the row on scroll. */
  onCellMouseEnter(workCenterId: string, cellIndex: number): void {
    this.hoveredRowId.set(workCenterId);
    this.hoveredCellIndex.set(cellIndex);
  }

  onCellMouseLeave(): void {
    this.hoveredCellIndex.set(null);
  }

  /** Prepend past dates when scrolling left, append future dates when scrolling right. */
  private checkInfiniteScroll(scrollEl: HTMLElement): void {
    const scrollLeft = scrollEl.scrollLeft;
    const maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
    const colWidth = this.timelineService.getColumnWidth(this.zoom());
    const threshold = TimelineComponent.LOAD_MORE_THRESHOLD_PX;
    const n = TimelineComponent.PREPEND_APPEND_PERIODS;

    if (scrollLeft < threshold) {
      const current = this.rangeSignal();
      const newStart = this.timelineService.extendRangeStart(current, this.zoom(), n);
      this.rangeSignal.set({ start: newStart, end: current.end });
      this.pendingPrependPx.set(n * colWidth);
    } else if (maxScroll > 0 && maxScroll - scrollLeft < threshold) {
      const current = this.rangeSignal();
      const newEnd = this.timelineService.extendRangeEnd(current, this.zoom(), n);
      this.rangeSignal.set({ start: current.start, end: newEnd });
    }
  }

  /** Position placeholder + tooltip as fixed with high z-index so they sit above current month badge. */
  updatePlaceholderPosition(): void {
    const wrapper = this.placeholderWrappers?.first?.nativeElement;
    if (!wrapper) return;
    const cell = wrapper.parentElement;
    if (!cell) return;
    const rect = cell.getBoundingClientRect();
    const w = wrapper.offsetWidth;
    const h = wrapper.offsetHeight;
    wrapper.style.position = 'fixed';
    wrapper.style.left = `${rect.left + (rect.width - w) / 2}px`;
    wrapper.style.top = `${rect.top + (rect.height - h) / 2}px`;
    wrapper.style.zIndex = '20';
  }

  /** True if no work order bar meaningfully overlaps this cell (placeholder only in empty cells; never over bars). */
  isCellEmpty(workCenterId: string, cellLeft: number, cellWidth: number): boolean {
    const cellRight = cellLeft + cellWidth;
    // Inset so a bar must extend this far into the cell to hide the placeholder (avoids hiding on 1px border/rounding)
    const inset = 6;
    const orders = this.workOrderService.getOrdersForWorkCenter(workCenterId);
    for (const order of orders) {
      const bar = this.getBarPosition(order);
      const barRight = bar.left + bar.width;
      const innerLeft = bar.left + inset;
      const innerRight = barRight - inset;
      if (innerLeft < cellRight && innerRight > cellLeft) return false;
    }
    return true;
  }

  constructor() {
    const saved = loadTimelineState();
    if (saved) {
      /* Keep default zoom (day) on reload; only restore scroll position */
      this.savedStateOnLoad = saved;
    }
    afterNextRender(() => {
      const scrollEl = this.gridScrollRef?.nativeElement;
      if (scrollEl) {
        if (this.savedStateOnLoad != null) {
          const maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
          scrollEl.scrollLeft = Math.min(this.savedStateOnLoad.scrollLeft, maxScroll);
          this.savedStateOnLoad = null;
        } else {
          this.scrollToCurrentPeriod();
          setTimeout(() => this.scrollToCurrentPeriod(), 100);
        }
        fromEvent(scrollEl, 'scroll')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.updatePlaceholderPosition();
            this.checkInfiniteScroll(scrollEl);
          });
        fromEvent(scrollEl, 'scroll')
          .pipe(
            debounceTime(150),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(() => {
            saveTimelineState({
              zoom: this.zoom(),
              scrollLeft: scrollEl.scrollLeft,
            });
          });
        // Pixel-based horizontal wheel scroll so trackpad/mouse wheel scrolls smoothly (no step snapping)
        fromEvent<WheelEvent>(scrollEl, 'wheel', { passive: false })
          .pipe(
            filter((e) => e.deltaX !== 0),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe((e) => {
            e.preventDefault();
            scrollEl.scrollLeft = Math.max(
              0,
              Math.min(scrollEl.scrollLeft + e.deltaX, scrollEl.scrollWidth - scrollEl.clientWidth)
            );
          });
      }
    });
    effect(() => {
      const _row = this.hoveredRowId();
      const _cell = this.hoveredCellIndex();
      if (_row != null && _cell != null) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => this.updatePlaceholderPosition());
        });
      }
    });
    effect(() => {
      const pending = this.pendingPrependPx();
      if (pending <= 0) return;
      const scrollEl = this.gridScrollRef?.nativeElement;
      if (!scrollEl) return;
      setTimeout(() => {
        scrollEl.scrollLeft += pending;
        this.pendingPrependPx.set(0);
      }, 0);
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
