import { Component } from '@angular/core';
import { TimelineAxisComponent } from '../timeline-axis/timeline-axis.component';
import { CurrentPeriodIndicatorComponent } from '../current-period-indicator/current-period-indicator.component';
import { TimelineRowComponent } from '../timeline-row/timeline-row.component';
import { WorkOrderDataService } from '../../../../core/services/work-order-data.service';

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
  constructor(public data: WorkOrderDataService) {}
  get workCenters() {
    return this.data.getWorkCenters();
  }
  getOrdersFor(workCenterId: string) {
    return this.data.getOrdersForWorkCenter(workCenterId);
  }
}
