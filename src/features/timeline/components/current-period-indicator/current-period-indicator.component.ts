import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-current-period-indicator',
  standalone: true,
  imports: [],
  templateUrl: './current-period-indicator.component.html',
  styleUrl: './current-period-indicator.component.scss',
})
export class CurrentPeriodIndicatorComponent {
  @Input() zoom: 'hour' | 'day' | 'week' | 'month' = 'month';

  get periodLabel(): string {
    switch (this.zoom) {
      case 'hour': return 'Current hour';
      case 'day': return 'Current day';
      case 'week': return 'Current week';
      default: return 'Current month';
    }
  }
}
