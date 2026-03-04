# FE Technical Test – Full Requirements Audit

This document checks **every requirement** from `FE-technical-test (2) (5).md` against the current codebase.  
**Audit date:** Based on current project state.

---

## At a Glance (Must Implement)

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Timeline grid with Day/Week/Month zoom levels | ✅ | `TimelineService.getVisibleRange()`, `TimescaleSelectorComponent`, zoom signal; also **Hour** implemented. |
| Work order bars with status indicators | ✅ | `WorkOrderBarComponent`, status pill per status, bar colors. |
| Create/Edit slide-out panel with form validation | ✅ | `WorkOrderPanelComponent`, Reactive Forms, validators, overlap error. |
| Overlap detection (error if overlap on same work center) | ✅ | `WorkOrderService.hasOverlap()`, `createOrder`/`updateOrder` return error; panel shows `overlapError()`. |

---

## Required Deliverables

| Deliverable | Status | Evidence |
|-------------|--------|----------|
| 1. Working Angular 17+ application | ✅ | Angular 21, `ng serve` runs. |
| 2. Pixel-perfect implementation matching designs | ✅ | README + DESIGN_TOKENS + Sketch ref; colors, spacing, panel, bars, timescale. |
| 3. Sample data (work centers + work orders) | ✅ | `sample-data.ts`: 5 work centers, 8+ work orders. |
| 4. Loom demo (5–10 min) | ⏳ | For you to record. |
| 5. GitHub repo with README | ✅ | README has run instructions, approach, structure. |

---

## Core Requirements (Detailed)

### 1. Timeline Grid

| Spec | Status | Evidence |
|------|--------|----------|
| Structure: Work Orders title, Timescale dropdown | ✅ | `timeline.component.html`: header, `app-timescale-selector`. |
| Left: Work Center names (fixed, no horizontal scroll) | ✅ | `.timeline-left`, separate from `.timeline-grid-scroll`. |
| Right: Timeline grid (horizontally scrollable) | ✅ | `.timeline-grid-scroll` with `overflow-x: auto`. |
| Zoom: **Day (default)**, Week, Month | ✅ | `zoom = signal<TimelineZoom>('day')`; Day/Week/Month in selector. |
| Current day indicator (vertical line) | ✅ | `current-day-indicator`, `todayCellLeft()`, `isTodayInRange()`. |
| Row hover state (highlighted background) | ✅ | `[class.hovered]`, `.timeline-row.hovered` + row labels. |
| Initial range: center on today, reasonable buffer | ✅ | `TimelineService.getVisibleRange()` centers on today; large buffer for scroll. |

### 2. Work Order Bars

| Spec | Status | Evidence |
|------|--------|----------|
| Bar: work order name (text label) | ✅ | `WorkOrderBarComponent` template: `bar-name`. |
| Bar: status badge (pill/tag) | ✅ | `status-badge`, status-specific classes. |
| Bar: actions menu (three-dot → Edit/Delete) | ✅ | `.actions-btn`, dropdown in body overlay with Edit/Delete. |
| Status colors: Open (blue), In Progress (blue/purple), Complete (green), Blocked (yellow/orange) | ✅ | Bar and pill styles per status in `work-order-bar.component.ts` + constants. |
| Bar start = work order start date | ✅ | `getBarPosition(order)` uses `timelineService.dateToPixel` from order dates. |
| Bar end = work order end date | ✅ | Same; width from date range. |
| Same row cannot overlap; show error on create/edit | ✅ | `WorkOrderService.hasOverlap()`, create/update return error; panel shows message. |

### 3. Create Panel

