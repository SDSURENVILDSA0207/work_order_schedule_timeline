import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  HostListener,
  computed,
  ViewChild,
  ElementRef,
  inject,
  effect,
  OnDestroy,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { fromEvent, type Subscription } from 'rxjs';
import {
  WORK_ORDER_STATUS_LABELS,
  type WorkOrderDocument,
} from '../../models/work-order.model';
import { formatIsoDateRangeForDisplay } from '../../utils/date.utils';

const DROPDOWN_GAP_PX = 6;
const DROPDOWN_WIDTH_PX = 152;
const DROPDOWN_EST_HEIGHT_PX = 80;
const MIN_WIDTH_PX_FOR_ACTIONS = 48;
const MIN_WIDTH_PX_FOR_STATUS_BADGE = 100;

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'onBarClick($event)',
    '[style.left.px]': 'left()',
    '[style.width.px]': 'width()',
    '[class.dropdown-open]': 'menuOpen()',
  },
  templateUrl: './work-order-bar.component.html',
  styleUrl: './work-order-bar.component.scss',
})
export class WorkOrderBarComponent implements OnDestroy {
  order = input.required<WorkOrderDocument>();
  /** Shown in hover details (row context has the work center name). */
  workCenterName = input<string>('');
  left = input.required<number>();
  width = input.required<number>();
  /** When true (Work Order Details panel is open), this bar closes its dropdown so it never overlaps the panel. */
  panelOpen = input<boolean>(false);
  /** When true, another bar’s menu is open; this bar must close its menu so only one is open. */
  forceCloseMenu = input<boolean>(false);

  edit = output<WorkOrderDocument>();
  delete = output<WorkOrderDocument>();
  openChange = output<boolean>();

  @ViewChild('actionsTrigger') actionsTrigger?: ElementRef<HTMLButtonElement>;

  menuOpen = signal(false);

  private scrollSub: Subscription | null = null;
  private resizeSub: Subscription | null = null;

  private readonly doc = inject(DOCUMENT);
  private overlayEl: HTMLElement | null = null;
  private firstMenuItemEl: HTMLButtonElement | null = null;

  /** Pointer capture phase: close on outside without fighting menu item clicks. */
  private readonly onDocumentPointerDown = (ev: Event) => {
    if (!this.menuOpen()) {
      return;
    }
    const t = ev.target as Node | null;
    if (!t) {
      return;
    }
    if (this.actionsTrigger?.nativeElement.contains(t)) {
      return;
    }
    if (this.overlayEl?.contains(t)) {
      return;
    }
    this.closeMenu();
  };

  statusLabel = computed(() => WORK_ORDER_STATUS_LABELS[this.order().data.status]);

  /** Native `title` tooltip: name, range, status, work center. */
  barDetailsTooltip = computed(() => {
    const o = this.order().data;
    const wc = this.workCenterName().trim();
    const range = formatIsoDateRangeForDisplay(o.startDate, o.endDate);
    return [o.name, range, WORK_ORDER_STATUS_LABELS[o.status], wc || undefined]
      .filter(Boolean)
      .join(' · ');
  });

  showActions = computed(
    () => this.width() >= MIN_WIDTH_PX_FOR_ACTIONS || this.menuOpen(),
  );

