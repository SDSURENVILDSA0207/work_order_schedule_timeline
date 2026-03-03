import { Component } from '@angular/core';
import { ScheduleSidebarComponent } from '../components/schedule-sidebar/schedule-sidebar.component';
import { TimelineGridComponent } from '../components/timeline-grid/timeline-grid.component';
import { WorkOrderPanelComponent } from '../work-order-panel/work-order-panel.component';

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [
    ScheduleSidebarComponent,
    TimelineGridComponent,
    WorkOrderPanelComponent,
  ],
  templateUrl: './timeline-page.component.html',
  styleUrl: './timeline-page.component.scss',
})
export class TimelinePageComponent {
  /** Panel hidden by default so initial view matches design image */
  panelOpen = false;
}
