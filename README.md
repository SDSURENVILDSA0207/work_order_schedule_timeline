# Work Order Schedule Timeline

A single-page Angular application for viewing and managing work orders on a timeline. Work centers are shown as rows; each work order appears as a horizontal bar between start and end dates. You can create, edit, and delete work orders, change the time scale (hour / day / week / month), and scroll the timeline. **Infinite scroll** loads more date columns as you scroll left or right. Data and scroll position persist in the browser.

---

## Features

- **Timeline view** — Work centers as rows, time as horizontal axis with columns for the selected zoom (hour, day, week, month).
- **Infinite scroll** — More date columns load dynamically when you scroll near the left edge (past dates) or right edge (future dates). The visible range grows as you scroll; zoom resets the range to a window around today.
- **Work order bars** — Name and status (Open, In Progress, Complete, Blocked) with distinct colors; bars are vertically centered in each row.
- **Create** — Click a cell (or the “click to add dates” placeholder) on a row to open the create panel; the start date is taken from the column you clicked (e.g. Jun 2024 block → 1st June 2024). Form order: name → status → start date → end date. Dates display as **MM.DD.YYYY** (USA, dots). Overlap on the same work center is prevented. The placeholder appears over the current day column when you hover a row and sits above the current day indicator.
- **Edit / Delete** — Use the ⋯ menu on a bar to edit or delete; only one such menu is open at a time.
- **Work order panel** — Tab through the form (name → status → start date → end date → Cancel → Save). Escape closes the panel. Closing uses a smooth slide-out (left to right) and backdrop fade.
- **Zoom** — Switch between hour, day, week, and month. Default on load is **day**.
- **Scroll** — Horizontal scroll is smooth (pixel-based). Scroll position is restored after refresh.
- **Persistence** — Work orders are stored in `localStorage` and restored on refresh. Timeline scroll position is also saved and restored.

---

## Tech stack

- **Angular 21** (standalone components, signals)
- **SCSS** for styling; design tokens in `src/styles.scss` and `DESIGN_TOKENS.md`
- **RxJS** for events (scroll, wheel)
- **Bootstrap** and **ng-bootstrap** (as referenced in `angular.json`)

---

## Getting started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+)

### Install and run

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200). The app loads with sample work centers and work orders (or your previously saved work orders from `localStorage`).

### Build

```bash
npm run build
```

Production artifacts are in `dist/`.

### Tests

```bash
npm test
```

---

## Project structure (main app)

```
src/
├── app/
│   ├── app.ts              # Root component (renders <app-timeline />)
│   ├── app.html
│   ├── app.config.ts       # Providers (animations, NgbModule)
│   ├── components/
│   │   ├── timeline/       # Grid, rows, columns, cell click → create (date = block), zoom
│   │   ├── work-order-bar/ # Single work order bar + ⋯ menu (Edit/Delete)
│   │   ├── work-order-panel/ # Create/Edit slide-in panel
│   │   └── timescale-selector/ # Hour / Day / Week / Month
│   ├── services/
│   │   ├── work-order.service.ts  # Work centers + work orders, CRUD, persistence
│   │   └── timeline.service.ts    # Dynamic range (infinite scroll), columns, zoom, date↔pixel
│   ├── models/
│   │   └── work-order.model.ts    # WorkCenterDocument, WorkOrderDocument, etc.
│   ├── data/
│   │   └── sample-data.ts         # Initial work centers and work orders
│   └── utils/
│       └── date.utils.ts          # parseDate, toISODate, addDays, addMonths
├── styles.scss             # Global styles and design tokens
└── main.ts                 # Bootstrap App
```

There is also a `src/features/timeline/` tree (timeline-page, schedule-sidebar, timeline-grid, etc.) used by an alternative page composition; the default entry point uses `src/app` and `<app-timeline />` as above.

---

## Design and tokens

See **DESIGN_TOKENS.md** for colors, typography, layout (row height, panel width, etc.), and spacing. Prefer these tokens when changing styles.

## AI-assisted development

See **AIPROMPTS.md** for conventions, key files, behaviors to preserve, and prompt ideas when working with an AI assistant on this codebase.

---

## Data and persistence

- **Work centers** — Loaded from `src/app/data/sample-data.ts` (not persisted).
- **Work orders** — Stored in `localStorage` under `work_order_timeline_work_orders`. Any create, edit, or delete updates this. On load, the app uses saved data if valid; otherwise it falls back to sample work orders.
- **Timeline UI** — Scroll position is stored in `work_order_timeline_state`. Zoom is not restored; it always defaults to **day** on reload. The timeline uses a **dynamic date range** (infinite scroll); the range is extended when scrolling near the left or right edge.

---

## License and attribution

Private / take-home project. Design tokens and layout follow the references cited in `DESIGN_TOKENS.md`.
