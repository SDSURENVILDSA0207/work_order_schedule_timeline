import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import type {
  CreateWorkOrderContext,
  DraftOrderDateRange,
  PanelMode,
  TimelineZoom,
  WorkOrderDocument,
} from '../models/work-order.model';
import { WorkOrderService } from './work-order.service';
import { TimelineService, type TimelineRange } from './timeline.service';
import { layoutWorkOrderBar, type BarLayoutContext } from '../utils/timeline-bar-layout.util';
import { cellIntersectsBarInset, columnIndexFromRowPointerX } from '../utils/timeline-spatial.utils';
import { isoStartDateForColumn } from '../utils/timeline-column-date.util';
import { TIMELINE_CONFIG, TIMELINE_UI_STORAGE_KEY } from '../timeline/timeline.config';

/** Persisted scroll + zoom (localStorage). */
interface TimelineScrollPersist {
  zoom: TimelineZoom;
  scrollLeft: number;
}

@Injectable({ providedIn: 'root' })
export class TimelineViewStateService {
  private readonly timelineService = inject(TimelineService);
  private readonly workOrderService = inject(WorkOrderService);

  /** Timescale. */
  readonly zoom = signal<TimelineZoom>('month');

  private readonly rangePrivate = signal<TimelineRange>(
    this.timelineService.getInitialRange(this.zoom()),
  );
  /** Visible half-open [start, end) window. */
  readonly range = computed(() => this.rangePrivate());

  private readonly pendingPrependPx = signal(0);

  /** Work Order Details: create or edit, or closed. */
  readonly panelMode = signal<PanelMode | null>(null);
  readonly createContext = signal<CreateWorkOrderContext | null>(null);
  readonly editOrder = signal<WorkOrderDocument | null>(null);
  readonly draftOrderDates = signal<DraftOrderDateRange | null>(null);

  readonly hoveredRowId = signal<string | null>(null);
  readonly hoveredCellIndex = signal<number | null>(null);
  /** `workCenterId:orderDocId` when a bar’s kebab menu is open. */
  readonly openMenuBarId = signal<string | null>(null);

  workCenters = this.workOrderService.workCenters;
  workOrders = this.workOrderService.workOrders;

  readonly columns = computed(() => this.timelineService.getColumns(this.range(), this.zoom()));
  readonly totalWidth = computed(() =>
    this.timelineService.getTotalWidth(this.columns().length, this.zoom()),
  );
  readonly colWidth = computed(() => this.timelineService.getColumnWidth(this.zoom()));

  readonly isTodayInRange = computed(() => {
    const t = Date.now();
    const { start, end } = this.range();
    return t >= start.getTime() && t < end.getTime();
  });

  readonly currentDayColumnIndex = computed(() => {
    if (!this.isTodayInRange()) {
      return null;
    }
    return this.timelineService.getColumnIndexForDate(new Date(), this.range(), this.zoom());
  });

  readonly todayPosition = computed(() =>
    this.timelineService.timeToPixel(Date.now(), this.range(), this.totalWidth()),
  );

  readonly todayCellLeft = computed(() => {
    const idx = this.currentDayColumnIndex();
    if (idx == null) {
      return 0;
    }
    return idx * this.colWidth();
  });

  readonly currentPeriodBadgeCenterX = computed(
    () => this.todayCellLeft() + this.colWidth() / 2,
  );

  readonly currentPeriodLabel = computed(() => {
    const z = this.zoom();
    if (z === 'hour') {
      return 'Current hour';
    }
    if (z === 'day') {
      return 'Current day';
    }
    if (z === 'week') {
      return 'Current week';
    }
    return 'Current month';
  });

  private savedScrollStateOnLoad: TimelineScrollPersist | null = null;

  constructor() {
    this.savedScrollStateOnLoad = this.loadPersistedState();
    const s = this.savedScrollStateOnLoad;
    if (s) {
      this.zoom.set(s.zoom);
      this.rangePrivate.set(this.timelineService.getInitialRange(s.zoom));
    }
    effect(() => {
      const pending = this.pendingPrependPx();
      if (pending <= 0) {
        return;
      }
      const scrollEl = this.activeScrollElement;
      if (!scrollEl) {
        return;
      }
      setTimeout(() => {
        scrollEl.scrollLeft += pending;
        this.pendingPrependPx.set(0);
      }, 0);
    });
  }

  private activeScrollElement: HTMLElement | null = null;

