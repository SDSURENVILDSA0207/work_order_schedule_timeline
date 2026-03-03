import { Component, HostListener, Input, output } from '@angular/core';
import type { WorkOrderDocument } from '../../../../core/models/work-order.model';

@Component({
  selector: 'app-work-order-bar-actions',
  standalone: true,
  imports: [],
  templateUrl: './work-order-bar-actions.component.html',
  styleUrl: './work-order-bar-actions.component.scss',
})
export class WorkOrderBarActionsComponent {
  @Input() order!: WorkOrderDocument;
  open = false;
  edit = output<WorkOrderDocument>();
  delete = output<WorkOrderDocument>();

  @HostListener('document:click')
  onDocumentClick() {
    this.open = false;
  }

  toggle(event: Event) {
    event.stopPropagation();
    this.open = !this.open;
  }

  onEdit() {
    this.edit.emit(this.order);
    this.open = false;
  }

  onDelete() {
    this.delete.emit(this.order);
    this.open = false;
  }
}