  /** On narrow bars, prefer name + kebab over the status chip. */
  showStatusBadge = computed(() => {
    if (this.width() < MIN_WIDTH_PX_FOR_STATUS_BADGE) {
      return false;
    }
    return true;
  });

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      if (this.panelOpen()) {
        this.closeMenu();
      }
    });
    effect(() => {
      if (this.forceCloseMenu() && this.menuOpen()) {
        this.closeMenu();
      }
    });
  }

  ngOnDestroy(): void {
    this.removeOutsidePointerListener();
    this.clearScrollListener();
    this.clearResizeListener();
    this.destroyBodyOverlay();
    if (this.menuOpen()) {
      this.openChange.emit(false);
    }
    this.menuOpen.set(false);
  }

  private applyOverlayPosition(): void {
    if (!this.overlayEl) {
      return;
    }
    const { top, left } = this.computeMenuPosition();
    this.overlayEl.style.top = `${top}px`;
    this.overlayEl.style.left = `${left}px`;
  }

  private computeMenuPosition(): { top: number; left: number } {
    const btn = this.actionsTrigger?.nativeElement;
    if (!btn) {
      return { top: 0, left: 0 };
    }
    const rect = btn.getBoundingClientRect();
    const gap = DROPDOWN_GAP_PX;
    const w = DROPDOWN_WIDTH_PX;
    const h = DROPDOWN_EST_HEIGHT_PX;
    const vw = this.doc.defaultView?.innerWidth ?? 1000;
    const vh = this.doc.defaultView?.innerHeight ?? 800;

    let left = rect.right - w;
    left = Math.max(6, Math.min(left, vw - w - 6));

    let top = rect.bottom + gap;
    if (top + h > vh - 6) {
      const above = rect.top - gap - h;
      if (above >= 6) {
        top = above;
      } else {
        top = Math.max(6, Math.min(top, vh - h - 6));
      }
    }
    return { top, left };
  }

  private createBodyOverlay(): void {
    this.destroyBodyOverlay();
    const { top, left } = this.computeMenuPosition();
    const el = this.doc.createElement('div');
    el.setAttribute('data-work-order-dropdown', '');
    el.setAttribute('role', 'menu');
    el.setAttribute('aria-label', 'Work order actions');
    el.className = 'wo-bar-dropdown';
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;

    const editBtn = this.doc.createElement('button');
    editBtn.type = 'button';
    editBtn.setAttribute('role', 'menuitem');
    editBtn.setAttribute('tabindex', '0');
    editBtn.className = 'wo-bar-dropdown__item wo-bar-dropdown__item--edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onEdit();
    });

    const deleteBtn = this.doc.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('role', 'menuitem');
    deleteBtn.setAttribute('tabindex', '0');
    deleteBtn.className = 'wo-bar-dropdown__item wo-bar-dropdown__item--delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onDelete();
    });

    el.addEventListener('click', (e) => e.stopPropagation());
    el.addEventListener('pointerdown', (e) => e.stopPropagation());
    el.appendChild(editBtn);
    el.appendChild(deleteBtn);
    this.doc.body.appendChild(el);
    this.overlayEl = el;
    this.firstMenuItemEl = editBtn;
  }

  private destroyBodyOverlay(): void {
    this.firstMenuItemEl = null;
    if (this.overlayEl?.parentNode) {
      this.overlayEl.parentNode.removeChild(this.overlayEl);
    }
    this.overlayEl = null;
  }

  private attachScrollListener(): void {
    this.clearScrollListener();
    const scrollEl = this.elementRef.nativeElement.closest('.timeline-grid-scroll') as
      | HTMLElement
      | null;
    if (!scrollEl) {
      return;
    }
    this.scrollSub = fromEvent(scrollEl, 'scroll', { passive: true }).subscribe(() =>
      this.applyOverlayPosition(),
    );
  }

  private clearScrollListener(): void {
    this.scrollSub?.unsubscribe();
    this.scrollSub = null;
  }

  private attachRepositionListener(): void {
    this.clearResizeListener();
    this.resizeSub = fromEvent(this.doc.defaultView as Window, 'resize', { passive: true }).subscribe(
      () => {
        if (this.menuOpen()) {
          this.applyOverlayPosition();
        }
      },
    );
  }

  private clearResizeListener(): void {
    this.resizeSub?.unsubscribe();
    this.resizeSub = null;
  }

  private addOutsidePointerListener(): void {
    this.removeOutsidePointerListener();
    this.doc.addEventListener('pointerdown', this.onDocumentPointerDown, true);
  }

  private removeOutsidePointerListener(): void {
    this.doc.removeEventListener('pointerdown', this.onDocumentPointerDown, true);
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.menuOpen()) {
      event.preventDefault();
      event.stopPropagation();
      this.closeMenu();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }
    if (!this.menuOpen() || !this.overlayEl) {
      return;
    }
    const focusRoot = this.doc.activeElement;
    if (!focusRoot || !this.overlayEl.contains(focusRoot)) {
      return;
    }
    const items = Array.from(
      this.overlayEl.querySelectorAll<HTMLButtonElement>('.wo-bar-dropdown__item'),
    );
    if (items.length === 0) {
      return;
    }
    const cur = items.indexOf(focusRoot as HTMLButtonElement);
    const i = cur < 0 ? 0 : cur;
    event.preventDefault();
    if (event.key === 'ArrowDown') {
      items[Math.min(i + 1, items.length - 1)]?.focus();
    } else {
      items[Math.max(i - 1, 0)]?.focus();
    }
  }

  onBarClick(event: Event): void {
    event.stopPropagation();
  }

  private focusTrigger(): void {
    this.actionsTrigger?.nativeElement?.focus();
  }

  private closeMenu(): void {
    this.removeOutsidePointerListener();
    this.clearScrollListener();
    this.clearResizeListener();
    this.destroyBodyOverlay();
    const wasOpen = this.menuOpen();
    this.menuOpen.set(false);
    if (wasOpen) {
      this.openChange.emit(false);
      queueMicrotask(() => this.focusTrigger());
    }
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    if (this.menuOpen()) {
      this.closeMenu();
      return;
    }
    this.menuOpen.set(true);
    this.openChange.emit(true);
    this.createBodyOverlay();
    this.attachScrollListener();
    this.attachRepositionListener();
    this.addOutsidePointerListener();
    this.queueMenuFocus();
  }

  private queueMenuFocus(): void {
    requestAnimationFrame(() => {
      this.firstMenuItemEl?.focus();
    });
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
