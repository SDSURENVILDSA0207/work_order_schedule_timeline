import { Component, input, output, signal, HostListener, computed } from '@angular/core';
import type { WorkOrderDocument, WorkOrderStatus } from '../../models/work-order.model';

const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  complete: 'Complete',
  blocked: 'Blocked',
};

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
      <span
        class="status-badge"
        [class]="'status-badge-' + order().data.status"
      >{{ statusLabel() }}</span>
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
      min-width: 381px;
      height: 38px;
      box-shadow: 0 0 0 1px rgba(198, 226, 255, 1);
      border-radius: 8px;
      background-color: rgba(239, 246, 255, 1);
      border: none;
    }

    .work-order-bar.status-in-progress {
      min-width: 381px;
      height: 38px;
      box-shadow: 0 0 0 1px rgba(222, 224, 255, 1);
      border-radius: 8px;
      background-color: rgba(237, 238, 255, 1);
      border: none;
    }

    .work-order-bar.status-complete {
      min-width: 381px;
      height: 38px;
      box-shadow: 0 0 0 1px rgba(209, 250, 179, 1);
      border-radius: 8px;
      background-color: rgba(248, 255, 243, 1);
      border: none;
    }

    .work-order-bar.status-blocked {
      min-width: 533px;
      height: 38px;
      box-shadow: 0 0 0 1px rgba(255, 245, 207, 1);
      border-radius: 8px;
      background-color: rgba(255, 252, 241, 1);
      border: none;
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

    .status-badge {
      flex-shrink: 0;
      padding: 4px 12px;
      border-radius: 999px;
      white-space: nowrap;
      font-family: 'Circular-Std', 'CircularStd-Book', sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 17px;
      letter-spacing: normal;
      opacity: 1;
    }

    .status-badge-open {
      width: 87px;
      height: 22px;
      border-radius: 5px;
      background-color: rgba(209, 242, 255, 1);
      color: rgba(0, 176, 191, 1);
      text-align: center;
      line-height: 22px;
      padding: 0;
    }

    .status-badge-in-progress {
      width: 87px;
      height: 22px;
      border-radius: 5px;
      background-color: rgba(214, 216, 255, 1);
      color: rgba(62, 64, 219, 1);
      text-align: center;
      line-height: 22px;
      padding: 0;
    }

    .status-badge-complete {
      width: 87px;
      height: 22px;
      border-radius: 5px;
      background-color: rgba(209, 250, 179, 1);
      color: rgba(8, 162, 104, 1);
      text-align: center;
      line-height: 22px;
      padding: 0;
    }

    .status-badge-blocked {
      width: 87px;
      height: 22px;
      border-radius: 5px;
      background-color: rgba(255, 235, 207, 1);
      color: rgba(177, 54, 0, 1);
      text-align: center;
      line-height: 22px;
      padding: 0;
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

  statusLabel = computed(() => STATUS_LABELS[this.order().data.status]);

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