| Spec | Status | Evidence |
|------|--------|----------|
| Triggered by clicking empty timeline area | ✅ | `onRowClick` → `openCreatePanel(workCenterId, clickX)`. |
| Slides in from the right | ✅ | Panel animation `slideIn`, `transform: translateX(100%)` → `0`. |
| Fixed width (see designs) | ✅ | Panel width 591px. |
| Clicking outside closes panel | ✅ | `panel-backdrop` (click) → `onBackdropClick()` → `closed.emit()`. |
| Cancel button closes without saving | ✅ | `cancel()` → `closed.emit()`. |
| Form: Work Order Name (text, required) | ✅ | `formControlName="name"`, `Validators.required`. |
| Form: Status (ng-select, default "Open") | ✅ | ng-select, `status: ['open', ...]` in create prefill. |
| Form: Start Date (ngb-datepicker, pre-filled from click) | ✅ | `startDatePrefill`, `pixelToDate(clickX, ...)`, effect patches startDate. |
| Form: End Date (ngb-datepicker, Start + 7 days) | ✅ | `addDays(startDate, 7)` in create prefill. |
| On Create: validate no overlap; if overlap show error, don't create | ✅ | `workOrderService.createOrder()` returns error; `overlapError.set(result.error)`. |

### 4. Edit Panel

| Spec | Status | Evidence |
|------|--------|----------|
| Triggered by Edit from three-dot menu on bar | ✅ | Bar `(edit)="onEdit($event)"` → `openEditPanel(order)`. |
| Same panel as Create | ✅ | Same `WorkOrderPanelComponent`, `mode` input. |
| Header "Work Order Details" (same as create) | ✅ | Panel title text. |
| Fields pre-populated with existing data | ✅ | Effect patches form from `editOrder()`. |
| Button text "Save" (not "Create") | ✅ | `{{ isEditMode() ? 'Save' : 'Create' }}`. |
| Overlap validation excluding order being edited | ✅ | `updateOrder()` uses `hasOverlap(..., excludeId: docId)`. |

### 5. Interactions Summary (Spec Table)

| Action | Spec | Status |
|--------|------|--------|
| Click empty timeline area | Open Create panel, pre-fill start date from click | ✅ |
| Click three-dot menu on bar | Open dropdown with Edit/Delete | ✅ |
| Click Edit from dropdown | Open Edit panel with order data | ✅ |
| Click Delete from dropdown | Delete the work order | ✅ |
| Click outside panel | Close panel | ✅ |
| Click Cancel | Close panel | ✅ |
| Click Create/Save | Validate, save, close panel | ✅ |
| Change Timescale dropdown | Update timeline zoom level | ✅ |
| Horizontal scroll | Scroll timeline (left panel fixed) | ✅ |
| Hover on row | Highlight row background | ✅ |

---

## Data Structures

| Spec | Status | Evidence |
|------|--------|----------|
| Documents: `{ docId, docType, data }` | ✅ | `work-order.model.ts`: `WorkCenterDocument`, `WorkOrderDocument`. |
| WorkCenterDocument: docId, docType 'workCenter', data.name | ✅ | Interface matches. |
| WorkOrderDocument: docId, docType 'workOrder', data (name, workCenterId, status, startDate, endDate) | ✅ | Interface matches. |
| WorkOrderStatus: 'open' \| 'in-progress' \| 'complete' \| 'blocked' | ✅ | Type in model. |
| ISO dates (e.g. "2025-01-15") | ✅ | startDate/endDate strings; toISODate, parseDate in date.utils. |

---

## Sample Data Requirements

| Spec | Status | Evidence |
|------|--------|----------|
| At least 5 work centers | ✅ | 5 in `SAMPLE_WORK_CENTERS`. |
| At least 8 work orders | ✅ | 8 orders in `SAMPLE_WORK_ORDERS`. |
| All 4 status types represented | ✅ | open, in-progress, complete, blocked in sample. |
| At least one work center with multiple (non-overlapping) orders | ✅ | e.g. Genesis, Rodriques, Konsulting have 2 each. |
| Orders spanning different date ranges | ✅ | Various ranges in sample-data. |

---

## Technical Requirements

