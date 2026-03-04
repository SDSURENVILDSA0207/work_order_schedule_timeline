import {
  Component,
  input,
  output,
  signal,
  HostListener,
  computed,
  ViewChild,
  ElementRef,
  afterNextRender,
  inject,
  effect,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, type Subscription } from 'rxjs';
import type { WorkOrderDocument, WorkOrderStatus } from '../../models/work-order.model';

const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  complete: 'Complete',
  blocked: 'Blocked',
};

const DROPDOWN_GAP_PX = 4;

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  host: {
    '(click)': 'onBarClick($event)',
    '[style.left.px]': 'left()',
    '[style.width.px]': 'width()',
    '[class.dropdown-open]': 'menuOpen()',
  },
  template: `
    <div
      class="work-order-bar"
      [class]="'status-' + order().data.status"
      [class.menu-open]="menuOpen()"
    >
      <span class="bar-name">{{ order().data.name }}</span>
      <span
        class="status-badge"
        [class]="'status-badge-' + order().data.status"
      >{{ statusLabel() }}</span>
        <div class="actions">
        <button
          #actionsTrigger
          type="button"
          class="actions-btn"
          (click)="toggleMenu($event)"
          aria-label="Actions"
          [attr.aria-expanded]="menuOpen()"
        >
          ⋯
        </button>
        <!-- Dropdown is rendered in body overlay so it always appears over all bars -->
        @if (menuOpen()) {
          <!-- Invisible placeholder keeps layout; real panel is in body -->
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
      min-width: 24px; /* flexible: bar shrinks to fit date range; small min keeps it clickable */
      box-sizing: border-box;
      z-index: 2; /* above placeholder so three-dot menu is always clickable */
    }

    :host.dropdown-open {
      z-index: 10001; /* above all other bars in the row so Edit/Delete panel always displays on top */
    }

    /* Bar size is driven by timeline (date range); no fixed min so it can shrink */
    .work-order-bar {
      position: relative;
      width: 100%;
      height: 38px;
      min-width: 0;
      border-radius: 8px;
      background-color: rgba(237, 238, 255, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px 0 12px;
      box-sizing: border-box;
      cursor: default;
      opacity: 1;
      overflow: hidden;
    }

    .work-order-bar.status-open {
      box-shadow: 0 0 0 1px rgba(198, 226, 255, 1);
      background-color: rgba(239, 246, 255, 1);
      border: none;
    }

    .work-order-bar.status-in-progress {
      box-shadow: 0 0 0 1px rgba(222, 224, 255, 1);
      background-color: rgba(237, 238, 255, 1);
      border: none;
    }

    .work-order-bar.status-complete {
      box-shadow: 0 0 0 1px rgba(209, 250, 179, 1);
      background-color: rgba(248, 255, 243, 1);
      border: none;
    }

    .work-order-bar.status-blocked {
      box-shadow: 0 0 0 1px rgba(255, 245, 207, 1);
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
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    .work-order-bar:hover .actions,
    .work-order-bar.menu-open .actions {
      opacity: 1;
    }

    .actions-btn {
      width: 24px;
      height: 22px;
      border-radius: 5px;
      background-color: rgba(241, 243, 248, 1);
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      color: var(--color-text-labels);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .actions-btn:hover {
      background-color: rgba(228, 230, 238, 1);
      color: var(--color-text-primary);
    }

    .actions-dropdown {
      position: fixed;
      width: 200px;
      height: 80px;
      box-shadow: 0 0 0 1px rgba(104, 113, 150, 0.1),
        0 2.5px 3px -1.5px rgba(200, 207, 233, 1),
        0 4.5px 5px -1px rgba(216, 220, 235, 1);
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 1);
      border: none;
      z-index: 999999; /* above Work Center column and all work order bars */
      display: flex;
      flex-direction: column;
      isolation: isolate; /* own stacking context so it always paints on top */
    }

    .actions-dropdown button {
      flex: 1;
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 12px;
      border: none;
      background: none;
      text-align: left;
      font-size: 14px;
      cursor: pointer;
      font-family: var(--font-heading);
    }

    .actions-dropdown-edit {
      color: rgba(47, 48, 89, 1);
    }

    .actions-dropdown-edit:hover {
      background: rgba(241, 243, 248, 1);
    }

    .actions-dropdown-delete {
      color: rgba(62, 64, 219, 1);
    }

    .actions-dropdown-delete:hover {
      background: rgba(241, 243, 248, 1);
    }
  `,
})
export class WorkOrderBarComponent {
  order = input.required<WorkOrderDocument>();
  left = input.required<number>();
  width = input.required<number>();
  /** When true (Work Order Details panel is open), this bar closes its dropdown so it never overlaps the panel. */
  panelOpen = input<boolean>(false);

