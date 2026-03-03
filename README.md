# Work Order Schedule Timeline – Implementation Guide

This document describes **how this project is implemented** and the **step-by-step plan** used, based on the Naologic **Work Order Schedule Timeline – Frontend Technical Test** requirements.

Goals:

- Understand the planned and current architecture
- Follow a clear sequence of implementation steps
- Map Loom demo sections and git commits to concrete milestones

For the original problem statement, see the provided `FE-technical-test...md` file in the repository.

All AI prompts used during development are logged in `AIPROMPTS.md`.

---

## Implementation Status & Recent Changes

The following are **implemented** and aligned with the spec and design:

- **Timeline grid** – **Hour**/Day/Week/Month zoom, scrollable grid, fixed left work-center column, current hour/day/week/month indicator, and a light year/month background tint (`rgba(247, 249, 252, 1)`) that extends down to the bottom of the timeline card.
- **Work order bars** – Name, **status badge (pill/tag)**, three-dot menu (Edit/Delete); bar position from start/end dates. Bars and pills are styled per status to match the reference design:
  - **Open**: bar ~381×38px with soft blue background and outline; pill 87×22px (radius 5), light aqua background, teal/blue text.
  - **In progress**: bar 381×38px with periwinkle background and outline; pill 87×22px (radius 5), solid light purple background, blue text.
  - **Complete**: bar 381×38px with pale green background and outline; pill 87×22px (radius 5), light green background, green text.
  - **Blocked**: bar 533×38px with cream background and outline; pill 87×22px (radius 5), light peach background, orange text.