  /** Call once the scroll container exists (e.g. from `afterNextRender`). */
  wireGridScrollConnection(scrollEl: HTMLElement, destroyRef: DestroyRef): void {
    this.activeScrollElement = scrollEl;
    this.applyInitialScrollState(scrollEl);

    fromEvent(scrollEl, 'scroll', { passive: true })
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(() => {
        this.checkInfiniteScroll(scrollEl);
      });

    fromEvent(scrollEl, 'scroll', { passive: true })
      .pipe(debounceTime(150), takeUntilDestroyed(destroyRef))
      .subscribe(() => {
        this.persistState(scrollEl);
      });

    fromEvent<WheelEvent>(scrollEl, 'wheel', { passive: false })
      .pipe(
        filter((e) => e.deltaX !== 0),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe((e) => {
        e.preventDefault();
        scrollEl.scrollLeft = Math.max(
          0,
          Math.min(
            scrollEl.scrollLeft + e.deltaX,
            scrollEl.scrollWidth - scrollEl.clientWidth,
          ),
        );
      });
  }

  /** New zoom: reset to the standard window for that mode (drop extended range) and re-center on “today”. */
  setZoom(z: TimelineZoom): void {
    this.zoom.set(z);
    this.rangePrivate.set(this.timelineService.getInitialRange(z));
    this.pendingPrependPx.set(0);
    this.scrollToCurrentPeriod();
  }

  /** Primary-button click on a grid cell: opens create if the column is empty at this X. */
  handleCellPointerCreate(event: MouseEvent, workCenterId: string): void {
    if (event.button !== 0) {
      return;
    }
    const el = event.currentTarget;
    if (!(el instanceof HTMLElement)) {
      return;
    }
    const rowInner = el.closest('.timeline-row-inner') as HTMLElement | null;
    if (!rowInner) {
      return;
    }
    const colIdx = columnIndexFromRowPointerX(
      event.clientX,
      rowInner.getBoundingClientRect(),
      this.columns().length,
      this.colWidth(),
    );
    if (colIdx == null) {
      return;
    }
    const w = this.colWidth();
    const cellLeft = colIdx * w;
    if (!this.isCellEmptyForWorkCenter(workCenterId, cellLeft, w)) {
      return;
    }
    const col = this.columns()[colIdx];
    const raw = col?.date;
    if (!raw) {
      return;
    }
    this.draftOrderDates.set(null);
    const startDate = isoStartDateForColumn(raw, this.zoom());
    this.createContext.set({ workCenterId, startDate });
    this.editOrder.set(null);
    this.panelMode.set('create');
  }

  openEditPanel(order: WorkOrderDocument): void {
    this.draftOrderDates.set(null);
    this.editOrder.set(order);
    this.createContext.set(null);
    this.panelMode.set('edit');
  }

  closePanel(): void {
    this.panelMode.set(null);
    this.createContext.set(null);
    this.editOrder.set(null);
  }

  onPanelClosed(): void {
    this.draftOrderDates.set(null);
    this.closePanel();
  }

  onDraftDatesChange(dates: DraftOrderDateRange): void {
    this.draftOrderDates.set(dates);
  }

  onBarMenuOpenChange(workCenterId: string, orderDocId: string, open: boolean): void {
    if (open) {
      this.openMenuBarId.set(`${workCenterId}:${orderDocId}`);
    } else if (this.openMenuBarId() === `${workCenterId}:${orderDocId}`) {
      this.openMenuBarId.set(null);
    }
  }

  onRowEnter(workCenterId: string): void {
    this.hoveredRowId.set(workCenterId);
  }

  onRowLeaveToLabel(workCenterId: string, event: MouseEvent): void {
    this.hoveredCellIndex.set(null);
    const t = event.relatedTarget as Node | null;
    const label = document.querySelector(
      `.timeline-row-label[data-work-center-id="${workCenterId}"]`,
    );
    if (t && label && label.contains(t)) {
      return;
    }
    this.hoveredRowId.set(null);
  }

  onLabelLeaveToGrid(
    workCenterId: string,
    event: MouseEvent,
    gridScroll: HTMLElement | undefined,
  ): void {
    const t = event.relatedTarget as Node | null;
    const row = gridScroll?.querySelector(`.timeline-row[data-work-center-id="${workCenterId}"]`);
    if (t && row && row.contains(t)) {
      return;
    }
    this.hoveredRowId.set(null);
  }

  onCellEnter(workCenterId: string, cellIndex: number): void {
    this.hoveredRowId.set(workCenterId);
    this.hoveredCellIndex.set(cellIndex);
  }

  onCellLeave(): void {
    this.hoveredCellIndex.set(null);
  }

  isRowRaisedForCurrentPeriodPlaceholder(workCenterId: string): boolean {
    if (this.hoveredRowId() !== workCenterId) {
      return false;
    }
    const cellIdx = this.hoveredCellIndex();
    const currentIdx = this.currentDayColumnIndex();
    if (cellIdx == null || currentIdx == null || cellIdx !== currentIdx) {
      return false;
    }
    return this.isCellEmptyForWorkCenter(
      workCenterId,
      currentIdx * this.colWidth(),
      this.colWidth(),
    );
  }

  isCellEmptyForWorkCenter(workCenterId: string, cellLeft: number, cellWidth: number): boolean {
    const w = cellWidth;
    for (const order of this.workOrderService.getOrdersForWorkCenter(workCenterId)) {
      const bar = this.barLayoutForOrder(order);
      if (cellIntersectsBarInset(cellLeft, w, bar)) {
        return false;
      }
    }
    return true;
  }

  barLayoutForOrder(order: WorkOrderDocument): { left: number; width: number } {
    const ctx: BarLayoutContext = {
      range: this.range(),
      totalWidth: this.totalWidth(),
      panelMode: this.panelMode(),
      editingOrderId: this.editOrder()?.docId ?? null,
      draft: this.draftOrderDates(),
      dateToPixel: (d, r, t) => this.timelineService.dateToPixel(d, r, t),
    };
    return layoutWorkOrderBar(order, ctx);
  }

  deleteOrder(docId: string): void {
    this.workOrderService.deleteOrder(docId);
  }

  scrollToCurrentPeriod(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const scrollEl =
          this.activeScrollElement ??
          (document.querySelector('.timeline-grid-scroll') as HTMLElement | null);
        if (scrollEl) {
          const pos = this.todayPosition();
          const clientWidth = scrollEl.clientWidth;
          scrollEl.scrollLeft = Math.max(0, pos - clientWidth / 2);
        }
      });
    });
  }

  private applyInitialScrollState(scrollEl: HTMLElement): void {
    const saved = this.savedScrollStateOnLoad;
    this.savedScrollStateOnLoad = null;
    if (saved != null) {
      const maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
      scrollEl.scrollLeft = Math.min(saved.scrollLeft, maxScroll);
    } else {
      this.scrollToCurrentPeriod();
      // @upgrade The delayed run covers late layout/scrollWidth; replace with a ResizeObserver
      //   or a single rAF after first paint if flakiness is reported on slow devices.
      setTimeout(() => this.scrollToCurrentPeriod(), 100);
    }
  }

  private checkInfiniteScroll(scrollEl: HTMLElement): void {
    const scrollLeft = scrollEl.scrollLeft;
    const maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
    const colWidth = this.timelineService.getColumnWidth(this.zoom());
    const threshold = TIMELINE_CONFIG.loadMoreThresholdPx;
    const n = TIMELINE_CONFIG.prependAppendStep;
    if (scrollLeft < threshold) {
      const current = this.rangePrivate();
      const newStart = this.timelineService.extendRangeStart(current, this.zoom(), n);
      this.rangePrivate.set({ start: newStart, end: current.end });
      this.pendingPrependPx.set(n * colWidth);
    } else if (maxScroll > 0 && maxScroll - scrollLeft < threshold) {
      const current = this.rangePrivate();
      const newEnd = this.timelineService.extendRangeEnd(current, this.zoom(), n);
      this.rangePrivate.set({ start: current.start, end: newEnd });
    }
  }

  private persistState(scrollEl: HTMLElement): void {
    try {
      const payload: TimelineScrollPersist = {
        zoom: this.zoom(),
        scrollLeft: scrollEl.scrollLeft,
      };
      localStorage.setItem(TIMELINE_UI_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }

  private loadPersistedState(): TimelineScrollPersist | null {
    try {
      const raw = localStorage.getItem(TIMELINE_UI_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === 'object' && 'zoom' in parsed && 'scrollLeft' in parsed) {
        const z = (parsed as { zoom: string }).zoom;
        const scrollLeft = Number((parsed as { scrollLeft: unknown }).scrollLeft);
        if (['hour', 'day', 'week', 'month'].includes(z) && Number.isFinite(scrollLeft) && scrollLeft >= 0) {
          return { zoom: z as TimelineZoom, scrollLeft };
        }
      }
    } catch {
      // ignore
    }
    return null;
  }
}
