import { Component, input, output, signal, HostListener } from '@angular/core';
import type { WorkOrderDocument } from '../../models/work-order.model';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  host: {
    '(click)': 'onBarClick($event)',
    '[style.left.px]': 'left()',
    '[style.width.px]': 'width()',
  },
  template: `
    <div
      class="work-order-bar"
      [class]="'status-' + order().data.status"
    >
      <span class="bar-name">{{ order().data.name }}</span>
      <div class="actions">
        <button
          type="button"
          class="actions-btn"
          (click)="toggleMenu($event)"
          aria-label="Actions"
        >
          ⋮
        </button>
        @if (menuOpen()) {
          <div class="actions-dropdown" (click)="$event.stopPropagation()">
            <button type="button" (click)="onEdit()">Edit</button>
            <button type="button" (click)="onDelete()">Delete</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: absolute;
      top: 6px;
      height: calc(100% - 12px);
      min-width: 80px;
      box-sizing: border-box;
    }

    .work-order-bar {
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 80px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px 0 12px;
      box-sizing: border-box;
      cursor: default;
    }

    .work-order-bar.status-open {
      background: var(--color-bar-open);
      border: 1px solid color-mix(in srgb, var(--color-status-open) 40%, white);
    }

    .work-order-bar.status-in-progress {
      background: var(--color-bar-in-progress);
      border: 1px solid color-mix(in srgb, var(--color-status-in-progress) 40%, white);
    }

    .work-order-bar.status-complete {
      background: var(--color-bar-complete);
      border: 1px solid color-mix(in srgb, var(--color-status-complete) 40%, white);
    }

    .work-order-bar.status-blocked {
      background: var(--color-bar-blocked);
      border: 1px solid color-mix(in srgb, var(--color-status-blocked) 40%, white);
    }

    .bar-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .actions {
      position: relative;
      flex-shrink: 0;
    }

    .actions-btn {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      color: var(--color-text-labels);
      border-radius: 4px;
    }

    .actions-btn:hover {
      background: rgba(0, 0, 0, 0.06);
      color: var(--color-text-primary);
    }

    .actions-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 4px;
      background: white;
      border: 1px solid var(--color-stroke);
      border-radius: 8px;
      box-shadow: var(--shadow-dropdown);
      min-width: 100px;
      z-index: 10;
      overflow: hidden;
    }

    .actions-dropdown button {
      display: block;
      width: 100%;
      padding: 8px 12px;
      border: none;
      background: none;
      text-align: left;
      font-size: 14px;
      cursor: pointer;
      font-family: var(--font-heading);
    }

    .actions-dropdown button:hover {
      background: #f5f5f5;
    }
  `,
})
export class WorkOrderBarComponent {
  order = input.required<WorkOrderDocument>();
  left = input.required<number>();
  width = input.required<number>();

  edit = output<WorkOrderDocument>();
  delete = output<WorkOrderDocument>();

  menuOpen = signal(false);

  @HostListener('document:click')
  onDocumentClick(): void {
    this.menuOpen.set(false);
  }

  onBarClick(event: Event): void {
    event.stopPropagation();
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.set(!this.menuOpen());
  }

  onEdit(): void {
    this.menuOpen.set(false);
    this.edit.emit(this.order());
  }

  onDelete(): void {
    this.menuOpen.set(false);
    this.delete.emit(this.order());
  }

}
