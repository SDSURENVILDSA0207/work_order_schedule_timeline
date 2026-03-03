import { Component, input, output, signal, computed } from '@angular/core';
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
        <button
          type="button"
          class="timescale-trigger"
          (click)="toggleMenu()"
          aria-haspopup="listbox"
          [attr.aria-expanded]="menuOpen()"
        >
          <span class="timescale-trigger-label">{{ valueLabel() }}</span>
          <span class="timescale-chevron" aria-hidden="true">▼</span>
        </button>
      </div>
      @if (menuOpen()) {
        <div class="timescale-menu" role="listbox">
          <button
            type="button"
            class="timescale-option"
            role="option"
            [class.selected]="value() === 'hour'"
            (click)="select('hour')"
          >
            Hour
          </button>
          <button
            type="button"
            class="timescale-option"
            role="option"
            [class.selected]="value() === 'day'"
            (click)="select('day')"
          >
            Day
          </button>
          <button
            type="button"
            class="timescale-option"
            role="option"
            [class.selected]="value() === 'week'"
            (click)="select('week')"
          >
            Week
          </button>
          <button
            type="button"
            class="timescale-option"
            role="option"
            [class.selected]="value() === 'month'"
            (click)="select('month')"
          >
            Month
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .timescale-control {
      position: relative;
      display: inline-flex;
      align-items: center;
      border-radius: 5px;
      border: 1px solid rgba(216, 220, 235, 1);
      box-shadow:
        0 1px 0 rgba(216, 220, 235, 0.7),
        0 4px 12px rgba(15, 23, 42, 0.04);
      background-color: rgba(241, 243, 248, 0.75);
      overflow: visible;
    }

    .timescale-label-wrap {
      height: 25px;
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    .timescale-label {
      color: rgba(104, 113, 150, 1);
      font-family: 'Circular-Std', 'CircularStd-Book', sans-serif;
      font-size: 13px;
      font-weight: 400;
      line-height: 16px;
    }

    .timescale-dropdown-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .timescale-trigger {
      display: flex;
      align-items: center;
      gap: 4px;
      box-sizing: border-box;
      min-width: 71px;
      height: 25px;
      min-height: 25px;
      border-left: 1px solid rgba(216, 220, 235, 1);
      border-top: none;
      border-right: none;
      border-bottom: none;
      border-radius: 0 5px 5px 0;
      padding: 0 18px 0 8px; /* space for chevron on the right */
      font-family: 'Circular-Std', sans-serif;
      font-size: 13px;
      color: var(--color-primary);
      background-color: #ffffff;
      cursor: pointer;
      outline: none;
    }

    .timescale-trigger-label {
      line-height: 16px;
    }

    .timescale-menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0; /* start from the left edge of the timescale box (full control) */
      width: 200px;
      height: 136px;
      padding: 8px 0;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 1);
      box-shadow:
        0 0 0 1px rgba(104, 113, 150, 0.1),
        0 2.5px 3px -1.5px rgba(200, 207, 233, 1),
        0 4.5px 5px -1px rgba(216, 220, 235, 1);
      z-index: 20;
    }

    .timescale-option {
      display: block;
      width: 100%;
      padding: 4px 14px;
      border: none;
      background: none;
      text-align: left;
      font-family: 'Circular-Std', sans-serif;
      font-size: 13px;
      color: rgba(3, 9, 41, 1);
      cursor: pointer;
    }

    .timescale-option:hover {
      background-color: rgba(244, 245, 255, 1);
    }

    .timescale-option.selected {
      color: var(--color-primary);
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

  menuOpen = signal(false);

  valueLabel = computed(() => {
    const v = this.value();
    if (v === 'hour') return 'Hour';
    if (v === 'day') return 'Day';
    if (v === 'week') return 'Week';
    return 'Month';
  });

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  select(zoom: TimelineZoom): void {
    this.valueChange.emit(zoom);
    this.menuOpen.set(false);
  }
}