  edit = output<WorkOrderDocument>();
  delete = output<WorkOrderDocument>();
  openChange = output<boolean>();

  @ViewChild('actionsTrigger') actionsTrigger?: ElementRef<HTMLButtonElement>;

  menuOpen = signal(false);
  dropdownTop = signal(0);
  dropdownLeft = signal(0);

  private scrollSub: Subscription | null = null;

  statusLabel = computed(() => STATUS_LABELS[this.order().data.status]);

  private readonly doc = inject(DOCUMENT);
  private overlayEl: HTMLElement | null = null;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {
    afterNextRender(() => {});

    effect(() => {
      if (this.panelOpen()) {
        this.closeMenu();
      }
    });
  }

  private updateDropdownPosition(): void {
    const btn = this.actionsTrigger?.nativeElement;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    this.dropdownTop.set(rect.bottom + DROPDOWN_GAP_PX);
    this.dropdownLeft.set(rect.left);
    if (this.overlayEl) {
      this.overlayEl.style.top = `${rect.bottom + DROPDOWN_GAP_PX}px`;
      this.overlayEl.style.left = `${rect.left}px`;
    }
  }

  private createBodyOverlay(): void {
    this.destroyBodyOverlay();
    const top = this.dropdownTop();
    const left = this.dropdownLeft();
    const el = this.doc.createElement('div');
    el.className = 'actions-dropdown';
    el.setAttribute('data-work-order-dropdown', '');
    Object.assign(el.style, {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: '200px',
      height: '80px',
      boxShadow: '0 0 0 1px rgba(104, 113, 150, 0.1), 0 2.5px 3px -1.5px rgba(200, 207, 233, 1), 0 4.5px 5px -1px rgba(216, 220, 235, 1)',
      borderRadius: '5px',
      backgroundColor: '#fff',
      zIndex: '999999',
      display: 'flex',
      flexDirection: 'column',
    });
    const editBtn = this.doc.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    Object.assign(editBtn.style, {
      flex: '1',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '14px',
      color: 'rgba(3, 9, 41, 1)',
      textAlign: 'left',
    });
    editBtn.addEventListener('click', () => this.onEdit());
    const deleteBtn = this.doc.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    Object.assign(deleteBtn.style, {
      flex: '1',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '14px',
      color: 'rgba(62, 64, 219, 1)',
      textAlign: 'left',
    });
    deleteBtn.addEventListener('click', () => this.onDelete());
    el.addEventListener('click', (e) => e.stopPropagation());
    el.appendChild(editBtn);
    el.appendChild(deleteBtn);
    this.doc.body.appendChild(el);
    this.overlayEl = el;
  }

  private destroyBodyOverlay(): void {
    if (this.overlayEl?.parentNode) {
      this.overlayEl.parentNode.removeChild(this.overlayEl);
    }
    this.overlayEl = null;
  }

  private attachScrollListener(): void {
    this.clearScrollListener();
    const scrollEl = this.elementRef.nativeElement.closest('.timeline-grid-scroll') as HTMLElement | null;
    if (!scrollEl) return;
    this.scrollSub = fromEvent(scrollEl, 'scroll', { passive: true }).subscribe(() =>
      this.updateDropdownPosition(),
    );
  }

  private clearScrollListener(): void {
    this.scrollSub?.unsubscribe();
    this.scrollSub = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) return;
    const target = event.target as Element;
    if (target.closest('.actions-btn, .actions-dropdown, [data-work-order-dropdown]')) return;
    this.closeMenu();
  }

  onBarClick(event: Event): void {
    event.stopPropagation();
  }

  private closeMenu(): void {
    this.clearScrollListener();
    this.destroyBodyOverlay();
    this.menuOpen.set(false);
    this.openChange.emit(false);
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    const next = !this.menuOpen();
    if (!next) {
      this.closeMenu();
      this.menuOpen.set(false);
      this.openChange.emit(false);
    } else {
      this.updateDropdownPosition();
      this.menuOpen.set(true);
      this.openChange.emit(true);
      this.createBodyOverlay();
      this.attachScrollListener();
    }
  }

  onEdit(): void {
    this.closeMenu();
    this.edit.emit(this.order());
  }

  onDelete(): void {
    this.closeMenu();
    this.delete.emit(this.order());
  }

}
