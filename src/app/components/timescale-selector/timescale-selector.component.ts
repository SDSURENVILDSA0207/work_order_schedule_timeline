import { Component, input, output } from '@angular/core';
import type { TimelineZoom } from '../../models/work-order.model';

@Component({
  selector: 'app-timescale-selector',
  standalone: true,
  template: `
    <div class="timescale-selector">
      <label for="timescale">Timescale</label>
      <select
        id="timescale"
        [value]="value()"
        (change)="onChange($event)"
        class="timescale-select"
      >
        <option value="hour">Hour</option>
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
    </div>
  `,
  styles: `
    .timescale-selector {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    label {
      font-size: 14px;
      color: var(--color-text-labels);
      font-weight: 500;
    }

    .timescale-select {
      padding: 8px 12px;
      border: 1px solid var(--color-stroke);
      border-radius: 8px;
      font-family: var(--font-heading);
      font-size: 14px;
      color: var(--color-text-primary);
      background: white;
      cursor: pointer;
    }

    .timescale-select:hover {
      border-color: var(--color-primary-light);
    }
  `,
})
export class TimescaleSelectorComponent {
  value = input.required<TimelineZoom>();
  valueChange = output<TimelineZoom>();

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value as TimelineZoom);
  }
}
