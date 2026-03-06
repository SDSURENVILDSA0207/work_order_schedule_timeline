import {
  Component,
  Injectable,
  input,
  output,
  inject,
  signal,
  effect,
  computed,
  HostListener,
  ViewChild,
  ElementRef,
  afterNextRender,
  ChangeDetectorRef,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  NgbInputDatepicker,
  NgbDateStruct,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import type { WorkOrderDocument, WorkOrderStatus } from '../../models/work-order.model';
import { WorkOrderService } from '../../services/work-order.service';
import { addDays, toISODate, parseDate } from '../../utils/date.utils';

const STATUS_OPTIONS: { value: WorkOrderStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'complete', label: 'Complete' },
  { value: 'blocked', label: 'Blocked' },
];

/** Parse ISO date string (YYYY-MM-DD only) to NgbDateStruct; uses first 10 chars so month/year/day are correct in local context. */
function isoToNgb(iso: string): NgbDateStruct {
  const s = iso.trim().slice(0, 10);
  const parts = s.split('-');
  if (parts.length !== 3) return { year: 0, month: 1, day: 1 };
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return { year: y || 0, month: m || 1, day: d || 1 };
  return { year: y, month: m, day: d };
}

function ngbToIso(d: NgbDateStruct): string {
  const m = String(d.month).padStart(2, '0');
  const day = String(d.day).padStart(2, '0');
  return `${d.year}-${m}-${day}`;
}

/** Parser/formatter for date input: display and parse as MM.DD.YYYY (USA order, dot separator). */
function padNum(v: number | null): string {
  if (v == null || isNaN(v)) return '';
  return `0${v}`.slice(-2);
}

@Injectable()
class UsaDateParserFormatter extends NgbDateParserFormatter {
  format(date: NgbDateStruct | null): string {
    if (!date || date.day == null || date.month == null || date.year == null) return '';
    return `${padNum(date.month)}.${padNum(date.day)}.${date.year}`;
  }
  parse(value: string): NgbDateStruct | null {
    if (!value?.trim()) return null;
    const parts = value.trim().split(/[.\/\-]/);
    if (parts.length !== 3) return null;
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
    return { year, month, day };
  }
}

function endDateAfterStartValidator(getForm: () => FormGroup): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl) => {
    const form = getForm();
    const start = form?.get('startDate')?.value as NgbDateStruct | null;
    const end = control.value as NgbDateStruct | null;
    if (!start || !end) return null;
    const startDate = new Date(ngbToIso(start));
    const endDate = new Date(ngbToIso(end));
    return endDate > startDate ? null : { afterStart: true };
  };
}

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, NgbInputDatepicker],
  templateUrl: './work-order-panel.component.html',
  styleUrl: './work-order-panel.component.scss',
  providers: [{ provide: NgbDateParserFormatter, useClass: UsaDateParserFormatter }],
})
export class WorkOrderPanelComponent {
  private fb = inject(FormBuilder);
  private workOrderService = inject(WorkOrderService);
  private cdr = inject(ChangeDetectorRef);

  mode = input<'create' | 'edit'>('create');
  workCenterId = input.required<string>();
  startDatePrefill = input<string | null>(null);
  editOrder = input<WorkOrderDocument | null>(null);

  closed = output<void>();
  saved = output<void>();
  /** Emits when start or end date form value changes (for live bar preview). */
  datesChange = output<{ startDate: string; endDate: string }>();

  form!: FormGroup;
  overlapError = signal<string | null>(null);
  statusOptions = STATUS_OPTIONS;
  /** True while the close animation (slide right) is running. */
  closing = signal(false);

  @ViewChild('firstFocusable') firstFocusableRef?: ElementRef<HTMLInputElement>;
  @ViewChild('panelRef') panelRef?: ElementRef<HTMLElement>;

  isEditMode = computed(() => this.mode() === 'edit');

  constructor() {
    afterNextRender(() => {
      this.firstFocusableRef?.nativeElement?.focus();
    });
    this.form = this.fb.group({
      name: ['', Validators.required],
      status: ['open' as WorkOrderStatus, Validators.required],
      startDate: [null as NgbDateStruct | null, Validators.required],
      endDate: [null as NgbDateStruct | null, [Validators.required, endDateAfterStartValidator(() => this.form)]],
    });

    this.form.get('startDate')?.valueChanges?.subscribe(() => {
      this.form.get('endDate')?.updateValueAndValidity();
    });

    const emitDates = () => {
      const start = this.form.get('startDate')?.value as NgbDateStruct | null;
      const end = this.form.get('endDate')?.value as NgbDateStruct | null;
      if (start?.year != null && start?.month != null && start?.day != null &&
          end?.year != null && end?.month != null && end?.day != null) {
        this.datesChange.emit({
          startDate: ngbToIso(start),
          endDate: ngbToIso(end),
        });
      }
    };
    this.form.get('startDate')?.valueChanges?.subscribe(emitDates);
    this.form.get('endDate')?.valueChanges?.subscribe(emitDates);

    effect(() => {
      const mode = this.mode();
      const startPrefill = this.startDatePrefill();
      const order = this.editOrder();

      this.overlapError.set(null);

      if (mode === 'create' && startPrefill) {
        const start = isoToNgb(startPrefill);
        const endNgb = isoToNgb(toISODate(addDays(parseDate(startPrefill), 7)));
        this.form.patchValue({
          name: '',
          status: 'open',
          startDate: start,
          endDate: endNgb,
        });
        // Re-apply dates next tick so datepicker displays them in MM.DD.YYYY via formatter
        setTimeout(() => {
          this.form.get('startDate')?.setValue(start);
          this.form.get('endDate')?.setValue(endNgb);
          this.cdr.detectChanges();
        }, 0);
      } else if (mode === 'edit' && order) {
        const start = isoToNgb(order.data.startDate);
        const end = isoToNgb(order.data.endDate);
        this.form.patchValue({
          name: order.data.name,
          status: order.data.status,
          startDate: start,
          endDate: end,
        });
        setTimeout(() => {
          this.form.get('startDate')?.setValue(start);
          this.form.get('endDate')?.setValue(end);
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  cancel(): void {
    this.startClosing();
  }

  /** Runs slide-out (left to right) transition, then emits closed. */
  private startClosing(): void {
    if (this.closing()) return;
    this.closing.set(true);
    requestAnimationFrame(() => {
      const el = this.panelRef?.nativeElement;
      if (el) {
        const onEnd = () => this.closed.emit();
        el.addEventListener('transitionend', onEnd, { once: true });
      } else {
        this.closed.emit();
      }
    });
  }

  save(): void {
    this.overlapError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const startDate = ngbToIso(v.startDate);
    const endDate = ngbToIso(v.endDate);

    if (new Date(endDate) <= new Date(startDate)) {
      this.form.get('endDate')?.setErrors({ afterStart: true });
      return;
    }

    const workCenterId = this.workCenterId();
    const data = {
      name: v.name,
      workCenterId,
      status: v.status,
      startDate,
      endDate,
    };

    if (this.mode() === 'create') {
      const result = this.workOrderService.createOrder(data);
      if (result.success) {
        this.saved.emit();
      } else {
        this.overlapError.set(result.error ?? 'Unknown error');
      }
    } else {
      const order = this.editOrder();
      if (!order) return;
      const result = this.workOrderService.updateOrder(order.docId, data);
      if (result.success) {
        this.saved.emit();
      } else {
        this.overlapError.set(result.error ?? 'Unknown error');
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cancel();
  }

  onBackdropClick(): void {
    this.startClosing();
  }

  onPanelClick(event: Event): void {
    event.stopPropagation();
  }
}
