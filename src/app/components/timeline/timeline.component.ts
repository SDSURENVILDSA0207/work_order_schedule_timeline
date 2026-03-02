import {
  Component,
  inject,
  signal,
  computed,
  afterNextRender,
} from '@angular/core';
import type { WorkCenterDocument, WorkOrderDocument, TimelineZoom } from '../../models/work-order.model';
import { WorkOrderService } from '../../services/work-order.service';
import { TimelineService } from '../../services/timeline.service';
import { parseDate, addDays, toISODate } from '../../utils/date.utils';
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

  zoom = signal<TimelineZoom>('day');
  hoveredRowId = signal<string | null>(null);
  panelOpen = signal<'create' | 'edit' | null>(null);
  createContext = signal<{ workCenterId: string; startDate: string } | null>(null);
  editOrder = signal<WorkOrderDocument | null>(null);

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
  isTodayInRange = computed(() => {
    const today = new Date();
    const range = this.range();
    return today >= range.start && today <= range.end;
  });

  setZoom(z: TimelineZoom): void {
    this.zoom.set(z);
  }

  openCreatePanel(workCenterId: string, clickX: number): void {
    const range = this.range();
    const total = this.totalWidth();
    const date = this.timelineService.pixelToDate(
      clickX,
      range.start,
      range.end,
      total
    );
    const startDate = toISODate(date);
    this.createContext.set({ workCenterId, startDate });
    this.editOrder.set(null);
    this.panelOpen.set('create');
  }

  openEditPanel(order: WorkOrderDocument): void {
    this.editOrder.set(order);
    this.createContext.set(null);
    this.panelOpen.set('edit');
  }

  closePanel(): void {
    this.panelOpen.set(null);
    this.createContext.set(null);
    this.editOrder.set(null);
  }

  onRowClick(workCenterId: string, event: MouseEvent): void {
    const row = event.currentTarget as HTMLElement;
    const scrollEl = row.closest('.timeline-grid-scroll') as HTMLElement;
    const rect = row.getBoundingClientRect();
    const scrollLeft = scrollEl?.scrollLeft ?? 0;
    const clickX = event.clientX - rect.left + scrollLeft;
    this.openCreatePanel(workCenterId, clickX);
  }

  getBarPosition(order: WorkOrderDocument): { left: number; width: number } {
    const range = this.range();
    const total = this.totalWidth();
    const colWidth = this.timelineService.getColumnWidth(this.zoom());

    const left = this.timelineService.dateToPixel(
      order.data.startDate,
      range.start,
      range.end,
      total,
      this.zoom()
    );
    const right = this.timelineService.dateToPixel(
      order.data.endDate,
      range.start,
      range.end,
      total,
      this.zoom()
    );
    const width = Math.max(right - left, 40);
    return { left, width };
  }

  onEdit(order: WorkOrderDocument): void {
    this.openEditPanel(order);
  }

  onDelete(order: WorkOrderDocument): void {
    this.workOrderService.deleteOrder(order.docId);
  }

  onPanelClosed(): void {
    this.closePanel();
  }

  constructor() {
    afterNextRender(() => {
      this.scrollToToday();
    });
  }

  scrollToToday(): void {
    requestAnimationFrame(() => {
      const scrollEl = document.querySelector('.timeline-grid-scroll') as HTMLElement;
      if (scrollEl) {
        const todayPos = this.todayPosition();
        const clientWidth = scrollEl.clientWidth;
        scrollEl.scrollLeft = Math.max(0, todayPos - clientWidth / 2);
      }
    });
  }
}
