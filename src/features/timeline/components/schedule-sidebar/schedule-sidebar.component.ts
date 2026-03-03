import { Component } from '@angular/core';
import { ScheduleHeaderComponent } from '../schedule-header/schedule-header.component';
import { WorkCenterListComponent } from '../work-center-list/work-center-list.component';

@Component({
  selector: 'app-schedule-sidebar',
  standalone: true,
  imports: [ScheduleHeaderComponent, WorkCenterListComponent],
  templateUrl: './schedule-sidebar.component.html',
  styleUrl: './schedule-sidebar.component.scss',
})
export class ScheduleSidebarComponent {}
