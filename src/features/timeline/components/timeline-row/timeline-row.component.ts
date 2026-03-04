import { Component, Input, inject } from '@angular/core';
import { WorkOrderBarComponent } from '../work-order-bar/work-order-bar.component';
import type { WorkCenterDocument } from '../../../../core/models/work-center.model';
import type { WorkOrderDocument } from '../../../../core/models/work-order.model';
import { TimelineService } from '../../../../app/services/timeline.service';
import { parseDate, addDays } from '../../../../app/utils/date.utils';
import type { TimelineZoom } from '../../timeline-page/timeline-page.component';

/** Timeline range for date-to-pixel conversion */
interface TimelineRange {
  start: Date;
  end: Date;
}

const AXIS_OFFSET_PX = 15;

@Component({
  selector: 'app-timeline-row',
  standalone: true,
  imports: [WorkOrderBarComponent],
  templateUrl: './timeline-row.component.html',
  styleUrl: './timeline-row.component.scss',
})
export class TimelineRowComponent {
  private timelineService = inject(TimelineService);

  @Input() workCenter!: WorkCenterDocument;
  @Input() orders: WorkOrderDocument[] = [];
  @Input() range!: TimelineRange;
  @Input() totalWidth = 0;
  @Input() zoom: TimelineZoom = 'month';
  @Input() colWidth = 116;

  getBarStyle(order: WorkOrderDocument): { left: string; width: string } {
    if (!this.range || !this.totalWidth) {
      return { left: AXIS_OFFSET_PX + 'px', width: '80px' };
    }
    // Start: beginning of start date (inclusive)
    const startPx = this.timelineService.dateToPixel(
      order.data.startDate,
      this.range.start,
      this.range.end,
      this.totalWidth,
      this.zoom
    );
    // End: beginning of day after end date so the bar spans the full end date (inclusive)
    const endDateExclusive = addDays(parseDate(order.data.endDate), 1);
    const endPx = this.timelineService.dateToPixel(
      endDateExclusive,
      this.range.start,
      this.range.end,
      this.totalWidth,
      this.zoom
    );
    const leftPx = AXIS_OFFSET_PX + startPx;
    const widthPx = Math.max(381, endPx - startPx); /* generic bar min-width 381px */
    return { left: leftPx + 'px', width: widthPx + 'px' };
  }
}
