import { Component, Input, inject } from '@angular/core';
import { TimelineAxisComponent } from '../timeline-axis/timeline-axis.component';
import { CurrentPeriodIndicatorComponent } from '../current-period-indicator/current-period-indicator.component';
import { TimelineRowComponent } from '../timeline-row/timeline-row.component';
import { WorkOrderDataService } from '../../../../core/services/work-order-data.service';
import { TimelineService } from '../../../../app/services/timeline.service';
import type { TimelineZoom } from '../../timeline-page/timeline-page.component';

@Component({
  selector: 'app-timeline-grid',
  standalone: true,
  imports: [
    TimelineAxisComponent,
    CurrentPeriodIndicatorComponent,
    TimelineRowComponent,
  ],
  templateUrl: './timeline-grid.component.html',
  styleUrl: './timeline-grid.component.scss',
})
export class TimelineGridComponent {
  private timelineService = inject(TimelineService);
  @Input() zoom: TimelineZoom = 'month';

  constructor(public data: WorkOrderDataService) {}

  get workCenters() {
    return this.data.getWorkCenters();
  }
  getOrdersFor(workCenterId: string) {
    return this.data.getOrdersForWorkCenter(workCenterId);
  }

  get range() {
    return this.timelineService.getVisibleRange(this.zoom);
  }
  get columns() {
    return this.timelineService.getColumns(this.range, this.zoom);
  }
  get colWidth() {
    return this.timelineService.getColumnWidth(this.zoom);
  }
  get totalWidth() {
    return this.columns.length * this.colWidth;
  }
}
