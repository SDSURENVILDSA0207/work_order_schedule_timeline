# Work Order Schedule Timeline

Single-page **Angular** app: work centers as rows, time on the horizontal axis, work orders as bars. Create, edit, and delete work orders; switch zoom (hour / day / week / month); scroll with **infinite column loading**; persist work orders and timeline UI in the browser.

---

## Setup and run

**Prerequisites:** Node.js **18+** and npm (project pins `packageManager` in `package.json`).

```bash
npm install
```

**Development server** (Vite-based dev build with live reload):

```bash
npx ng serve
# or
npm start
```

Open [http://localhost:4200](http://localhost:4200). By default, first load uses the **sample** work centers/orders in `src/app/data/sample-data.ts` (unless valid data already exists in `localStorage`).

**Production build**

```bash
npm run build
```

Output: `dist/naologic-timeline-app/`.

**Unit tests** (Vitest)

```bash
npm test
```

---

## Tech stack: libraries and rationale

| Library | Role |
|--------|------|
| **Angular 21** | SPA framework: standalone components, signals, `inject()` DI, zoneless-friendly patterns, `@angular/build` (application builder). |
| **RxJS** | `fromEvent` for scroll / wheel on the grid; `debounceTime` for persisting scroll; small, explicit streams in `TimelineViewStateService`. |
| **@angular/animations** | Transitions (e.g. work order panel) via `provideAnimations()`. |
| **Bootstrap 5** + **@ng-bootstrap/ng-bootstrap** | Datepicker and shared styling primitives; `NgbInputDatepicker` with a custom `NgbDateParserFormatter` for **MM.DD.YYYY** input. |
| **@ng-select/ng-select** | Status dropdown: searchable, keyboard-friendly, fits form UX. |
| **TypeScript 5.9** | Strict types for documents, zoom levels, and services. |
| **Vitest** + **jsdom** | Fast unit tests via `ng test`. |

**Styling:** SCSS; project tokens in `src/styles.scss` and `DESIGN_TOKENS.md`.

---

## How the timeline and bar positioning work

1. **Visible time window** — `TimelineRange` is **half-open** `[start, end)`: `end` is the first instant *not* in the grid. That matches column generation and keeps **day / week / month** column counts consistent (no off-by-one at the right edge).

2. **Initial window per zoom** — `TimelineService.getInitialRange(zoom)` builds a symmetric window around “now” using `TIMELINE_CONFIG` (radii in `src/app/timeline/timeline.config.ts`).

3. **Columns** — `getColumns` produces one `TimelineColumn` per step (hour, day, week, or month) between `start` and `end`. Labels are for the header; bar math uses the same `range` and **total content width** in pixels.

4. **Date ↔ pixel** — Within `[start, end)`, X position is **linear in time** (milliseconds). So within a month column, horizontal position still reflects *calendar progress* through that month if the service maps the instant correctly (`dateToPixel` / `timeToPixel`).

5. **Work order bar width** — Order dates are **inclusive calendar days** in the domain model. The bar is drawn in pixel space as **half-open in time** from `start` midnight to the instant **after** the end date (`addDays(end, 1)` in `layoutWorkOrderBar`), so the right edge lines up with the end of the last day without overlapping the next day’s column.

6. **Infinite scroll** — When the user scrolls near the left or right edge, the range is extended with `extendRangeStart` / `extendRangeEnd`; a **pixel offset** (`pendingPrependPx`) corrects `scrollLeft` so content does not jump when prepending columns.

For implementation details, see `TimelineViewStateService`, `TimelineService`, and `src/app/utils/timeline-bar-layout.util.ts`.

---

## Overlap detection (business rules)

- Overlap is evaluated **per work center** only (orders on different centers may share dates).
- Each order is an **inclusive** `[startDate, endDate]` range of **local calendar** ISO strings (`YYYY-MM-DD`).
- Two ranges overlap if  
  `newStart <= existingEnd && newEnd >= existingStart`  
  (standard interval intersection, after parsing with `parseDate` at local midnight).
- On **create** and **update**, `WorkOrderService` calls `hasOverlap` (the edited order is excluded by `docId` on update). The panel surfaces the same message if validation fails.
- **Spatial “overlap”** on the grid (whether a cell is considered “under” a bar for click-to-create) is separate: `cellIntersectsBarInset` in `timeline-spatial.utils.ts` uses **pixel** intervals with a small edge inset for hit-testing.

---

## Assumptions and tradeoffs

- **No backend** — All state is in-memory plus `localStorage` (suitable for a take-home; swap for an API with the same service boundaries).
- **Locale** — Date math and labels assume **local** calendar and en-US style where hard-coded; i18n would route column labels and parsers through Angular i18n.
- **First visit vs. returning user** — Default **zoom** in code is **month**; if `work_order_timeline_state` exists, **zoom and scroll** are restored and the range is re-initialized to `getInitialRange(savedZoom)` (extended range from a prior session is not restored).
- **Work orders in storage** — If `work_order_timeline_work_orders` is present and valid (including an empty `[]`), sample seed data is **not** applied; clearing storage resets to sample data. Sample dates are chosen so the default view shows bars without extreme scrolling (see comment in `sample-data.ts`).
- **Performance** — Column count can grow with scroll; a production app might virtualize rows/columns at very large radii. Leaf components use `OnPush` where safe.

---

## Features (including extras)

- **Core:** Grid, work order bars, status styling, create/edit **drawer** panel, delete, zoom day/week/month, horizontal scroll, overlap validation, sample data.
- **Bonus / polish:** **Hour** zoom; **infinite** horizontal loading; **persistence** of work orders and timeline UI; **trackpad/mouse** horizontal wheel mapped to `scrollLeft`; **keyboard** (e.g. Escape closes panel, tab order in form); **focus-visible** styling on the timescale control; `ChangeDetectionStrategy.OnPush` on key presentational components.

---

## Project structure (entry path)

```
src/
├── app/
│   ├── app.ts                    # Root — renders <app-timeline />
│   ├── components/
│   │   ├── timeline/             # Grid, scroll, zoom, create from cell
│   │   ├── work-order-bar/       # Bar + ⋯ menu
│   │   ├── work-order-panel/     # Create / edit form
│   │   └── timescale-selector/   # Hour / day / week / month
│   ├── services/
│   │   ├── work-order.service.ts
│   │   ├── timeline.service.ts
│   │   └── timeline-view-state.service.ts
│   ├── timeline/timeline.config.ts
│   ├── data/sample-data.ts
│   └── utils/                    # date, bar layout, spatial hit-testing, Ngb↔ISO
├── styles.scss
└── main.ts
```

A parallel `src/features/timeline/` tree may exist for alternate composition; the built app uses `App` + `app-timeline` as above.

---

## Documentation

- **Design tokens:** `DESIGN_TOKENS.md`
- **AI / assistant context** (conventions, key files, example prompts): [`docs/ai-prompts.md`](docs/ai-prompts.md)

---

## License

Private / technical assessment. Design references: see `DESIGN_TOKENS.md`.
