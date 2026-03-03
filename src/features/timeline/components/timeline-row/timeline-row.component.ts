import { Component, Input } from '@angular/core';
import { WorkOrderBarComponent } from '../work-order-bar/work-order-bar.component';
import type { WorkCenterDocument } from '../../../../core/models/work-center.model';
import type { WorkOrderDocument } from '../../../../core/models/work-order.model';

/** Visible range start for bar positioning (Aug 1 2024); column step 114px ≈ 1 month */
const RANGE_START = new Date('2024-08-01').getTime();
const PX_PER_DAY = 114 / 30;

@Component({
  selector: 'app-timeline-row',
  standalone: true,
  imports: [WorkOrderBarComponent],
  templateUrl: './timeline-row.component.html',
  styleUrl: './timeline-row.component.scss',
})
export class TimelineRowComponent {
  @Input() workCenter!: WorkCenterDocument;
  @Input() orders: WorkOrderDocument[] = [];

  getBarStyle(order: WorkOrderDocument): { left: string; width: string } {
    const start = new Date(order.data.startDate).getTime();
    const end = new Date(order.data.endDate).getTime();
    const axisOffset = 15;
    const leftPx = axisOffset + Math.max(0, (start - RANGE_START) / (24 * 60 * 60 * 1000) * PX_PER_DAY);
    const widthPx = Math.max(20, (end - start) / (24 * 60 * 60 * 1000) * PX_PER_DAY);
    return { left: leftPx + 'px', width: widthPx + 'px' };
  }
}
