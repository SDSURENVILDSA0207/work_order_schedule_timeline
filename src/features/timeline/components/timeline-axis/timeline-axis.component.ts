import { Component, Input } from '@angular/core';

export interface TimelineAxisColumn {
  label: string;
  date: Date;
}

@Component({
  selector: 'app-timeline-axis',
  standalone: true,
  imports: [],
  templateUrl: './timeline-axis.component.html',
  styleUrl: './timeline-axis.component.scss',
})
export class TimelineAxisComponent {
  /** Column headers from timeline service (depends on zoom: hour/day/week/month) */
  @Input() columns: TimelineAxisColumn[] = [];
  @Input() colWidth = 116;
}
