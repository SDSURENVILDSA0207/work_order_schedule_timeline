import { Component, input, output } from '@angular/core';
import type { TimelineZoom } from '../../models/work-order.model';

@Component({
  selector: 'app-timescale-selector',
  standalone: true,
  template: `
    <div class="timescale-control" aria-label="Timescale selector">
      <div class="timescale-label-wrap">
        <span class="timescale-label">Timescale</span>
      </div>
      <div class="timescale-dropdown-wrap">
        <select
          [value]="value()"
          (change)="onChange($event)"
          class="timescale-select"
        >
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <span class="timescale-chevron" aria-hidden="true">▼</span>
      </div>
    </div>
  `,
  styles: `
    .timescale-control {
      display: inline-flex;
      align-items: stretch;
      gap: 0;
      border-radius: 5px;
      border: 1px solid rgba(216, 220, 235, 1);
      box-shadow:
        0 1.5px 3px -1.5px rgba(200, 207, 233, 1),
        0 1px 0.5px -1px rgba(216, 220, 235, 1);
      background-color: transparent;
      overflow: hidden;
    }

    .timescale-label-wrap {
      box-sizing: border-box;
      width: 75px;
      height: 25px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 0;
      background-color: rgba(241, 243, 248, 0.75);
    }

    .timescale-label {
      box-sizing: border-box;
      width: 59px;
      height: 16px;
      margin: 4px 0 0 8px;
      padding: 0;
      border: none;
      color: rgba(104, 113, 150, 1);
      font-family: 'Circular-Std', 'CircularStd-Book', sans-serif;
      font-size: 13px;
      font-weight: 400;
      line-height: 16px;
      opacity: 1;
      text-align: left;
      vertical-align: top;
    }

    .timescale-dropdown-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .timescale-select {
      box-sizing: border-box;
      width: 71px;
      min-width: 71px;
      height: 25px;
      min-height: 25px;
      border: none;
      border-left: 1px solid rgba(216, 220, 235, 1);
      border-radius: 0 5px 5px 0;
      padding: 0 18px 0 8px; /* space for chevron on the right */
      font-family: 'Circular-Std', sans-serif;
      font-size: 12px;
      color: var(--color-primary);
      background-color: #ffffff;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
    }

    .timescale-select:focus {
      outline: none;
    }

    .timescale-chevron {
      position: absolute;
      right: 6px;
      font-size: 10px;
      color: var(--color-primary);
      pointer-events: none;
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
