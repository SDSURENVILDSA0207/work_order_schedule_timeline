import { Component, HostListener, Input, output, inject, ElementRef, ViewChild } from '@angular/core';
import type { WorkOrderDocument } from '../../../../core/models/work-order.model';

@Component({
  selector: 'app-work-order-bar-actions',
  standalone: true,
  imports: [],
  templateUrl: './work-order-bar-actions.component.html',
  styleUrl: './work-order-bar-actions.component.scss',
})
export class WorkOrderBarActionsComponent {
  private el = inject(ElementRef);
  @ViewChild('trigger') triggerRef!: ElementRef<HTMLButtonElement>;
  @Input() order!: WorkOrderDocument;
  open = false;
  dropdownTop = 0;
  dropdownLeft = 0;
  edit = output<WorkOrderDocument>();
  delete = output<WorkOrderDocument>();
  openChange = output<boolean>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.open) return;
    const target = event.target as Node;
    if (this.el.nativeElement.contains(target)) return;
    this.open = false;
    this.openChange.emit(false);
  }

  toggle(event: Event) {
    event.stopPropagation();
    this.open = !this.open;
    this.openChange.emit(this.open);
    if (this.open && this.triggerRef?.nativeElement) {
      setTimeout(() => this.updateDropdownPosition(), 0);
    }
  }

  private updateDropdownPosition() {
    if (!this.triggerRef?.nativeElement) return;
    const rect = this.triggerRef.nativeElement.getBoundingClientRect();
    this.dropdownTop = rect.bottom + 2;
    this.dropdownLeft = rect.right - 200;
  }

  onEdit() {
    this.edit.emit(this.order);
    this.open = false;
    this.openChange.emit(false);
  }

  onDelete() {
    this.delete.emit(this.order);
    this.open = false;
    this.openChange.emit(false);
  }
}
