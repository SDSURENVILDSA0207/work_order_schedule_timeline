# Work Order Schedule Timeline

Angular application for managing work orders on a visual timeline. Built for the Naologic Frontend Technical Test.

## Features

- **Timeline grid** – Hour / Day / Week / Month zoom, scrollable grid, fixed work-center column, current period indicator
- **Work order bars** – Name, status badge, three-dot menu (Edit/Delete); position and length driven by start/end dates
- **Create/Edit panel** – Slide-out form (591×1024px) with Work Order Name, Status (ng-select), End date, Start date
- **Status dropdown** – Styled options; selected option in primary blue; non-selected Open/In progress/Complete use default grey; Blocked uses darker default; custom box-shadow and border-radius
- **Overlap detection** – Prevents overlapping orders on the same work center
- **Click to create** – Click empty timeline area to open create panel with date from click; Escape and backdrop close

## Prerequisites

- **Node.js** 18+ and **npm** (or use the project’s `packageManager`)

## Quick start

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm start`    | Run dev server             |
| `npm run build`| Production build           |
| `npm run test` | Run unit tests             |

## Tech stack

- **Angular** 21 (standalone components)
- **@ng-select/ng-select** – Status dropdown
- **@ng-bootstrap/ng-bootstrap** – Date picker
- **SCSS** – Styles and design tokens in `src/styles.scss`

## Project structure

```
src/
├── app/                    # App shell, timeline, work-order-panel
├── core/                   # Models, services, constants
├── features/timeline/      # Timeline page, grid, bars, header, work-order-panel
├── shared/                 # Shared utilities (e.g. date utils)
├── styles.scss             # Global tokens and reset
└── index.html
```

## Documentation

- **Implementation guide** – Step-by-step plan and architecture: see **Implementation guide** section below (or `README-IMPLEMENTATION.md` if split).
- **AI prompts log** – All prompts used during development: **AIPROMPTS.md**.

---

## Implementation guide (summary)

### Setup and tooling

- Angular 17+ with strict TypeScript, SCSS, standalone components.
- Libraries: `@ng-bootstrap/ng-bootstrap`, `@ng-select/ng-select`.
- Global styles and Circular Std font in `index.html` and `styles.scss`.

### Architecture

- **App**: Header (logo) + timeline page.
- **Timeline**: Schedule header (title, timescale dropdown), work-center list, scrollable grid, work order bars, create/edit slide-out panel.
- **Data**: `WorkOrderDataService` – work centers and work orders; CRUD for work orders; overlap validation.

### Status dropdown (Work Order Details panel)

- **Selected value**: Pill per status (open, in-progress, complete, blocked).
- **Dropdown list**: Tighter option spacing; custom box-shadow and border-radius; no default background highlight on selected option.
- **Colors**: Selected option → primary blue; non-selected Open/In progress/Complete → `rgba(47, 48, 89, 1)`; non-selected Blocked → `rgba(3, 9, 41, 1)`.

### Key behaviours

- Bar position/length from `dateToPixel(startDate)` and `dateToPixel(addDays(endDate, 1))`; min bar width 24px.
- Create: start date from click position, end date = start + 7 days.
- Overlap: same work center, overlapping date ranges block create/update and show error in panel.

For the full step-by-step plan, data model, and testing strategy, see the long-form implementation guide previously maintained in this README or in separate docs.
