# FE Technical Test – Requirements vs Implementation

Based on `FE-technical-test (2) (5).md`. Use this to verify coverage and for the Loom demo.

---

## 1. Core Requirements

| Requirement | Spec | Implemented | Notes |
|-------------|------|-------------|--------|
| **Timeline zoom levels** | Day (default), Week, Month | ✅ | Hour, Day, Week, Month in timescale dropdown. |
| **Timeline grid structure** | Left: Work Center (fixed). Right: scrollable grid | ✅ | `.timeline-left` fixed, `.timeline-grid-scroll` horizontal scroll. |
| **Current day indicator** | Vertical line for today | ✅ | Current hour/day/week/month badge + vertical line. |
| **Row hover** | Highlight row background | ✅ | `.timeline-row.hovered` with `rgba(238, 240, 255, 1)`. |
| **Work order bars** | Name + status badge + three-dot menu | ✅ | Bar name, status pill, Edit/Delete dropdown (body overlay). |
| **Status colors** | Open (blue), In Progress (blue/purple), Complete (green), Blocked (yellow/orange) | ✅ | Per-status bar and pill styling in app + constants. |
| **Bar positioning** | Start/end = work order start/end date | ✅ | `getBarPosition()` from timeline service; bars from dates. |
| **Overlap rule** | Same row cannot overlap; show error | ✅ | `WorkOrderService` overlap check; error in panel. |
| **Create panel** | Click empty timeline → slide-out from right | ✅ | Click empty cell opens create; start date from click. |
| **Edit panel** | Three-dot → Edit → same panel, pre-filled, Save | ✅ | Edit opens panel with order data; Save updates. |
| **Delete** | Three-dot → Delete → remove order | ✅ | Delete in dropdown; calls service + closes. |
| **Panel close** | Outside click, Cancel, Escape | ✅ | Backdrop click, Cancel button, `@HostListener('document:keydown.escape')`. |
| **Form validation** | Required fields; end date after start date | ✅ | Reactive Forms + `endDateAfterStartValidator`. |
| **Overlap on save** | Show error, don’t save | ✅ | `overlapError` signal; error message in panel. |

---

## 2. Create Panel Form (Spec)

| Field | Spec | Implemented |
|-------|------|-------------|
| Work Order Name | Text, required | ✅ |
| Status | ng-select, default "Open" | ✅ ng-select, default open |
| Start Date | ngb-datepicker, from click | ✅ Pre-filled from click position |
| End Date | ngb-datepicker, Start + 7 days | ✅ Pre-filled on create |

---

## 3. Technical Stack (Spec)

| Item | Spec | Implemented |
|------|------|-------------|
| Angular 17+ | Required | ✅ Angular 21 |
| Standalone components | Preferred | ✅ |
| TypeScript strict | Required | ✅ |
| SCSS | Required | ✅ |
| Reactive Forms (FormGroup, etc.) | Required | ✅ |
| ng-select | Required | ✅ Status dropdown |
| @ng-bootstrap/ng-bootstrap (ngb-datepicker) | Required | ✅ Start/End date |

---

## 4. Sample Data (Spec)

| Item | Spec | Implemented |
|------|------|-------------|
| ≥ 5 work centers | Required | ✅ 5 in `sample-data.ts` |
| ≥ 8 work orders | Required | ✅ 8+ orders |
| All 4 status types | Required | ✅ open, in-progress, complete, blocked |
| Multiple orders on same center (non-overlapping) | Required | ✅ e.g. Genesis, Rodriques, Konsulting |

---

## 5. Interactions Summary (Spec)

| Action | Result | Implemented |
|--------|--------|-------------|
| Click empty timeline | Open Create panel, start date from click | ✅ |
| Click three-dot on bar | Dropdown with Edit/Delete | ✅ |
| Click Edit | Open Edit panel with data | ✅ |
| Click Delete | Delete work order | ✅ |
| Click outside panel | Close panel | ✅ |
| Cancel | Close panel | ✅ |
| Create/Save | Validate, save, close | ✅ |
| Change Timescale | Update zoom | ✅ |
| Horizontal scroll | Scroll timeline, left fixed | ✅ |
| Hover row | Highlight row | ✅ |

---

## 6. Panel Backdrop & Blur (Not in spec)

- **Spec:** Does **not** mention blur or backdrop styling. It only says the panel “slides in from the right” and “clicking outside closes the panel”.
- **Current implementation:**  
  - Backdrop: `position: fixed; inset: 0`, `background: rgba(0, 0, 0, 0.3)`.  
  - **Blur:** `backdrop-filter: blur(8px)` and `-webkit-backdrop-filter: blur(8px)` on `.panel-backdrop` so the timeline behind the panel is blurred when Work Order Details is open.
- **Recommendation:** Keep the current blur (8px) and dimming as a UX enhancement. If you want it subtler, reduce to `blur(4px)`; if you want it stronger, use e.g. `blur(12px)`.

---

## 7. Deliverables (Spec)

| Deliverable | Status |
|-------------|--------|
| Working Angular 17+ app | ✅ |
| Pixel-perfect / design match | ✅ (per README + DESIGN_TOKENS) |
| Sample data | ✅ |
| Loom demo 5–10 min | For you to record |
| GitHub repo + README | ✅ (README present) |

---

## 8. Bonus (Optional) – Partial

| Feature | Status |
|---------|--------|
| localStorage persistence | ❌ Not implemented |
| Automated tests | ❌ (vitest in devDependencies; no test suite described) |
| Smooth animations | ✅ Panel slide-in, fadeIn backdrop, bar/row transitions |
| Keyboard (Escape) | ✅ Escape closes panel |
| “Today” button | ❌ Not implemented |
| Tooltip on bar hover | ❌ Not implemented |

---

**Summary:** All required features from the FE technical test are implemented. The Work Order Details panel uses a blurred backdrop (8px) by design choice; the spec does not define blur, so no change is required for compliance.
