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
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbInputDatepicker, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {
  WORK_ORDER_STATUS_OPTIONS,
  type DraftOrderDateRange,
  type PanelMode,
  type WorkOrderDocument,
  type WorkOrderStatus,
} from '../../models/work-order.model';
import { WorkOrderService } from '../../services/work-order.service';
import { addDays, toISODate, parseDate, startOfDay } from '../../utils/date.utils';
import {
  compareIsoDateStrings,
  isoToNgbDateStruct,
  ngbDateStructToIso,
  padTwo,
} from '../../utils/ngb-iso-date.utils';
import { endDateAfterStartFormValidator } from './work-order-form.validators';

/** Default span for a new work order from the pre-filled start date. */
const CREATE_END_OFFSET_DAYS = 7;

@Injectable()
class UsaDateParserFormatter extends NgbDateParserFormatter {
  format(date: NgbDateStruct | null): string {
    if (!date || date.day == null || date.month == null || date.year == null) {
      return '';
    }
    return `${padTwo(date.month)}.${padTwo(date.day)}.${date.year}`;
  }
  parse(value: string): NgbDateStruct | null {
    if (!value?.trim()) {
      return null;
    }
    const parts = value.trim().split(/[.\/\-]/);
    if (parts.length !== 3) {
      return null;
    }
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return null;
    }
    return { year, month, day };
  }
}

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, NgbInputDatepicker],
  templateUrl: './work-order-panel.component.html',
  styleUrl: './work-order-panel.component.scss',
  providers: [{ provide: NgbDateParserFormatter, useClass: UsaDateParserFormatter }],
})
export class WorkOrderPanelComponent {
  private fb = inject(FormBuilder);
  private workOrderService = inject(WorkOrderService);
  private cdr = inject(ChangeDetectorRef);

  mode = input<PanelMode>('create');
  workCenterId = input.required<string>();
  startDatePrefill = input<string | null>(null);
  editOrder = input<WorkOrderDocument | null>(null);

  closed = output<void>();
  saved = output<void>();
  datesChange = output<DraftOrderDateRange>();

  form!: FormGroup;
  overlapError = signal<string | null>(null);
  statusOptions = WORK_ORDER_STATUS_OPTIONS;
  closing = signal(false);

  @ViewChild('firstFocusable') firstFocusableRef?: ElementRef<HTMLInputElement>;
  @ViewChild('panelRef') panelRef?: ElementRef<HTMLElement>;

  isEditMode = computed(() => this.mode() === 'edit');

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      status: ['open' as WorkOrderStatus, Validators.required],
      startDate: [null as NgbDateStruct | null, Validators.required],
      endDate: [
        null as NgbDateStruct | null,
        [Validators.required, endDateAfterStartFormValidator(() => this.form)],
      ],
    });

    this.form.get('startDate')?.valueChanges.subscribe(() => {
      this.form.get('endDate')?.updateValueAndValidity({ emitEvent: true });
    });

    const emitDates = () => {
      const start = this.form.get('startDate')?.value as NgbDateStruct | null;
      const end = this.form.get('endDate')?.value as NgbDateStruct | null;
      if (
        start?.year != null &&
        start?.month != null &&
        start?.day != null &&
        end?.year != null &&
        end?.month != null &&
        end?.day != null
      ) {
        this.datesChange.emit({
          startDate: ngbDateStructToIso(start),
          endDate: ngbDateStructToIso(end),
        });
      }
    };
    this.form.get('startDate')?.valueChanges.subscribe(emitDates);
    this.form.get('endDate')?.valueChanges.subscribe(emitDates);

    effect(() => {
      const mode = this.mode();
      const startPrefill = this.startDatePrefill();
      const order = this.editOrder();

      this.overlapError.set(null);
      this.hardResetForm();

      if (mode === 'create') {
        const startBase =
          startPrefill != null && startPrefill.length >= 8
            ? startPrefill
            : toISODate(startOfDay(new Date()));
        const startNgb = isoToNgbDateStruct(startBase);
        const endNgb = isoToNgbDateStruct(
          toISODate(addDays(parseDate(startBase), CREATE_END_OFFSET_DAYS))
        );
        this.form.setValue(
          {
            name: '',
            status: 'open' as WorkOrderStatus,
            startDate: startNgb,
            endDate: endNgb,
          },
          { emitEvent: false }
        );
        queueMicrotask(() => {
          this.cdr.markForCheck();
          this.focusNameField();
        });
      } else if (mode === 'edit' && order) {
        const startNgb = isoToNgbDateStruct(order.data.startDate);
        const endNgb = isoToNgbDateStruct(order.data.endDate);
        this.form.setValue(
          {
            name: order.data.name,
            status: order.data.status,
            startDate: startNgb,
            endDate: endNgb,
          },
          { emitEvent: false }
        );
        queueMicrotask(() => {
          this.cdr.markForCheck();
          this.form.markAsPristine();
          this.focusNameField();
        });
      }
    });
  }

  private hardResetForm(): void {
    this.form.reset(
      {
        name: '',
        status: 'open' as WorkOrderStatus,
        startDate: null,
        endDate: null,
      },
      { emitEvent: false }
    );
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private focusNameField(): void {
    setTimeout(() => this.firstFocusableRef?.nativeElement?.focus(), 0);
  }

  cancel(): void {
    this.startClosing();
  }

  private startClosing(): void {
    if (this.closing()) {
      return;
    }
    this.closing.set(true);
    let emitted = false;
    const fire = () => {
      if (emitted) {
        return;
      }
      emitted = true;
      this.closed.emit();
    };
    const timer = window.setTimeout(fire, 400);
    requestAnimationFrame(() => {
      const el = this.panelRef?.nativeElement;
      if (el) {
        const onEnd = (ev: TransitionEvent) => {
          if (ev.propertyName === 'transform') {
            clearTimeout(timer);
            fire();
          }
        };
        el.addEventListener('transitionend', onEnd, { once: true });
      } else {
        clearTimeout(timer);
        fire();
      }
    });
  }

  save(): void {
    this.overlapError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const startDate = ngbDateStructToIso(v.startDate);
    const endDate = ngbDateStructToIso(v.endDate);

    if (!startDate || !endDate) {
      this.form.markAllAsTouched();
      return;
    }
    if (compareIsoDateStrings(endDate, startDate) <= 0) {
      this.form.get('endDate')?.setErrors({ endAfterStart: true });
      this.form.get('endDate')?.markAsTouched();
      return;
    }

    const workCenterId = this.workCenterId();
    const data = {
      name: (v.name as string).trim(),
      workCenterId,
      status: v.status as WorkOrderStatus,
      startDate,
      endDate,
    };
    if (!data.name) {
      this.form.get('name')?.setErrors({ required: true });
      return;
    }

    if (this.mode() === 'create') {
      const result = this.workOrderService.createOrder(data);
      if (result.success) {
        this.saved.emit();
      } else {
        this.overlapError.set(
          result.error ?? 'A work order already exists in this time range for this work center.'
        );
      }
    } else {
      const order = this.editOrder();
      if (!order) {
        return;
      }
      const result = this.workOrderService.updateOrder(order.docId, data);
      if (result.success) {
        this.saved.emit();
      } else {
        this.overlapError.set(
          result.error ?? 'A work order already exists in this time range for this work center.'
        );
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (this.closing()) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && (event.key === 's' || event.key === 'S')) {
      event.preventDefault();
      this.save();
    }
  }

  onBackdropClick(): void {
    this.startClosing();
  }

  onPanelClick(event: Event): void {
    event.stopPropagation();
  }
}
