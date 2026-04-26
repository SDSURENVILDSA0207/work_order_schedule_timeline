import {
  ChangeDetectionStrategy,
  Component,
  inject,
  afterNextRender,
  ViewChild,
  ElementRef,
  DestroyRef,
} from '@angular/core';
import { WorkOrderService } from '../../services/work-order.service';
import { TimelineService } from '../../services/timeline.service';
import { TimelineViewStateService } from '../../services/timeline-view-state.service';
import { TimescaleSelectorComponent } from '../timescale-selector/timescale-selector.component';
import { WorkOrderBarComponent } from '../work-order-bar/work-order-bar.component';
import { WorkOrderPanelComponent } from '../work-order-panel/work-order-panel.component';
import type { WorkCenterDocument, WorkOrderDocument } from '../../models/work-order.model';
import type { TimelineColumn } from '../../services/timeline.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TimescaleSelectorComponent, WorkOrderBarComponent, WorkOrderPanelComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  /** Grid scroll + work-order / timeline math. */
  protected readonly workOrderService = inject(WorkOrderService);
  protected readonly timelineService = inject(TimelineService);
  protected readonly view = inject(TimelineViewStateService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('gridScroll') private gridScrollRef?: ElementRef<HTMLElement>;

  /** Stable @for key when the column list is prepended/appended. */
  colTrackId(index: number, col: Pick<TimelineColumn, 'label'>): string {
    return `${index}|${col.label}`;
  }

  constructor() {
    afterNextRender(() => {
      const el = this.gridScrollRef?.nativeElement;
      if (el) {
        this.view.wireGridScrollConnection(el, this.destroyRef);
      }
    });
  }

  onLabelMouseLeave(workCenterId: string, event: MouseEvent): void {
    this.view.onLabelLeaveToGrid(workCenterId, event, this.gridScrollRef?.nativeElement);
  }

  onBarDelete(order: WorkOrderDocument): void {
    this.view.deleteOrder(order.docId);
  }

  trackOrder(_: number, o: WorkOrderDocument): string {
    return o.docId;
  }

  trackWorkCenter = (_: number, w: WorkCenterDocument): string => w.docId;
}
