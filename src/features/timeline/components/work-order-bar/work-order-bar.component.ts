import { Component, Input } from '@angular/core';
import { WorkOrderBarActionsComponent } from '../work-order-bar-actions/work-order-bar-actions.component';
import type { WorkOrderDocument } from '../../../../core/models/work-order.model';
import { STATUS_DISPLAY_LABELS, STATUS_COLORS, STATUS_BAR_BG, STATUS_BAR_BORDER } from '../../../../core/constants/timeline.constants';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  imports: [WorkOrderBarActionsComponent],
  templateUrl: './work-order-bar.component.html',
  styleUrl: './work-order-bar.component.scss',
})
export class WorkOrderBarComponent {
  @Input() order!: WorkOrderDocument;
  @Input() barStyle: { left: string; width: string } = { left: '0px', width: '200px' };

  readonly statusLabels = STATUS_DISPLAY_LABELS;
  readonly statusColors = STATUS_COLORS;
  readonly statusBarBg = STATUS_BAR_BG;
  readonly statusBarBorder = STATUS_BAR_BORDER;
}
