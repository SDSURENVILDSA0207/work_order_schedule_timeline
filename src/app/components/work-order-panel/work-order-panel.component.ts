import {
  Component,
  input,
  output,
  inject,
  signal,
  effect,
  computed,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbInputDatepicker, NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, NgbInputDatepicker],
  templateUrl: './work-order-panel.component.html',
  styleUrl: './work-order-panel.component.scss',
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

  form!: FormGroup;
  overlapError = signal<string | null>(null);
  statusOptions = STATUS_OPTIONS;

  isEditMode = computed(() => this.mode() === 'edit');

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      status: ['open' as WorkOrderStatus, Validators.required],
      startDate: [null as NgbDateStruct | null, Validators.required],
      endDate: [null as NgbDateStruct | null, Validators.required],
    });

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

  onBackdropClick(): void {
    this.closed.emit();
  }

  onPanelClick(event: Event): void {
    event.stopPropagation();
  }
}
