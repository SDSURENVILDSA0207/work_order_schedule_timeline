# AI prompts and implementation guidance

This document captures the **kinds of prompts** and **decisions** that shaped the Work Order Schedule Timeline, so reviewers and future contributors (human or AI) can follow the same rules. Wording is **representative** of prompts used during development, not a verbatim export of any single tool thread.

---

## 1. Project brief and stack

> Build a work-order **timeline** in Angular: rows = work centers, X axis = time, bars = work orders. Support **day / week / month** zoom, **infinite** horizontal range extension, **create/edit** in a **drawer** or side panel, **overlap validation** on the same work center, and **local persistence** for orders. Use **strict typing**, **signals** where appropriate, and keep styles aligned with a provided design / token set.

**Guidance that stuck:** single entry with `<app-timeline />`, `WorkOrderService` for documents + `localStorage`, `TimelineService` for all **date range and x-position math** (no ad-hoc `Date` usage in templates).

---

## 2. Timeline math: half-open range and bars

> Model the visible range as **half-open** `[start, end)` so column counts and the last included period stay consistent. Map **date → x** with **linear interpolation in ms** on that interval. For bars, user-facing dates are **inclusive** days but draw the bar in time through **end-of-day** / start of the next day so two adjacent orders on the same row do not double-count a pixel at midnight.

**Result:** `TimelineRange` + `dateToPixel` / `timeToPixel` in `TimelineService`, and `layoutWorkOrderBar` using `addDays(endDate, 1)` for the exclusive time end (see `timeline-bar-layout.util.ts`).

---

## 3. Infinite scroll without visual jump

> When the user scrolls **near the left** or **right** edge, **prepend** or **append** more periods. When prepending, add the same number of **pixels** to `scrollLeft` so the same date stays under the cursor.

**Result:** `extendRangeStart` / `extendRangeEnd`, `pendingPrependPx` + `effect` in `TimelineViewStateService`, thresholds from `TIMELINE_CONFIG`.

---

## 4. Overlap detection

> Reject new or updated orders when **inclusive** `[start, end]` date ranges on the **same work center** intersect another order; exclude the current document id on edit. Reuse the same check in the service and show a **clear** error in the form.

**Result:** `hasOverlap` in `work-order.service.ts` with the standard `newStart <= existingEnd && newEnd >= existingStart` on `Date` at local midnight; panel binds `overlapError` from `create`/`update` return values.

> Note: **grid** hit testing uses **pixel** overlap (`cellIntersectsBarInset`); that is *not* the same as business-rule date overlap.

---

## 5. Create-from-cell and empty cells

> Only allow **create** on a **cell** that does not have a work order bar across it (optionally with a small inset for anti-aliasing). Derive the **default start** from the **column** under the click (month = first of month, etc.).

**Result:** `handleCellPointerCreate`, `columnIndexFromRowPointerX`, `isCellEmptyForWorkCenter` + `isoStartDateForColumn` / column `date` depending on zoom.

---

## 6. Forms and dates

> Use a **datepicker** with **US-style** display **MM.DD.YYYY** (dots) and keep validation (end after start) in a small validator. Map **NgbDateStruct** ↔ **ISO** in one place.

**Result:** `UsaDateParserFormatter`, `ngb-iso-date.utils`, `endDateAfterStartFormValidator`, `@ng-select` for status.

---

## 7. UX and accessibility (incremental)

> Single **kebab** menu at a time; close bar menus when the work order **panel** opens. Add **focus-visible** on the timescale trigger for keyboard users. Use **OnPush** on leaf components that only depend on `input()`/signals if change detection still updates when signals change.

**Result:** `openMenuBarId`, `forceCloseMenu`, focus ring in `timescale-selector`, `OnPush` on selected components.

---

## 8. Sample data and reviewers

> Seed work centers/orders for **all statuses**; ensure **at least** one center with **multiple** orders that **do not** overlap. Put **sample dates in a year** the reviewer will have in the “today” window so the first paint is not an empty grid.

**Result:** `SAMPLE_WORK_*` in `sample-data.ts` (with a short comment about the chosen calendar window).

---

## Conventions (quick reference)

- **Angular:** Standalone components, `input()` / `output()`, `inject()`, signals for app state in services.
- **Models:** `WorkCenterDocument`, `WorkOrderDocument` in `work-order.model.ts`; `TimelineZoom` includes `'hour'`.
- **Paths:** `TimelineViewStateService` = UI + scroll + panel + column helpers; `TimelineService` = pure(ish) time math; `WorkOrderService` = documents + overlap + `localStorage`.

---

## File pointer

See also the repository root for design tokens: **../DESIGN_TOKENS.md**.