- **Create/Edit panel (pixel-perfect)** – Single slide-out panel **591×1024px**, border-radius 12px 0 0 12px, three box-shadows. **Header:** "Work Order Details" (20px Medium #2F3059), subtitle "Specify the dates, name and status for this order" (16px Book); **Cancel** and **Create/Save** in header top-right (66×32px, 7px radius, exact shadows). **Separator** line below subtitle (1px solid rgba(230,235,240)); 24px spacing to first field. Reactive Forms: Work Order Name, Status (ng-select), **End date** then **Start date** (order and labels). Create: start date from **click position**, end date **start + 7 days**. Cancel/backdrop/**Escape** close; end-date validator.
- **Status dropdown** – **Selected value** in field: styled pill per status (open: teal bg + border; in progress/complete/blocked: status backgrounds). **Dropdown list** when open: plain text, status-specific colors (open blue, in progress/complete dark grey, blocked very dark). **No clear (X) button** (`clearable: false`).
- **Date fields** – **End date** first, **Start date** second. Labels "End date"/"Start date" (542×16, rgba(104,113,150), 14px 500). Inputs **Rectangle 7**: 542×38px, border-radius 5px, three box-shadows, white bg; **no calendar icon**; display/parse **dd.MM.yyyy** with "." separator (e.g. 01.01.2026). Section size 542×62px per date block.
- **Overlap detection** – Create/update validate no overlap on same work center; error in panel; create/update blocked when overlapping.
- **Cell-based highlight** – Hover highlights only the **cell (time column)** under the pointer; left panel row labels highlight by row.
- **Interactions** – Click empty timeline opens create with date from click; three-dot Edit/Delete; panel close on outside click, Cancel, Escape, or save.

**How to run:** `npm install` then `ng serve`. See section 1 for setup details.

**AI prompts:** All prompts used during implementation are logged in `AIPROMPTS.md` (Prompts 1–34), including pixel-perfect panel, separator, status/date styling, timescale control, work order bar/pill styling, background tint, current-indicator behaviour, and documentation updates.

---

## 1. Project Setup & Tooling

1. **Create Angular workspace**
   - Initialize an Angular 17+ application with strict TypeScript and SCSS as the default stylesheet format.
   - Use **standalone components** (no `NgModule`-based bootstrapping).

2. **Configure base project settings**
   - Set up strict TypeScript options if not already enabled.
   - Ensure path aliases (if any) are clean and minimal, e.g. `@shared`, `@core`, `@features`.

3. **Install required libraries**
   - `@ng-bootstrap/ng-bootstrap` – for `ngb-datepicker`.
   - `@ng-select/ng-select` – for status dropdowns.
   - Any optional utility libraries for date handling if desired (or use the Angular/JS `Date` APIs).

4. **Global styles & fonts**
   - Import the Circular Std font using the link from the spec into the global `index.html`.
   - Set base typography and CSS variables (colors, spacing scale, z-indexes) in `styles.scss`.
   - Configure a simple CSS reset / normalization and box-sizing rules.

5. **Git & project hygiene**
   - Ensure `.gitignore` is correct for Angular projects.
   - Make an initial commit: “chore: bootstrap Angular workspace”.

---

## 2. High-Level Architecture

### 2.1 App shell and global header

- **App root** (`app.component` / `App`): Renders the global layout (header + timeline page). The main implementation uses the standalone `TimelineComponent`, bootstrapped via `app.html`.
- **App header**: Top bar matching design spec:
  - **Header rectangle**: Full width (max-width 1440px), height 50px, background `#FFFFFF`, no border, no padding, `box-sizing: border-box`.
  - **NAOLOGIC logo**: Position `101px` from left, `20px` from top; size `80px × 10px`; opacity 100%. Asset: `assets/Group 3@10x.png` with `object-fit: contain` to preserve aspect ratio.

### 2.2 Schedule header and "Work Orders" title

- **Schedule header** (`schedule-header` component): Left sidebar top section; padding places the title at design coordinates.
- **"Work Orders" title** (H3 – 24 Style):
  - **Position**: `101px` from left, `95px` from viewport top (header padding: left `101px`, top `45px` below the 50px app header).
  - **Size**: `142px × 34px`; `box-sizing: border-box`; no border, no padding.
  - **Typography**: Circular Std Medium (500), 24px, line-height 34px, color `#030929` (rgba(3, 9, 41, 1)), opacity 100%, text align left, vertical align top.
  - **Font**: Circular Std loaded from `naologic-com-assets.naologic.com` (see `index.html`).

### 2.3 Timescale dropdown

- **Position**: Control at `101px` from left, `155px` from viewport top (same header padding; row margin places it 26px below the "Work Orders" title).
- **Two segments** (Nao Design System – Modal Dropdown / Form Grid):
  - **Timescale label**: `75px × 25px`; `border-radius: 5px 0 0 5px`; `background-color: rgba(241, 243, 248, 0.75)` (#F1F3F8 75%); box-sizing border-box; no padding; opacity 100%.
  - **Month dropdown**: `71px × 25px`; `border-radius: 0 5px 5px 0`; same background; box-sizing border-box; no padding; opacity 100%. Visually one rounded control; dropdown shows "Month" and chevron (functional ng-select can be wired later).

### 2.4 Work Center list (left column)

- **Sidebar width**: `482px` (102 + 380) so the list and rows fit the design.
- **"Work Center" label**: Position `133px` from left, `213px` from viewport top (list padding-top 33px from header bottom; label margin-left 31px from list padding 102px). Size `138px × 16px`; color `#687196` (rgba(104, 113, 150, 1)); font Circular Std Regular, 14px, weight 500, line-height 17px; no border/padding; opacity 100%.
- **Row rectangle**: Each list row `380px × 60px`; position starts at `102px` from left, first row at `238px` from viewport top; background `#FFFFFF` 100%; no border/padding; box-sizing border-box. Sample names: Genesis Hardware, Rodriques Electrics, Konsulting Inc, McMarrow Distribution, Spartan Manufacturing.

### 2.5 Timeline axis

- **Position**: Axis row at `213px` from viewport top (grid `padding-top: 163px` so first row aligns with Work Center label). First month (Aug 2024) at `497px` from viewport left = `15px` from timeline grid left (grid starts after 482px sidebar).
- **Month labels**: Each label `86px × 16px`; color `#687196` (rgba(104, 113, 150, 1)); font Circular Std Regular, 14px, weight 500, line-height 17px; text-align center; no border/padding; opacity 100%. Column step `114px` (Sep at 611, so 611 − 497 = 114). Labels: Aug 2024, Sep 2024, Oct 2024, Nov 2024, Dec 2024, Jan 2025, Feb 2025, Mar 2025.

### 2.6 Current month indicator (vertical line + label)

- **Position**: Line at `596px` from viewport left = `114px` from timeline grid left; label at `603px`, `239px` from viewport (grid `position: relative`; indicator `position: absolute` at `left: 114px`, `top: 188px` = 238 − 50).
- **Vertical line**: `2px` wide, `747px` tall (Group 5 height), `background-color: rgba(62, 64, 219, 1)` (Nao primary shade 2).
- **Label**: `93px × 18px`; color `rgba(62, 64, 219, 1)`; font Circular Std Book, 14px, weight 400, line-height 17px; no border/padding; opacity 100%; content "Current month"; alignment left/top.

### 2.7 Scrollable grid, work order bars, three-dot menu

- **Scrollable grid**: One row per work center (60px height); rows from `WorkOrderDataService.getWorkCenters()`; `.timeline-rows` min-width 950px for horizontal scroll; row hover background.
- **Work order bars**: One bar per order; position from dates (axis offset 15px, PX_PER_DAY from 114px column step). Bar: min-width 120px, height 38px; `border-radius: 8px`; `background-color: #FFFCF1`; `box-shadow: 0 0 0 1px #FFF5CF` (Rectangle 2 spec). Content: name, status badge, three-dot trigger.
- **Status badges**: Complete `#08A268`, In progress / Open `#3E40DB`, Blocked `#B13600`; Circular Std Book 14px, line-height 17px (`STATUS_COLORS` in `timeline.constants`).
- **Three-dot menu**: Trigger on bar; dropdown with Edit and Delete; document click closes; outputs `edit` and `delete` for wiring to panel later.
- **Sample data**: Five work centers, five work orders (all statuses, multiple orders on one center) in `WorkOrderDataService`.

### 2.8 Empty row "Click to add dates" pill and slide-out panel

- **Empty row pill**: Each timeline row shows a centered pill with "Click to add dates" (113×38 px; `border: 1px solid #C3C7FF`; `border-radius: 8px`; `background-color: rgba(101, 112, 255, 0.1)`; design ref 675×303). Pill is non-interactive (`pointer-events: none` on the empty overlay); click-to-create will be wired on the row or grid.
- **Right slide-out panel**: `work-order-panel` fixed right (849 from left in design = right edge); `591px` width, `100vh` height (min 1024px); `border-radius: 12px 0 0 12px`; `background: #FFFFFF`; NDS shadows: `0 5px 15px 0 rgba(216, 220, 235, 1)`, `0 2.5px 3px -1.5px rgba(200, 207, 233, 1)`, `0 4.5px 5px -1px rgba(216, 220, 235, 1)`. Panel hosts "Work Order Details" heading and `work-order-form`; open/close state can be wired to create/edit actions.

### 2.9 Work order form fields (panel)

- **Labels**: "Work Order Name", "Status", "Start Date", "End Date" – 542/543×16 px; color `#687196`; Circular Std Regular, 14px, weight 500, line-height 17px (874×107, 873×193 spec).
- **Status dropdown**: Wrapper 543×38; `border-radius: 5px`; `box-shadow: 0 0 0 2px rgba(170, 175, 255, 1)` (Rectangle 7 at 217Y); options styled with `#F1F3F8` (Open, In progress, Complete, Blocked).
- **Text/date inputs**: 543×38; `border-radius: 5px`; `box-shadow: 0 0 0 1px rgba(216, 220, 235, 1), 0 1.5px 3px -1.5px rgba(200, 207, 233, 1), 0 1px 0.5px -1px rgba(216, 220, 235, 1)` (Rectangle 7 at 389Y); focus uses 2px primary border. Native `<select>` and `<input>` for now; ng-select and ngb-datepicker can be wired when adding Reactive Forms.

### 2.10 Pixel-perfect UI alignment (image + design data)

- **Global**: Circular Std as default font; body text color `rgba(3, 9, 41, 1)` (dark grey).
- **Timeline grid**: Light grey vertical grid lines every 114px (match axis columns); white background.
- **Sidebar**: Subtle right shadow for separation from main content.
- **Work order bars**: Status-based light tint backgrounds and borders (green complete, purple in-progress/open, orange blocked) per reference image.
- **Empty row**: "Click to add dates" pill with CSS tooltip on hover (dark grey bg, white text, arrow); row clickable (pointer-events, cursor).
- **Timescale**: Dropdown with Hour, Day, Week, Month; open state with light grey option highlight.
- **Panel**: Hidden by default (`panelOpen = false`) so initial view matches design image; wire to create/edit to open.

The app will be structured into a few focused areas:

- **Core / shared types and utilities**
  - TypeScript interfaces for `WorkCenterDocument`, `WorkOrderDocument`, and `WorkOrderStatus`.
  - Date utility helpers for converting between dates, pixels, and zoom levels.

- **Data layer**
  - A simple **data service** responsible for:
    - Holding in-memory arrays of work centers and work orders.
    - Exposing CRUD operations (create/update/delete) for work orders.
    - Optionally persisting to `localStorage` (bonus).

- **Timeline feature**
  - A main `TimelinePage` (or `TimelineComponent`) that:
    - Renders the toolbar (title + timescale dropdown).
    - Renders the split layout: fixed left work-center column + scrollable timeline grid.
    - Coordinates the slide-out create/edit panel.

- **Timeline subcomponents**
  - **Header** (date/week/month labels + current day indicator).
  - **Rows** for each work center, with hover states.
  - **Work order bars** rendered in each row.
  - **Three-dot actions menu** (edit/delete).
  - **Create/Edit slide-out panel** built with Reactive Forms.

---

## 3. Data Modeling & Sample Data

1. **Define domain types**
   - Implement TypeScript interfaces matching the problem statement:
     - `WorkCenterDocument` with `docId`, `docType: 'workCenter'`, and `data.name`.
     - `WorkOrderDocument` with `docId`, `docType: 'workOrder'`, and `data` containing:
       `name`, `workCenterId`, `status`, `startDate`, `endDate`.
     - `WorkOrderStatus` union type: `'open' | 'in-progress' | 'complete' | 'blocked'`.

2. **Create hardcoded sample data**
   - At least **5 work centers** with realistic names:
     - e.g. “Extrusion Line A”, “CNC Machine 1”, “Assembly Station”, “Quality Control”, “Packaging Line”.
   - At least **8 work orders**:
     - Spread across different work centers.
     - Include all four statuses.
     - Ensure at least one work center has multiple **non-overlapping** orders.
     - Vary `startDate` / `endDate` so some span short windows and others are longer-range.

3. **Data service**
   - Create a simple service that:
     - Exposes `getWorkCenters()` and `getWorkOrders()` as observables or signals.
     - Provides `createWorkOrder`, `updateWorkOrder`, and `deleteWorkOrder` methods.
   - (Bonus) If implementing `localStorage`:
     - On initialization, load data from `localStorage` if present; otherwise, use hardcoded defaults.
     - Persist changes whenever work orders are modified.

4. **Wire data into the main timeline**
   - Inject the data service into the main timeline page.
   - Subscribe/access the data to render the initial static timeline (no interactions yet).

---

## 4. Timeline Layout & Zoom Levels

1. **Base layout**
   - Create a layout with two main columns:
     - **Left panel:** fixed-width column listing work center names.
     - **Right panel:** horizontally scrollable timeline grid.
   - Use CSS (e.g. `display: grid` or `flex`) to ensure the left panel remains fixed while the timeline scrolls horizontally.

2. **Timescale controls**
   - Add a toolbar at the top with:
     - Page title (“Work Orders” or as per design).
     - **Timescale dropdown** with options: Day (default), Week, Month.
   - Maintain the current timescale in component state.

3. **Visible date range**
   - For each zoom level, define a default visible window centered on **today**:
     - Day: e.g. today ± 14 days.
     - Week: e.g. today’s week ± 2 months.
     - Month: e.g. today’s month ± 6 months.
   - Implement helpers to compute:
     - A list of header “buckets” (days, weeks, months) for the visible range.
     - The pixel width of each bucket, per zoom level.

4. **Header rendering**
   - Render the timeline header row according to the active zoom:
     - **Day view:** one column per day with date labels.
     - **Week view:** one column per week (e.g. “W12”, “Mar 3–9”).
     - **Month view:** one column per month (e.g. “Mar 2026”).
   - Add a **current day indicator**:
     - Calculate today’s x-position relative to the visible range.
     - Render a vertical line crossing all rows at that x-position.

5. **Scrolling behavior**
   - Enable horizontal scrolling for the timeline grid only.
   - Keep the initial scroll position so that today is roughly centered in the view.
   - (Bonus) Consider infinite scroll later (prepend/append extra buckets as the user scrolls).

---

## 5. Work Order Bar Positioning & Styling

1. **Date-to-pixel calculations**
   - Implement functions to:
     - Convert a work order’s `startDate` and `endDate` to positions within the visible range.
     - Calculate:
       - `left` offset in pixels from the start of the visible range.
       - `width` in pixels corresponding to the order duration.
   - Ensure calculations adapt when the timescale (Day/Week/Month) changes.

2. **Rendering bars**
   - For each work center row:
     - Filter work orders by `workCenterId`.
     - For each order, compute its `left` and `width` based on the active zoom and visible range.
     - Render a **horizontal bar** positioned absolutely within the row.

3. **Status appearance**
   - Map statuses to colors from the design:
     - `open`: blue.
     - `in-progress`: blue/purple.
     - `complete`: green.
     - `blocked`: yellow/orange.
   - Inside each bar, render:
     - Work order name.
     - Status badge (pill/tag style).
     - Three-dot actions icon on the right.

4. **Hover and focus states**
   - Add row hover background highlights matching the design.
   - Add bar hover/focus styles (e.g., subtle shadow or brightness adjustment).

5. **Responsiveness**
   - Ensure that on smaller screens:
     - The layout still works (timeline may require more horizontal scroll).
     - Typography scales appropriately.

---

## 6. Create & Edit Slide-Out Panel

1. **Panel container**
   - Implement a slide-out panel that:
     - Anchors to the right side of the viewport.
     - Has fixed width as per design.
     - Shows an overlay/backdrop over the main content.
   - Configure it to open/close with a simple state flag.

2. **Reactive Form setup**
   - Define a `FormGroup` with controls:
     - `name` (work order name) – required.
     - `status` (`ng-select`) – default value “Open”.
     - `startDate` (`ngb-datepicker`) – required.
     - `endDate` (`ngb-datepicker`) – required.
   - Implement validators:
     - All fields required.
     - `endDate` must be strictly after `startDate`.

3. **Create mode behavior**
   - Opening flow:
     - Triggered when user clicks **empty timeline area** in a row.
     - Pre-fill `startDate` from click position’s date.
     - Pre-fill `endDate` as `startDate + 7 days`.
     - Set mode to `'create'`.
   - UI:
     - Header text “Work Order Details” (or per design).
     - Primary button text “Create”.

4. **Edit mode behavior**
   - Opening flow:
     - Triggered from the three-dot menu > “Edit” on a work order bar.
     - Populate form with existing work order data.
     - Set mode to `'edit'`.
   - UI:
     - Same header text.
     - Primary button text “Save”.

5. **Closing behavior**
   - Close when:
     - Clicking the backdrop outside the panel.
     - Clicking a **Cancel** button.
     - Successfully creating/saving a valid work order.

---

## 7. Overlap Detection & Validation Rules

1. **Basic form validation**
   - Ensure standard validators are wired:
     - Required for all fields.
     - Custom validator enforcing `endDate > startDate`.

2. **Overlap detection algorithm**
   - When user attempts to **create** a new order:
     - Convert `startDate` and `endDate` to a comparable range (e.g. JS `Date` or day indices).
     - Find all existing work orders with the same `workCenterId`.
     - Check for any interval overlap where:
       - New `[start, end]` intersects existing `[start, end]`.
   - When **editing** an existing order:
     - Apply the same logic but ignore the order being edited.

3. **User feedback**
   - If an overlap is detected:
     - Prevent creation/save.
     - Show a clear error message in the panel.
     - Optionally highlight the conflicting order(s) on the timeline.

4. **Integration with form state**
   - Surface overlap errors either:
     - As a form-level error (e.g. on the `FormGroup`).
     - Or as a message displayed under the date fields.

---

## 8. Interactions & User Experience

1. **Click empty timeline area**
   - Detect clicks on a row where there is no bar.
   - Determine the date corresponding to the click’s x-position.
   - Open the panel in **create** mode, pre-filled with that date.

2. **Three-dot actions menu**
   - On each bar, render a three-dot button.
   - When clicked, show a dropdown menu with:
     - “Edit” – opens the panel in edit mode.
     - “Delete” – deletes the work order after confirmation (or via direct action as per design).

3. **Delete behavior**
   - Immediately remove the work order from the data store.
   - Optionally show a brief toast/snackbar or status message.

4. **Timescale dropdown changes**
   - When the user selects Day/Week/Month:
     - Recompute header buckets.
     - Recalculate all bar positions and widths.
     - Preserve the logical center around today if possible.

5. **Keyboard and accessibility (bonus)**
   - Allow Esc to close the panel.
   - Make form fields keyboard-navigable.
   - Add suitable ARIA labels for actions and status pills.

---

## 9. Bonus Features (Optional)

These can be implemented after the core features are complete:

1. **localStorage persistence**
   - Persist work orders (and timeline configuration if desired).
   - Restore state on page reload.

2. **Smooth animations**
   - Animate panel slide-in/out.
   - Subtle animations for bar hover and focus states.

3. **Infinite horizontal scroll**
   - Detect near-left/right scroll edges.
   - Dynamically prepend/append additional date buckets.
   - Adjust scroll position when prepending to keep the viewport anchored.

4. **Today button**
   - Add a toolbar button that scrolls/centers the timeline on today’s date.

5. **Tooltips on bar hover**
   - Show small tooltip with:
     - Work order name.
     - Status.
     - Exact start and end dates.

6. **Performance optimizations**
   - Use OnPush change detection where appropriate.
   - Use `trackBy` functions for `*ngFor` loops.

---

## 10. Testing Strategy

1. **Unit tests**
   - Focus on:
     - Date-to-pixel conversion utilities.
     - Overlap detection logic (various edge cases).
     - Data service CRUD behavior.

2. **Component tests**
   - Verify:
     - Timeline renders correct number of columns per zoom level.
     - Bars appear at expected positions given known input data.
     - Create/Edit panel binds correctly to the Reactive Form.

3. **E2E tests (optional)**
   - Automate a few key flows:
     - Creating a work order (including overlap error case).
     - Editing and deleting orders.
     - Switching between zoom levels.

---

## 11. Documentation & Loom Demo Mapping

1. **README maintenance**
   - Keep this README aligned with actual implementation.
   - Document any deviations or trade-offs from the original spec.

2. **AI prompt log**
   - Maintain `AIPROMPTS.md` with:
     - Each significant AI prompt.
     - Short notes on which implementation decisions were influenced.

3. **Loom demo checklist**
   - When recording the Loom video, cover:
     - All zoom levels: Day, Week, Month.
     - Creating a new work order via click-to-create.
     - Editing an existing order (show overlap handling).
     - Deleting a work order.
     - Basic architecture walkthrough (components, services, utilities).

4. **Git history**
   - Use small, meaningful commits corresponding to:
     - Setup and configuration.
     - Data layer.
     - Timeline layout.
     - Interactions and validation.
     - Bonus features and polish.

---

## Suggested Git Commit Messages (Recent Changes)

Use these when committing the Work Order Details and UX refinements described in AIPROMPTS.md (Prompts 16–18):

```text
feat(work-order-details): add status badge, panel labels, Escape close, end-date validator

- Add visible status badge (pill/tag) on work order bars per design tokens
- Align panel labels to spec: "Start Date", "End Date"
- Add JSDoc that create opens only on empty timeline area
- Close panel on Escape key (HostListener)
- Add endDateAfterStartValidator and startDate valueChanges for immediate validation
```

```text
fix(timeline): use click position for start date; end date remains start + 7 days

- Fix row click X: use event.clientX - rect.left (rect already reflects scroll)
- Add comment: start date from click position, end date pre-filled as start + 7
```

```text
feat(timeline): highlight only the cell under pointer instead of full row

- Add hoveredCellX signal and onRowMouseEnter/Move/Leave handlers
- Add getCellHighlight(workCenterId) for column-aligned highlight geometry
- Replace row .hovered with timeline-cell-highlight div per row
- Left panel row labels still highlight by row when hovering that row
```

```text
docs: update AIPROMPTS.md and README with recent implementation and commit messages

- Log Prompts 16–18 (Work Order Details, click/end date, cell highlight)
- Add Implementation Status & Recent Changes to README
- Add suggested git commit messages for the above changes
```

This guide serves as the **implementation roadmap** and **status reference**. The codebase implements the core requirements; use the sections above to track what is done and how to commit changes.