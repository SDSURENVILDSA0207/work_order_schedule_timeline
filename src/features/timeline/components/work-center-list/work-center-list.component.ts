import { Component } from '@angular/core';
import { WorkOrderDataService } from '../../../../core/services/work-order-data.service';

@Component({
  selector: 'app-work-center-list',
  standalone: true,
  imports: [],
  templateUrl: './work-center-list.component.html',
  styleUrl: './work-center-list.component.scss',
})
export class WorkCenterListComponent {
  constructor(public data: WorkOrderDataService) {}
  get workCenters() {
    return this.data.getWorkCenters();
  }
}
