import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline-axis',
  standalone: true,
  imports: [],
  templateUrl: './timeline-axis.component.html',
  styleUrl: './timeline-axis.component.scss',
})
export class TimelineAxisComponent {
  /** Month labels for the axis (Aug 2024 … Mar 2025) */
  months = [
    'Aug 2024',
    'Sep 2024',
    'Oct 2024',
    'Nov 2024',
    'Dec 2024',
    'Jan 2025',
    'Feb 2025',
    'Mar 2025',
  ];
}
