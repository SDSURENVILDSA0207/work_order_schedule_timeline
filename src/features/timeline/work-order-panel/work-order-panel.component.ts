import { Component } from '@angular/core';
import { WorkOrderFormComponent } from './components/work-order-form/work-order-form.component';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [WorkOrderFormComponent],
  templateUrl: './work-order-panel.component.html',
  styleUrl: './work-order-panel.component.scss',
})
export class WorkOrderPanelComponent {}
