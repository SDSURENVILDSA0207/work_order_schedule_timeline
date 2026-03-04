import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-schedule-header',
  standalone: true,
  imports: [],
  templateUrl: './schedule-header.component.html',
  styleUrl: './schedule-header.component.scss',
})
export class ScheduleHeaderComponent {
  timescaleOpen = false;
  /** Current zoom value: 'hour' | 'day' | 'week' | 'month' */
  @Input() selectedTimescale = 'month';
  @Output() timescaleChange = new EventEmitter<string>();

  readonly timescaleOptions = ['Hour', 'Day', 'Week', 'Month'];

  /** Display label for the current timescale (e.g. 'month' -> 'Month') */
  get timescaleLabel(): string {
    const s = this.selectedTimescale;
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Month';
  }

  toggleTimescale(event: Event) {
    event.stopPropagation();
    this.timescaleOpen = !this.timescaleOpen;
  }

  selectTimescale(optionLabel: string) {
    const zoom = optionLabel.toLowerCase() as 'hour' | 'day' | 'week' | 'month';
    this.timescaleChange.emit(zoom);
    this.timescaleOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.timescaleOpen = false;
  }
}
