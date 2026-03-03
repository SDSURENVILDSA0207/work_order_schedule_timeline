import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-schedule-header',
  standalone: true,
  imports: [],
  templateUrl: './schedule-header.component.html',
  styleUrl: './schedule-header.component.scss',
})
export class ScheduleHeaderComponent {
  timescaleOpen = false;
  selectedTimescale = 'Month';
  readonly timescaleOptions = ['Hour', 'Day', 'Week', 'Month'];

  toggleTimescale(event: Event) {
    event.stopPropagation();
    this.timescaleOpen = !this.timescaleOpen;
  }

  selectTimescale(value: string) {
    this.selectedTimescale = value;
    this.timescaleOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.timescaleOpen = false;
  }
}
