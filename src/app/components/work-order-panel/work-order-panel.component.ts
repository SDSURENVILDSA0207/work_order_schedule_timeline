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
import { addDays, toISODate } from '../../utils/date.utils';

const STATUS_OPTIONS: { value: WorkOrderStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'complete', label: 'Complete' },
  { value: 'blocked', label: 'Blocked' },
];

function isoToNgb(iso: string): NgbDateStruct {
  const [y, m, d] = iso.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function ngbToIso(d: NgbDateStruct): string {
  const m = String(d.month).padStart(2, '0');
  const day = String(d.day).padStart(2, '0');
  return `${d.year}-${m}-${day}`;
}

/** Parser/formatter for date input: display and parse as dd.MM.yyyy with "." separator */
function padNum(v: number | null): string {
  if (v == null || isNaN(v)) return '';
  return `0${v}`.slice(-2);
}

@Injectable()
class DotDateParserFormatter extends NgbDateParserFormatter {
  format(date: NgbDateStruct | null): string {
    if (!date || date.day == null || date.month == null || date.year == null) return '';
    return `${padNum(date.day)}.${padNum(date.month)}.${date.year}`;
  }
  parse(value: string): NgbDateStruct | null {
    if (!value?.trim()) return null;
    const parts = value.trim().split('.');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
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
  providers: [{ provide: NgbDateParserFormatter, useClass: DotDateParserFormatter }],
})
export class WorkOrderPanelComponent {
  private fb = inject(FormBuilder);
  private workOrderService = inject(WorkOrderService);

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

  isEditMode = computed(() => this.mode() === 'edit');

  constructor() {
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
        const endDate = addDays(new Date(startPrefill), 7);
        this.form.patchValue({
          name: '',
          status: 'open',
          startDate: start,
          endDate: isoToNgb(toISODate(endDate)),
        });
      } else if (mode === 'edit' && order) {
        this.form.patchValue({
          name: order.data.name,
          status: order.data.status,
          startDate: isoToNgb(order.data.startDate),
          endDate: isoToNgb(order.data.endDate),
        });
      }
    });
  }

  cancel(): void {
    this.closed.emit();
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
    this.closed.emit();
  }

  onPanelClick(event: Event): void {
    event.stopPropagation();
  }
}
