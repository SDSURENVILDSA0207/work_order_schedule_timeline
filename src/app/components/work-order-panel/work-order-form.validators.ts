import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import type { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { compareIsoDateStrings, ngbDateStructToIso } from '../../utils/ngb-iso-date.utils';

/** End date (struct) must be strictly after start when both are set. */
export function endDateAfterStartFormValidator(
  getForm: () => FormGroup,
): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl) => {
    const form = getForm();
    const start = form?.get('startDate')?.value as NgbDateStruct | null;
    const end = control.value as NgbDateStruct | null;
    if (!start || !end) {
      return null;
    }
    const a = ngbDateStructToIso(start);
    const b = ngbDateStructToIso(end);
    if (!a || !b) {
      return null;
    }
    return compareIsoDateStrings(b, a) > 0 ? null : { endAfterStart: true };
  };
}
