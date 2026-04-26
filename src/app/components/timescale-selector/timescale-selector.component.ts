import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  ElementRef,
  HostListener,
} from '@angular/core';
import type { TimelineZoom } from '../../models/work-order.model';

@Component({
  selector: 'app-timescale-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          <span class="timescale-chevron" aria-hidden="true"></span>
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
      align-items: stretch;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      background-color: #f9fafb;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      overflow: visible;
    }

    .timescale-label-wrap {
      min-height: 32px;
      display: flex;
      align-items: center;
      padding: 0 12px 0 14px;
    }

    .timescale-label {
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.25;
    }

    .timescale-dropdown-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .timescale-trigger {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 6px;
      box-sizing: border-box;
      min-width: 88px;
      min-height: 32px;
      padding: 0 24px 0 12px;
      border: none;
      border-left: 1px solid #e5e7eb;
      border-radius: 0 6px 6px 0;
      font-size: 14px;
      font-weight: 500;
      color: #4f46e5;
      background-color: #ffffff;
      cursor: pointer;
      outline: none;
    }

    .timescale-trigger:hover {
      background-color: #fafafa;
    }

    .timescale-trigger:focus-visible {
      outline: 2px solid #818cf8;
      outline-offset: 2px;
    }

    .timescale-trigger-label {
      line-height: 1.25;
    }

    .timescale-menu {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      min-width: 100%;
      width: 200px;
      padding: 6px 0;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      background-color: #ffffff;
      box-shadow:
        0 4px 6px -1px rgba(15, 23, 42, 0.08),
        0 2px 4px -2px rgba(15, 23, 42, 0.05);
      z-index: 40;
    }

    .timescale-option {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 32px;
      padding: 0 14px 0 12px;
      border: none;
      background: none;
      text-align: left;
      font-size: 14px;
      font-weight: 400;
      color: #111827;
      cursor: pointer;
    }

    .timescale-option:hover {
      background-color: #f3f4ff;
    }

    .timescale-option.selected {
      color: #4f46e5;
      font-weight: 500;
    }

    .timescale-chevron {
      position: absolute;
      right: 8px;
      top: 50%;
      display: block;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid #6366f1;
      pointer-events: none;
    }
  `,
})
export class TimescaleSelectorComponent {
  private host = inject(ElementRef<HTMLElement>);

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) {
      return;
    }
    const t = event.target as Node;
    if (this.host.nativeElement.contains(t)) {
      return;
    }
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuOpen.set(false);
  }
}