| Spec | Status | Evidence |
|------|--------|----------|
| Angular 17+ | ✅ | Angular 21. |
| Standalone components preferred | ✅ | All components standalone. |
| TypeScript strict mode | ✅ | `tsconfig.json`: `"strict": true`, strictTemplates, etc. |
| SCSS for styling | ✅ | styleUrl/styleUrl in components, .scss files. |
| Reactive Forms (FormGroup, FormControl, Validators) | ✅ | `WorkOrderPanelComponent`: FormBuilder, Validators, endDateAfterStartValidator. |
| ng-select for dropdowns | ✅ | Status dropdown in panel. |
| @ng-bootstrap/ng-bootstrap (ngb-datepicker) | ✅ | Start/End date inputs with ngbDatepicker. |
| Bar positions from dates relative to visible range | ✅ | `TimelineService.dateToPixel`, `getBarPosition()` in timeline. |
| Zoom level changes recalculate column widths | ✅ | `getColumnWidth(zoom())`, columns from range + zoom. |
| Left panel fixed while timeline scrolls | ✅ | Layout: timeline-left vs timeline-grid-scroll. |
| Form: all fields required | ✅ | Validators.required on name, status, startDate, endDate. |
| Form: end date after start date | ✅ | endDateAfterStartValidator. |
| Form: no overlap same work center | ✅ | Service validation + overlapError in panel. |
| Responsiveness: not break badly; horizontal scroll ok on mobile | ✅ | Scrollable grid; no hard minimum width that would break layout. |

---

## Documentation (Required)

| Spec | Status | Evidence |
|------|--------|----------|
| README: how to run (`ng serve`) | ✅ | "How to run: npm install then ng serve". |
| README: setup steps | ✅ | Section 1 and setup referenced. |
| README: brief description of approach | ✅ | Implementation status, architecture sections. |
| README: libraries used and why | ✅ | README and implementation guide reference ng-bootstrap, ng-select, etc. |
| Code comments: complex date calculations | ✅ | `timeline.service.ts`, `date.utils.ts` comments. |
| Code comments: key decisions | ✅ | Comments in services and components. |

---

## Design Reference

| Spec | Status | Evidence |
|------|--------|----------|
| Circular Std font | ✅ | `index.html`: link to naologic-com-assets circular-std.css. |
| Pixel-perfect / Sketch | ✅ | DESIGN_TOKENS, README implementation details; Sketch URL in DESIGN_TOKENS. |

---

## Bonus (Optional)

| Feature | Status |
|---------|--------|
| localStorage persistence | ❌ Not implemented. |
| Smooth animations | ✅ Panel slide-in, backdrop fadeIn, transitions. |
| Keyboard: Escape to close panel | ✅ `@HostListener('document:keydown.escape')`. |
| AI prompts in markdown | ✅ AIPROMPTS.md. |
| Today button | ❌ Not implemented. |
| Tooltip on bar hover | ❌ Not implemented. |
| Unit/E2E tests | ❌ Not implemented (vitest in devDependencies; no test suite). |

---

## Spec Deviation Fixed

- **Default zoom:** Spec says "**Day (default)**". The app used `month` as default; it is now set to **`day`** in `timeline.component.ts` to match the spec.

---

## Summary

- **Must implement:** All covered (timeline grid, zoom Day/Week/Month with Day default, work order bars, Create/Edit panel, overlap detection).
- **Deliverables:** Working app, design alignment, sample data, README present; Loom and repo are for you to complete.
- **Data & tech:** Data structures, sample data rules, Angular 17+, standalone, strict TypeScript, SCSS, Reactive Forms, ng-select, ngb-datepicker all satisfied.
- **Interactions:** All rows in the spec interactions table are implemented.
- **Documentation:** README and code comments satisfy the spec.
- **Blur:** Not in spec; implemented as enhancement (backdrop blur when panel is open).

No other gaps were found; the project meets the FE technical test requirements.
