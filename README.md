# Work Order Schedule Timeline

Single-page **Angular** app: work centers as rows, time on the horizontal axis, work orders as bars. Create, edit, and delete work orders; switch zoom (hour / day / week / month); scroll with **infinite column loading**; persist work orders and timeline UI in the browser.

| | |
|---|--|
| **Stack** | Angular 21, TypeScript, SCSS, Vitest |
| **Package name** | `naologic-timeline-app` (see `package.json`) |
| **Public repository** | [github.com/SDSURENVILDSA0207/work_order_schedule_timeline](https://github.com/SDSURENVILDSA0207/work_order_schedule_timeline) |

Your local folder name may differ (e.g. `naologic-timeline`); the Git remote should use the repository above.

---

## Setup and run

**Prerequisites:** Node.js **18+** and npm (project lists a `packageManager` in `package.json`).

```bash
git clone https://github.com/SDSURENVILDSA0207/work_order_schedule_timeline.git
cd work_order_schedule_timeline
npm install
```

**Development server** (Vite-based dev build with live reload):

```bash
npx ng serve
# or
npm start
```

Open [http://localhost:4200](http://localhost:4200). To use another port: `npx ng serve --port 4300`.

On first load, the app uses **sample** work centers and orders in `src/app/data/sample-data.ts` unless valid data is already in `localStorage` (see **Persistence** below).

**Explicit project name** (if you have multiple projects in a workspace):

```bash
npx ng serve naologic-timeline-app
```

**Production build**

```bash
npm run build
```

Output is under `dist/naologic-timeline-app/` (from `@angular/build:application` defaults).

**Unit tests** (Vitest via `ng test`)

```bash
npm test
```

---

## Tech stack: libraries and rationale

| Library | Role |
|--------|------|
| **Angular 21** | SPA: standalone components, signals, `inject()` DI, `@angular/build` (application builder). |
| **RxJS** | `fromEvent` for scroll and wheel; `debounceTime` for persisting scroll; streams in `TimelineViewStateService`. |
| **@angular/animations** | Transitions (e.g. work order panel) via `provideAnimations()`. |
| **Bootstrap 5** + **@ng-bootstrap/ng-bootstrap** | Datepicker; `NgbInputDatepicker` with a custom `NgbDateParserFormatter` for **MM.DD.YYYY** input. |
| **@ng-select/ng-select** | Status dropdown. |
| **TypeScript 5.9** | Strict typing for models and services. |
| **Vitest** + **jsdom** | Unit tests with `ng test`. |

**Styling:** SCSS; tokens in `src/styles.scss` and `DESIGN_TOKENS.md`.

---

## How the timeline and bar positioning work

1. **Visible time window** — `TimelineRange` is **half-open** `[start, end)`: `end` is the first instant *not* in the grid. That keeps day / week / month column counts consistent (no off-by-one at the right edge).

2. **Initial window per zoom** — `TimelineService.getInitialRange(zoom)` builds a symmetric window around “now” using `TIMELINE_CONFIG` in `src/app/timeline/timeline.config.ts`.

3. **Columns** — `getColumns` produces one `TimelineColumn` per step (hour, day, week, or month) between `start` and `end`. The header shows labels; bar placement uses the same `range` and **total content width** in pixels.

4. **Date ↔ pixel** — Within `[start, end)`, X is **linear in time** (milliseconds). `dateToPixel` / `timeToPixel` in `TimelineService` implement this.

5. **Work order bar width** — Stored dates are **inclusive** calendar days. The bar is drawn in time as **half-open** from start midnight to the first instant *after* the end date (`addDays(end, 1)` in `layoutWorkOrderBar` in `src/app/utils/timeline-bar-layout.util.ts`).

6. **Infinite scroll** — Scrolling near the left or right extends the range with `extendRangeStart` / `extendRangeEnd`. When prepending, `pendingPrependPx` adjusts `scrollLeft` so the view does not jump.

Key files: `TimelineViewStateService`, `TimelineService`, `timeline-bar-layout.util.ts`.

---

## Overlap detection (business rules)

- Only **work-center scope**: orders on different centers may share the same dates.
- Ranges are **inclusive** `[startDate, endDate]` as ISO `YYYY-MM-DD` in the **local** calendar, parsed with `parseDate` at local midnight.
- **Overlap** when `newStart <= existingEnd && newEnd >= existingStart`.
- `WorkOrderService.createOrder` / `updateOrder` call `hasOverlap` (editing passes `docId` to exclude the current order). The work-order panel shows the same error if validation fails.
- **Grid hit-testing** (whether a bar blocks “create” on a cell) uses **pixel** intervals in `cellIntersectsBarInset` in `timeline-spatial.utils.ts`—that is separate from date overlap.

---

## Persistence and defaults

- **Work orders** — `localStorage` key `work_order_timeline_work_orders`. If the key is missing or invalid, sample orders load. A stored **empty array** `[]` is valid and **does not** re-seed the sample.
- **Timeline UI** — Key `work_order_timeline_state` (see `TIMELINE_UI_STORAGE_KEY` in `timeline.config.ts`). Saves **zoom** and **scrollLeft** (debounced on scroll). On load, zoom is applied and the range is reset to `getInitialRange(zoom)` (the grid does not rehydrate a previously *extended* infinite-scroll range). Default **zoom** for a brand-new user is **month** in `TimelineViewStateService`.
- **Sample data** — Dates in `sample-data.ts` are chosen so the default view still shows bars without extreme horizontal scroll (see file header).

---

## Assumptions and tradeoffs

- **No backend** — In-memory + `localStorage`; replace with an API behind the same services if needed.
- **Locale** — Column labels and parsers are not fully i18n’d; `TimelineService` comments note `@upgrade` paths for i18n and larger grids.
- **Bundle size** — `ng build` may warn on initial bundle and component style budgets; safe to tune `angular.json` for production CI.

---

## Features (core and extras)

- **Core** — Multi-row grid, day/week/month zoom, work order bars and statuses, create/edit **panel**, delete, overlap checks, sample data, horizontal scroll.
- **Extras** — **Hour** zoom, **infinite** range extension, **persistence** (orders + UI), horizontal **wheel** mapping on the grid, **Escape** to close the panel, **focus-visible** on the timescale control, `OnPush` on key components.

---

## Project structure (main app)

```
src/
├── app/
│   ├── app.ts
│   ├── app.html
│   ├── app.config.ts
│   ├── components/
│   │   ├── timeline/
│   │   ├── work-order-bar/
│   │   ├── work-order-panel/
│   │   └── timescale-selector/
│   ├── services/           # work-order, timeline, timeline-view-state
│   ├── timeline/timeline.config.ts
│   ├── data/sample-data.ts
│   └── utils/
├── index.html
├── main.ts                 # entry — referenced in angular.json as "browser"
└── styles.scss
```

A `src/features/timeline/` tree may exist as an alternate layout; the app bootstrapped from `main.ts` uses `App` and `<app-timeline />` under `src/app/components/timeline/`.

`angular.json` names the app **`naologic-timeline-app`** and sets `index` + `browser` (`src/main.ts`) explicitly for the application builder.

---

## Documentation

| Document | Purpose |
|----------|--------|
| `DESIGN_TOKENS.md` | Colors, spacing, typography |
| [`docs/ai-prompts.md`](docs/ai-prompts.md) | Conventions, prompt themes, and file map for assistants |
| `AIPROMPTS.md` | Short pointer to `docs/ai-prompts.md` |
| `docs/REQUIREMENTS_*.md` | Optional checklists and audits (if present) |

---

## Troubleshooting

- **`Could not resolve .../src/main.ts`** — Run `ng serve` / `ng build` from the **repository root** (the directory that contains `angular.json`). Confirm `src/main.ts` exists: `ls src/main.ts`. Restore with `git checkout HEAD -- src/main.ts` if it was removed.
- **Empty grid on first open** — Clear site data for the origin or remove `work_order_timeline_work_orders` / `work_order_timeline_state` in DevTools to reload sample data and default scroll.
- **Push errors** — Ensure `origin` points at this repo, not a differently named remote: `git remote -v` should show `work_order_schedule_timeline`.

---

## License

Repository is **public** on GitHub for the take-home; content is for evaluation. Design references: `DESIGN_TOKENS.md`.
