import type { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/** YYYY-MM-DD → NgbDateStruct (local calendar). */
export function isoToNgbDateStruct(iso: string): NgbDateStruct {
  const s = iso.trim().slice(0, 10);
  const parts = s.split('-');
  if (parts.length !== 3) {
    return { year: 0, month: 1, day: 1 };
  }
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) {
    return { year: y || 0, month: m || 1, day: d || 1 };
  }
  return { year: y, month: m, day: d };
}

export function ngbDateStructToIso(d: NgbDateStruct | null | undefined): string {
  if (!d || d.month == null || d.day == null || d.year == null) {
    return '';
  }
  const m = String(d.month).padStart(2, '0');
  const day = String(d.day).padStart(2, '0');
  return `${d.year}-${m}-${day}`;
}

/** Lexicographic compare of YYYY-MM-DD strings. */
export function compareIsoDateStrings(a: string, b: string): number {
  return a.localeCompare(b);
}

export function padTwo(v: number | null): string {
  if (v == null || isNaN(v)) {
    return '';
  }
  return `0${v}`.slice(-2);
}
