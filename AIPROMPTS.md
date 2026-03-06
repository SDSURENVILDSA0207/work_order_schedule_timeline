# AI Prompts — Work Order Schedule Timeline

Use this file when working with an AI assistant on this codebase. It describes conventions, structure, key behaviors, and prompt ideas for common tasks.

---

## Project summary

- **What it is:** A single-page Work Order Schedule Timeline (Angular 21, standalone components). Work centers are rows; work orders are horizontal bars on a time axis. Users can create, edit, and delete work orders; zoom (hour/day/week/month); and scroll the timeline. **Infinite scroll** loads more date columns when scrolling left (prepend past) or right (append future). State (scroll, work orders) persists in `localStorage`.
- **Entry:** `main.ts` bootstraps `App` (`src/app/app.ts`), which renders `<app-timeline />` (`src/app/components/timeline/`).
- **State:** `WorkOrderService` (root) holds work centers + work orders; `TimelineService` handles date range (dynamic for infinite scroll), columns, zoom, and date↔pixel. Work orders are persisted; timeline scroll position is persisted; zoom defaults to day on load.

---

## Conventions

- **Angular:** Standalone components, signals for state, `inject()` for DI. Use `input()` / `output()` for component API.
- **Styles:** SCSS. Design tokens in `src/styles.scss` and **DESIGN_TOKENS.md**. Prefer existing tokens (e.g. `--color-*`, `--timeline-row-height`) over new magic numbers.
- **Models:** `src/app/models/work-order.model.ts` — `WorkCenterDocument`, `WorkOrderDocument`, `WorkOrderStatus`, `TimelineZoom`. Documents use `{ docId, docType, data }`.
- **Dates:** ISO date strings (`YYYY-MM-DD`). Use `src/app/utils/date.utils.ts` (`parseDate`, `toISODate`, `addDays`, `addMonths`) for calculations and bar positioning.

---

## Key files and responsibilities

| Area | Path | Responsibility |
|------|------|----------------|
| App shell | `src/app/app.ts`, `app.html` | Root component; renders `<app-timeline />`. |
| Timeline | `src/app/components/timeline/` | Grid, rows, columns; **click on a cell** opens create panel with that column’s date (`onCellClick(workCenterId, cellIndex)`). “Click to add” placeholder shows in **current day column** when row is hovered (`currentDayColumnIndex`); row gets `.placeholder-over-current` and z-index 25 so placeholder appears over current day indicator. Zoom selector, **infinite scroll**, today indicator. Placeholder: z-index 20; current period z-index 15; row hover z-index 5. |
| Work order bar | `src/app/components/work-order-bar/` | Single bar (name, status badge, ⋯ menu). Edit/Delete dropdown in body overlay. Emits `openChange`, `edit`, `delete`. Only one menu open at a time (timeline passes `forceCloseMenu`). |
| Work order panel | `src/app/components/work-order-panel/` | Create/Edit slide-in panel (form, validation, overlap check). Dates in **MM.DD.YYYY** (USA, dots) via `UsaDateParserFormatter`. **Tab** through form (name → status → start date → end date → Cancel → Save), **Escape** to close. **Smooth close**: slide-out right + backdrop fade, then emit closed. Prefill: `parseDate()` for end date (local); `isoToNgb()` uses first 10 chars of ISO. |
| Timescale selector | `src/app/components/timescale-selector/` | Hour / Day / Week / Month toggle. |
| Work order state | `src/app/services/work-order.service.ts` | Work centers (from sample data), work orders (signals). CRUD + overlap validation. Loads/saves work orders to `localStorage` (`work_order_timeline_work_orders`). |
| Timeline logic | `src/app/services/timeline.service.ts` | **Dynamic range** for infinite scroll: `getInitialRange(zoom)`, `extendRangeStart`, `extendRangeEnd`. Columns, column width, date↔pixel. |
| Sample data | `src/app/data/sample-data.ts` | Initial work centers and work orders (used when no persisted orders). |

---

## Behaviors to preserve

- **Overlap:** New/edit work orders must not overlap others on the same work center (start/end range). Enforced in `WorkOrderService.createOrder` and `updateOrder`.
- **Single edit/delete menu:** Opening one bar’s ⋯ menu closes any other (timeline tracks `openMenuBarId`, bars receive `forceCloseMenu`).
- **Default zoom on reload:** Always day; scroll position is restored from `localStorage`.
- **Smooth horizontal scroll:** No column snapping; pixel-based wheel handling in timeline for trackpad/mouse.
- **Bar vertical alignment:** Bars are vertically centered in the row (work-order-bar host uses flex + `align-items: center`).
- **Infinite scroll:** Range is dynamic (`rangeSignal`). When `scrollLeft < LOAD_MORE_THRESHOLD_PX` (600), prepend periods via `extendRangeStart` and apply `pendingPrependPx` so scroll position doesn’t jump. When near right edge, append via `extendRangeEnd`. Zoom change resets range to `getInitialRange(zoom)`. Constants: `LOAD_MORE_THRESHOLD_PX = 600`, `PREPEND_APPEND_PERIODS = 6` in `timeline.component.ts`.
- **Layering:** Row hover z-index 5; current day/week/month badge and line z-index 15; “Click to add dates” placeholder z-index 20. When placeholder is in current day column, row has `.placeholder-over-current` (z-index 25) so the placeholder appears over the current day indicator.
- **Create panel date from click:** Click is on the **cell** (`onCellClick(workCenterId, cellIndex)`). Start date comes from `columns()[cellIndex].date`; for month zoom use 1st of that month, otherwise use column date. Ensures the pre-filled date matches the block (e.g. Jun 2024 block → 1st June 2024).
- **Panel dates:** Display/parse **MM.DD.YYYY** (USA, dots). End date prefill uses `parseDate(startPrefill)` (local midnight), not `new Date(iso)` (UTC). `isoToNgb` parses only first 10 chars of ISO string.
- **Panel close:** Cancel/Escape/backdrop triggers `startClosing()`: sets `closing` signal, runs CSS transition (slide right + fade), then emits `closed` on `transitionend`.

---

## Persistence

- **Work orders:** Key `work_order_timeline_work_orders`. Saved after create/update/delete. Loaded once at service init; invalid/missing data falls back to sample work orders.
- **Timeline UI:** Key `work_order_timeline_state`. Only `scrollLeft` is restored; zoom is not (always day on load). Saved on debounced scroll.

---

## Testing and build

- `npm start` — dev server.
- `npm run build` — production build.
- `npm test` — unit tests (Vitest).
- Design reference: **DESIGN_TOKENS.md** (and any linked Sketch/design docs).

---

## Prompt ideas for common tasks

- **“Add a new status”** — Update `WorkOrderStatus` in `work-order.model.ts` and status styling (bar + badge) in work-order-bar and any filters/labels.
- **“Change default zoom”** — Set initial `zoom` signal in timeline component and/or adjust what gets restored from `work_order_timeline_state`.
- **“Persist work centers too”** — Extend `WorkOrderService` (and storage schema) to load/save work centers similar to work orders; keep validation in place.
- **“Fix overlap logic”** — Adjust `hasOverlap` / createOrder / updateOrder in `work-order.service.ts`; ensure date comparison uses `date.utils.ts`.
- **“Only one panel open”** — Already implemented via `openMenuBarId` and `forceCloseMenu`; extend similarly if adding more global overlays.
- **“Adjust infinite scroll”** — Change `LOAD_MORE_THRESHOLD_PX` or `PREPEND_APPEND_PERIODS` in `timeline.component.ts`; extend logic in `checkInfiniteScroll`. Initial window is set in `TimelineService.getInitialRange`.
- **“Tooltip/placeholder layering”** — Placeholder in current day column; row `.placeholder-over-current` z-index 25; `updatePlaceholderPosition()` fixed + z-index 20.
- **“Date doesn’t match block”** — Create panel is opened from `onCellClick(workCenterId, cellIndex)`; start date from `columns()[cellIndex].date`; month zoom uses 1st of month. Panel uses `UsaDateParserFormatter` (MM.DD.YYYY) and `parseDate()` for end prefill.
- **“Add keyboard shortcuts”** — Consider panel (Escape already closes), timeline focus, or bar navigation; preserve existing tab order in work-order-panel.
