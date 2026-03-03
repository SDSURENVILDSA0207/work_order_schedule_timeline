# AI Prompts Log – Work Order Schedule Timeline

This file records the **AI prompts** used while working on the Work Order Schedule Timeline technical test, to showcase the problem-solving process and where AI assistance was applied.

Each entry includes:
- A short **description/context**
- The **exact prompt text** provided to the AI
- The **date** of the interaction

---

## Prompt 1 – Planning the Solution

- **Date**: 2026-03-02  
- **Context**: Initial request to build a development plan based on the provided Naologic technical test specification.

**Prompt text:**

> `@FE-technical-test (2) (4).md (1-482)`  
> Kindly build a plan for the above problem statement. Follow all the instructions strictly. I would provide screenshots of all the figma diagrams in the next chat. Kindly first build a plan and based on my approval we will first write the README file for all the steps that we take. From now all the AI prompt should be saved in AIPROMPTS.md file based on the documentation given.

---

## Prompt 2 – Implementation Guide in README

- **Date**: 2026-03-02  
- **Context**: Request to write a step-by-step README guide and start logging prompts.

**Prompt text:**

> Now write the step by step guide in README file for implementation of the project based on the plan that you build above. Also remember to store all the ai prompts in AIPROMPTS.md file for showcasing the problem solving skills. Don't write any code until approval in the next chat

---

## Prompt 3 – Angular Base Project Setup

- **Date**: 2026-03-02  
- **Context**: Request to set up the base Angular 17+ project and ensure everything lives in the current working directory (no nested app folder), ready to run the default Angular page via `ng serve`.

**Prompt text:**

> Now setup the base angular project to start with the correct file structure for Implementation of this project. Don't write any code but add correct dependencies like angular 17+, gitignore and more. I just need to render the default angular page with ng-serve.

---

## Prompt 4 – Flatten Angular Project Structure

- **Date**: 2026-03-02  
- **Context**: Ensure all generated Angular files are in the repository root rather than a nested folder.

**Prompt text:**

> write all changes in the current working directory and don't create a new folder

---

## Prompt 5 – NAOLOGIC Logo and Header (Pixel-Perfect)

- **Date**: 2026-03-02  
- **Context**: Add the NAOLOGIC brand/logo at the top of the page with exact position, size, and appearance from the Sketch design specs.

**Prompt text:**

> I want to add the logo NAOLOGIC" brand (top) with accurate Position and size, CSS, Appearance.
> Remember to document all the prompts to AIPROMPTs.md and modify the README.md accordingly
>
> Group 3 - Logo: Position 101X 20Y; Rotate 0°; Width 80px Fixed, Height 10px Fixed; CSS width: 80px; height: 10px;; Opacity 100%.
>
> Rectangle (header bar): Position 0X 0Y; Width 1,440px Fixed, Height 50px Fixed; no border, no padding; CSS width: 1440px; height: 50px; background-color: rgba(255, 255, 255, 1); Opacity 100%; Fills #FFFFFF 100%.

---

## Prompt 6 – "Work Orders" Title (Pixel-Perfect)

- **Date**: 2026-03-02  
- **Context**: Add the "Work Orders" page title in the schedule header with exact position, size, typography (H3 – 24 Style), and appearance from the Sketch design specs.

**Prompt text:**

> I want to add the logo "Work Orders" title with accurate Position and size, CSS, Appearance.
> Remember to document all the prompts to AIPROMPTs.md and modify the README.md accordingly
>
> Contacts / Position and size: Position 101X 95Y; Rotate 0°; Width 142px Fit, Height 34px Fit; 142×34; border-box; no border, no padding.
> CSS: width: 142px; height: 34px; color: rgba(3, 9, 41, 1); font-family: CircularStd-Medium; font-size: 24px; font-weight: 500; font-style: medium.
> Text: "Work Orders". Appearance: Opacity 100%. Typeface: Circular Std, Weight Medium (500), Size 24px, Line Height 34px (1.417), Color #030929 100%, Alignment left/top.

---

## Prompt 7 – Timescale "Month" Dropdown (Pixel-Perfect)

- **Date**: 2026-03-02  
- **Context**: Add the Timescale control with "Month" dropdown: two-segment control (label + dropdown) with exact position, size, border-radius, and fill from the Sketch design specs.

**Prompt text:**

> I want to add the Timescale "Month" dropdown with accurate Position and size, CSS, Appearance. Remember to document all the prompts to AIPROMPTs.md and modify the README.md accordingly.
>
> **Rectangle 2 (Timescale)**: Position 101X 155Y; 75×25 px; border-radius 5px 0 0 5px; background-color rgba(241, 243, 248, 0.75); box-sizing border-box; no padding; Opacity 100%. Style: Rounded, Fills #F1F3F8 75%.
>
> **Month (Dropdown)**: Position 176X 155Y; 71×25 px; border-radius 0 5px 5px 0; box-sizing border-box; no padding; Opacity 100%. Corners 0;5;5;0. Nao Design System v2/Shadow/Light.

---

## Prompt 8 – Work Center List (Pixel-Perfect)

- **Date**: 2026-03-02  
- **Context**: Add the left column "Work Center" label and list (Genesis Hardware, Rodriques Electrics, etc.) with exact position, size, typography, and row rectangle from the Sketch design specs.

**Prompt text:**

> I want to add the Left column: "Work Center" list (Genesis Hardware, Rodriques Electrics, …) with accurate Position and size, CSS, Appearance. Remember to document all the prompts to AIPROMPTs.md and modify the README.md accordingly.
>
> **Work Center (label)**: Position 133X 213Y; 138×16 px; color rgba(104, 113, 150, 1) #687196; font CircularStd-Regular 14px weight 500; line-height 17px; no border/padding; border-box; opacity 100%; content "Work Center".
>
> **Rectangle (row)**: Position 102X 238Y; 380×60 px; background #FFFFFF 100%; no border/padding; border-box; opacity 100%.

---

## Prompt 9 – Timeline Axis (Aug 2024 … Mar 2025) (Pixel-Perfect)

- **Date**: 2026-03-02  
- **Context**: Add the timeline axis with month labels (Aug 2024, Sep 2024, … Mar 2025) with exact position, size, typography, and alignment from the Sketch design specs.

**Prompt text:**

> I want to add the Timeline axis (Aug 2024 … Mar 2025) with accurate Position and size, CSS, Appearance. Remember to document all the prompts to AIPROMPTs.md and modify the README.md accordingly.
>
> **Aug 2024**: Position 497X 213Y; 86×16 px; color #687196; font CircularStd-Regular 14px weight 500; line-height 17px; text-align center; no border/padding; border-box; opacity 100%.
>
> **Sep 2024**: Position 611X 213Y; 86×16 px; same CSS and appearance.

---

## Prompt 10 – Vertical "Current month" Line + Label (Pixel-Perfect)

- **Date**: 2026-03-02  
- **Context**: Add the vertical "Current month" line and label with exact position, size, typography, and Group 5 container from the Sketch design specs.

**Prompt text:**

> I want to add the Vertical "Current month" line + label with accurate Position and size, CSS, Appearance. Remember to document all the prompts to AIPROMPTs.md and modify the README.md accordingly.
>
> **Current month (label)**: Position 603X 239Y; 93×18 px; color rgba(62, 64, 219, 1); font CircularStd-Book 14px weight 400; line-height 17px; no border/padding; border-box; opacity 100%; content "Current month"; Nao Design System primary shade 2.
>
> **Group 5**: Position 596X 238Y; 799×747 px; opacity 100% (container for line; vertical line at 596, height 747).

---

## Prompt 11 – Scrollable Grid, Colored Bars, Three-Dot Menu (Pixel-Perfect)

- **Date**: 2026-03-02  
- **Context**: Add the scrollable timeline grid with one row per work center, work order bars (name + status badge) with design colors, and three-dot menu (Edit/Delete) per the Sketch specs.

**Prompt text:**

> I want to add the Scrollable grid with rows per work center, Colored bars (name + status badge) and Three-dot menu on bar (Edit/Delete) with accurate Position and size, CSS, Appearance. Remember to document all the prompts to AIPROMPTs.md and modify the README.md accordingly.
>
> **Complete** badge: 63×18 fit; color rgba(8, 162, 104, 1) #08A268; Circular Std Book 14px 400; line-height 17px.
> **In progress** badge: 71×18; color rgba(62, 64, 219, 1) primary shade2.
> **Blocked** badge: 51×18; color rgba(177, 54, 0, 1) #B13600.
> **Rectangle 2 (bar)**: 533×38; border-radius 8px; background #FFFCF1; box-shadow 0 0 0 1px #FFF5CF; NDS.

---

## Prompt 12 – Empty Row "Click to add dates" Pill + Slide-Out Panel (Pixel-Perfect)

- **Date**: 2026-03-02  
- **Context**: Add the empty row area "Click to add dates" tooltip/pill and the right slide-out Create/Edit panel with exact position, size, and appearance from the Sketch design specs.

**Prompt text:**

> I want to add Empty row area + "Click to add dates" tooltip and Right slide-out Create/Edit panel with accurate Position and size, CSS, Appearance. Remember to document all the prompts to AIPROMPTs.md and modify the README.md accordingly.
>
> **Rectangle (pill)**: Position 675X 303Y; 113×38 px; border 1px solid rgba(195, 199, 255, 1) #C3C7FF; border-radius 8px; background rgba(101, 112, 255, 0.1) #6570FF 10%; box-sizing border-box; opacity 100%.
>
> **Rectangle (panel)**: Position 849X 0Y; 591×1024 px; border-radius 12px 0 0 12px; background #FFFFFF; box-shadow 0 5px 15px 0 rgba(216, 220, 235), 0 2.5px 3px -1.5px rgba(200, 207, 233), 0 4.5px 5px -1px rgba(216, 220, 235); NDS v2.

---

## Prompt 13 – Work Order Form Fields (Panel) (Pixel-Perfect)

- **Date**: 2026-03-02  
- **Context**: Add Work Order Name, Status, Start Date, End Date form fields in the slide-out panel with exact label and control styling from the Sketch design specs.

**Prompt text:**

> AI training model / Work Order Name label: 874X 107Y; 542×16; color #687196; Circular Std Regular 14px 500; line-height 17px. Status label: 873X 193Y; 543×16; same. Rectangle 7 (Status dropdown): 873X 217Y; 543×38; box-shadow 0 0 0 2px rgba(170, 175, 255, 1); border-radius 5px; background #FFF. Rectangle 2 (options): 543×28; #F1F3F8; same for Open, In progress, complete, blocked. Rectangle 7 (text/date input): 873X 389Y; 543×38; box-shadow 0 0 0 1px rgba(216, 220, 235), 0 1.5px 3px -1.5px rgba(200, 207, 233), 0 1px 0.5px -1px rgba(216, 220, 235); border-radius 5px; background #FFF.

---

## Prompt 14 – Pixel-Perfect UI Pass (Image + Previous Data)

- **Date**: 2026-03-02  
- **Context**: Align the entire UI with the reference image and all prior design data: colors, fonts, typography, grid lines, bar backgrounds, tooltip, timescale dropdown, panel visibility.

**Prompt text:**

> Kindly analyse the image and all the previous data and make the entire UI exactly how it looks. Look at the color, font, typography from the image and refer to the previous data to get the pixel perfect UI.

**Changes made:** Global Circular Std and dark grey text; timeline vertical grid lines (114px columns); sidebar shadow separation; status-colored bar backgrounds (light green/purple/orange tints) and borders; "Click to add dates" CSS tooltip (dark grey, white text, arrow) and pointer-events/cursor; timescale dropdown with Hour/Day/Week/Month and open menu styling; panel hidden by default to match image.

---

## Prompt 15 – Work Order Timeline Logic Implementation (Full Plan)

- **Date**: 2026-03-02  
- **Context**: After the UI was partially created, implement all behavior required by the FE technical test (create/edit/delete work orders, panel open/close, Reactive Forms with validation and overlap detection, timescale-driven timeline, click-to-create) without changing existing layout or SCSS. Add only missing dependencies, data/service logic, event wiring, and minimal UI (Create/Cancel/Save buttons, backdrop).

**Prompt text:**

> @FE-technical-test (2) (4).md (1-482) Now that the UI is partially created, follow the instructions strictly to implement the correct logic for this project. Donot try to change the layout of UI or any scss as we would implement that later. Only make the UI working as per the problem statement. You can add certain component in Ui that are not implemented yet for example create, cancel and so on

**Changes made:**

1. **Dependencies and app config:** Installed @ng-bootstrap/ng-bootstrap and ng-select (with --legacy-peer-deps for Angular 17). In app.config.ts added provideAnimations().

2. **Data layer:** WorkOrderDataService: createWorkOrder, updateWorkOrder, deleteWorkOrder; hasOverlap(workCenterId, startDateStr, endDateStr, excludeDocId?). Added 3 sample work orders (wo6–wo8) for 8+ samples.

3. **Timeline date utils:** getVisibleDateRange(centerDate, zoom) returns { start, end } (day ±2 weeks, week ±2 months, month ±6 months; 'Hour' as 'day'). barPosition(...) returns { leftPx, widthPx } with clamping.

4. **Timeline row / grid / bar:** Row: @Input() range, trackWidthPx; getBarStyle uses barPosition; @Output() addOrder, editOrder, deleteOrder; empty-area click emits addOrder with computed date; forwards bar edit/delete. Bar: @Output() edit, delete from bar-actions. Grid: @Input() zoom, range, trackWidthPx; effectiveRange getter; @Output() addOrder, editOrder, deleteOrder; passes range and events to rows.

5. **Timescale state:** Schedule header: @Input() selectedTimescale, @Output() timescaleChange. Sidebar passes through to header. Timeline page: zoom, centerDate, visibleRange getter, onTimescaleChange; passes zoom and visibleRange to sidebar and grid.

6. **Panel:** Timeline page: panelOpen, panelMode, editingOrder, createWorkCenterId, createStartDate; openCreatePanel, openEditPanel, closePanel, onDeleteOrder, onSave; backdrop (click)=closePanel; grid addOrder/edit/delete wired. Work order panel: @Input() mode, workCenterId, initialDate, editingOrder; @Output() close, save; Cancel/Create|Save buttons; overlap check and overlapError; z-index 101; panel-error, panel-actions, panel-btn styles.

7. **Form:** Work order form: FormGroup (name, status, startDate, endDate, required); ngOnChanges pre-fill from editingOrder or initialDate (create: start + end = initialDate + 7d); status options from STATUS_DISPLAY_LABELS; getValue() returns { name, status, startDate, endDate } ISO; native select and type="date" inputs.

8. **Create flow:** New orders use docId = 'wo-' + Date.now(), docType 'workOrder', ISO date strings. Build succeeds; click empty row opens create panel with pre-filled dates; Edit/Delete open edit panel or delete; timescale updates visible range; Create/Save validate and run overlap checks before saving.

---

## Prompt 16 – Work Order Details Spec-Perfect Implementation

- **Date**: 2026-03-03  
- **Context**: Implement Work Order Details to match the problem statement exactly: create, update, delete, form validation, overlap detection, and correct reflection on the timeline. Plan included status badge on bars, panel label alignment, optional comment, Escape to close panel, and end-date validator.

**Prompt text:**

> @FE-technical-test (2) (4).md (1-482)  
> Follow the instructions strictly and understand the current code.  
> I want to implement Work Order Details perfectly as described in the problem statement. Should be able to create, update and delete. Follow all the rules in the problem statement for work order details. It should perfectly reflect in work order timeline based on the rules mentioned in the problem statement.

**Changes made:**

1. **Status badge on work order bars** – Added a visible pill/tag on each bar showing the status label (Open, In Progress, Complete, Blocked) with design-token styling (11px/600, padding 2px 8px, status-specific background colors from DESIGN_TOKENS).
2. **Panel form labels** – Updated "Start date" and "End date" to "Start Date" and "End Date" to match the spec.
3. **Timeline comment** – Added JSDoc comment that create panel opens only when clicking empty timeline area (bar stops propagation).
4. **Escape to close panel** – Added `@HostListener('document:keydown.escape')` on the work-order-panel to call `cancel()` and close the panel.
5. **End-date validator** – Added `endDateAfterStartValidator` so the end-date control is invalid when end is not after start; `startDate` valueChanges triggers `endDate.updateValueAndValidity()` for immediate feedback.

---

## Prompt 17 – Start Date from Click Position, End Date +7 Days

- **Date**: 2026-03-03  
- **Context**: Ensure the create panel’s start date is set from where the user clicks on the timeline, and the end date defaults to start + 7 days.

**Prompt text:**

> The start date should be where the pointer clicks on the work order timeline and the end date should be by default in +7 days

**Changes made:**

1. **Click position fix** – Corrected the timeline row click position calculation. Previously `clickX = event.clientX - rect.left + scrollLeft` double-counted scroll; the row’s `getBoundingClientRect()` already reflects scroll, so it was changed to `clickX = event.clientX - rect.left`. The start date now correctly matches the clicked cell on the timeline.
2. **Panel behavior** – Confirmed the panel already pre-fills start from `startDatePrefill` (from click) and end as `addDays(new Date(startPrefill), 7)` in create mode; no change needed there.
3. **Comment** – Added a short comment in the timeline component that start date comes from click position and end date is pre-filled as start + 7 days.

---

## Prompt 18 – Cell-Based Timeline Highlight (Not Full Row)

- **Date**: 2026-03-03  
- **Context**: Change timeline hover behavior so only the cell (time column) under the pointer is highlighted, not the entire row.

**Prompt text:**

> Every pointer pointing on the work order timeline should highlight the cell based on the timeline instead of highlighting entire row

**Changes made:**

1. **Signals and handlers** – Added `hoveredCellX` signal; `onRowMouseEnter`, `onRowMouseMove`, and `onRowMouseLeave` to set/clear `hoveredRowId` and `hoveredCellX` based on pointer position relative to the row.
2. **Cell highlight geometry** – Added `getCellHighlight(workCenterId)` returning `{ left, width }` for the column under the cursor (using `getColumnWidth(zoom)`), or null when not hovering that row.
3. **Template** – Replaced full-row `[class.hovered]` with a `timeline-cell-highlight` div inside each row, positioned at the computed cell left/width and shown only when that row is hovered with a valid `hoveredCellX`.
4. **Styles** – Removed `.timeline-row &.hovered` background; added `.timeline-cell-highlight` (absolute, full height, `--color-row-hover` background, z-index 0, pointer-events none). Left panel row labels still highlight by row when the pointer is over that row.

---

## Prompt 19 – Update AIPROMPTS and README; Git Commit Messages

- **Date**: 2026-03-03  
- **Context**: Keep documentation in sync with implementation and provide ready-to-use git commit messages for the recent changes.

**Prompt text:**

> Kindly update the AIPROMPS.md and README.md file according to the changes and also write git commit comments for the changes made

**Changes made:**

1. **AIPROMPTS.md** – Appended Prompt 16 (Work Order Details spec-perfect: status badge, panel labels, Escape, end-date validator), Prompt 17 (start date from click position, end date +7 days, click position fix), Prompt 18 (cell-based timeline highlight), and this Prompt 19.
2. **README.md** – Added “Implementation Status & Recent Changes” summarizing what is implemented (timeline, bars, panel, overlap, cell highlight, interactions) and how to run; added “Suggested Git Commit Messages (Recent Changes)” with four commit message blocks for the above feature/fix/docs commits.
3. **Git commit messages** – Documented in README as suggested commits: (1) feat work-order-details, (2) fix timeline click position, (3) feat timeline cell highlight, (4) docs AIPROMPTS and README.

---

## Prompt 20 – Work Order Details Panel Pixel-Perfect Layout

- **Date**: 2026-03-03  
- **Context**: Match the right pane to design specs: panel 591×1024px, title/subtitle typography, Cancel/Create in header with exact size and shadow.

**Prompt text:**

> Kindly analyse the screenshot carefully for work order details right pane layout. I have provided the details for "Work Order Details", "Specify the dates, name and status for this order", "Create", "Cancel". Kindly make it pixel perfect based on the data  
> (Rectangle panel 591×1024, border-radius 12px 0 0 12px, three box-shadows; Title 253×25, 20px Medium, #2F3059; Subtitle 352×20, 16px Book, rgba(104,113,150); Cancel/Create 66×32, 7px radius, exact shadows and typography.)

**Changes made:** Panel 591×1024px, three box-shadows, border-radius 12px 0 0 12px; header with title + subtitle left, Cancel/Create top-right; title 20px/500 #2F3059, subtitle 16px/400; buttons 66×32px, 7px radius, exact shadows; form wrapper; removed bottom panel-actions.

---

## Prompt 21 – Separator Line Below Subtitle

- **Date**: 2026-03-03  
- **Context**: Add horizontal separator below "Specify the dates, name and status for this order" per design (Line 3 at 850X 82Y).

**Prompt text:**

> In the Work Order details below "Specify the dates, name and status for this order" based on the below data  
> Line 3: 591×1px, border 1px solid rgba(230, 235, 240, 1), position 82Y.

**Changes made:** Added `.panel-separator` div with 1px solid rgba(230,235,240,1), full panel width, margin-top 16px; 24px spacing between line and form (header padding-bottom 0, form padding 24px).

---

## Prompt 22 – Spacing: 24px Between Line and Work Order Name

- **Date**: 2026-03-03  
- **Context**: Set 24px gap between the separator line and the "Work Order Name" field.

**Prompt text:**

> Kindly adjust the spacing to 24 px between "line" and "Work Order Name"

**Changes made:** Header padding-bottom set to 0; form top padding 24px provides the 24px gap.

---

## Prompt 23 – Status Dropdown: Selected Pill + Dropdown List Plain Text

- **Date**: 2026-03-03  
- **Context**: Status options in dropdown list: plain text on white; selected value in field: styled pill (background, border for Open) per design.

**Prompt text:**

> If the dropdown option in status { open, in progress, complete, blocked } is selected … (open/blocked/in progress/complete: width, height, color, font; Rectangle bg for each.)  
> … it should look in this way when dropdown but when clicked any of it like open in the status field it should look like provided in second screenshot

**Changes made:** ng-label-tmp keeps status-tag pill (backgrounds, borders, colors); ng-option-tmp uses plain `.status-option-label` (no pill in list). Added status-specific colors for dropdown options when not selected (Prompt 24).

---

## Prompt 24 – Status Dropdown Options: Colors When Not Selected

- **Date**: 2026-03-03  
- **Context**: Dropdown list items (when open) have status-specific text colors: open blue, in progress/complete dark grey, blocked very dark.

**Prompt text:**

> Note that dropdown items have specific colors when not selected  
> open->color rgba(62,64,219,1); in progress/complete->rgba(47,48,89,1); blocked->rgba(3,9,41,1); 150×18px, 14px Book 400.

**Changes made:** `.status-option-label.status-option-{{ value }}` with per-status colors; base 150×18px, 14px, 400.

---

## Prompt 25 – Remove Clear (X) Button from Status Field

- **Date**: 2026-03-03  
- **Context**: Hide the clear button next to the status dropdown.

**Prompt text:**

> kindly remove the X button from the status field next to dropdown

**Changes made:** Added `[clearable]="false"` to the status ng-select.

---

## Prompt 26 – Date Fields: No Calendar Icon, Dot Separator (dd.MM.yyyy)

- **Date**: 2026-03-03  
- **Context**: Remove calendar icon below start/end date; display and parse dates with "." as separator (e.g. 01.01.2026).

**Prompt text:**

> kindly remove the calender icon below the start and the end date and in the field of start and end date write "." as a seperator and as show in screenshot

**Changes made:** Removed calendar toggle buttons; added custom `DotDateParserFormatter` (NgbDateParserFormatter) with format dd.MM.yyyy and parse; provided in panel component.

---

## Prompt 27 – End date / Start date: Order, Labels, Section and Field Styling

- **Date**: 2026-03-03  
- **Context**: End date first, then Start date; label and date field sizes and colors; section 542×62px.

**Prompt text:**

> end date, start date field size -> (labels: 542×16, color rgba(104,113,150), 14px 500; date field: 513.7×16, color rgba(164,170,192), 14px 500) and change the order first the end date and then the start date

**Changes made:** Reordered so End Date block first, Start Date second; added `.form-group-date` and `.form-control-date`; label 542×16, rgba(104,113,150), 14px 500; input 513.7×16, color rgba(164,170,192). Later: section 542×62 (Prompt 28); labels "End date"/"Start date" (Prompt 29); Rectangle 7 for inputs 542×38, box-shadow, 5px radius (Prompt 30).

---

## Prompt 28 – Date Section Size 542×62

- **Date**: 2026-03-03  
- **Context**: Each End date / Start date section fixed size.

**Prompt text:**

> section size of end date start date->width: 542px; height: 62px;

**Changes made:** `.form-group-date` set to width 542px, height 62px, box-sizing border-box.

---

## Prompt 29 – End date / Start date Label Capitalization

- **Date**: 2026-03-03  
- **Context**: Match screenshot: "End date" and "Start date" (lowercase "date").

**Prompt text:**

> look at this ss and the expected result in second ss

**Changes made:** Labels changed from "End Date"/"Start Date" to "End date"/"Start date".

---

## Prompt 30 – Date Input Rectangle 7 (542×38, Shadow, Radius)

- **Date**: 2026-03-03  
- **Context**: End/Start date input field: Rectangle 7 specs (542×38, border-radius 5px, three box-shadows, white bg).

**Prompt text:**

> end date, start date field size -> Rectangle 7 … width 542px; height 38px; box-shadow … border-radius 5px; background #FFFFFF

**Changes made:** `.form-control-date` updated to width 542px, height 38px, border-radius 5px, white background, three box-shadows; focus state with 2px primary ring.

---

## Prompt 31 – Document All Prompts and Update README

- **Date**: 2026-03-03  
- **Context**: Record all prompts in AIPROMPTS.md and update README to reflect current implementation.

**Prompt text:**

> write all the prompts used in the AIPROMPS.md and Update README.md file accordingly

**Changes made:** Appended Prompts 20–31 to AIPROMPTS.md (panel pixel-perfect, separator, spacing, status dropdown styling and clearable, date format and order, section/field sizes, Rectangle 7, label text, docs). README updated with current Work Order Details panel and date/status field behaviour.

---

## Prompt 32 – Timescale Control Pixel-Perfect & Remove Today Button

- **Date**: 2026-03-03  
- **Context**: Match the Timescale + Month segmented control to design (Rectangle 2 specs, shadow, spacing), add Hour option, and remove the separate Today button so the control looks like the reference screenshots.

**Prompt text (paraphrased):**

> Make the Timescale control look exactly like the design: “Timescale” text in a left rectangle, “Day/Month/…” in a right rectangle, shared shadow, 75×25 and 71×25 sizes, specific colors, and remove the Today button beside it.

**Changes made:**
- Rebuilt `TimescaleSelectorComponent` as a single composite control with:
  - Left label segment (`Timescale`) – 75×25px, radius `5 0 0 5`, `#F1F3F8` 75% background.
  - Right dropdown segment (Hour/Day/Week/Month) – 71×25px, radius `0 5 5 0`, white background, blue value + chevron, hidden native arrow.
  - Shared border + NDS shadow so it appears as one pill; vertical divider between the two segments.
- Added Hour to the timescale options.
- Removed the standalone Today button and its styles from the timeline header so only the Timescale control remains.

---

## Prompt 33 – Work Order Bars & Status Pills Pixel-Perfect

- **Date**: 2026-03-03  
- **Context**: Make the work order bars and status pills (Open, In Progress, Complete, Blocked) match the design screenshots, including bar sizes, shadows, and pastel backgrounds per status.

**Prompt text (paraphrased):**

> For each status, style the bar and the pill exactly like the screenshots with the given widths, heights, border radius, box-shadow, and RGBA colors for “In Progress”, “Complete”, and “Blocked”; then apply a similar approach for “Open”.

**Changes made:**
- Updated `WorkOrderBarComponent` inline styles so:
  - In-progress bar: `min-width: 381px`, height `38px`, box-shadow `0 0 0 1px rgba(222, 224, 255, 1)`, radius `8px`, background `rgba(237, 238, 255, 1)`.
  - Complete bar: `min-width: 381px`, height `38px`, box-shadow `0 0 0 1px rgba(209, 250, 179, 1)`, radius `8px`, background `rgba(248, 255, 243, 1)`.
  - Blocked bar: `min-width: 533px`, height `38px`, box-shadow `0 0 0 1px rgba(255, 245, 207, 1)`, radius `8px`, background `rgba(255, 252, 241, 1)`.
- Restyled status pills:
  - Base `.status-badge` now uses Circular Std Book, 14px, regular weight.
  - In-progress pill: 87×22px, radius 5px, background `rgba(214, 216, 255, 1)`, blue text, centered.
  - Complete pill: 87×22px, radius 5px, background `rgba(209, 250, 179, 1)`, green text, centered.
  - Blocked pill: 87×22px, radius 5px, background `rgba(255, 235, 207, 1)`, orange text, centered.
  - Open pill: 87×22px, radius 5px, background `rgba(209, 242, 255, 1)`, teal/blue text, centered.

---

## Prompt 34 – Timeline Layout, Background Tint, Current Indicator, and Logo Assets

- **Date**: 2026-03-03  
- **Context**: Align the full timeline layout to the design: extend grid height, apply a light background tint to the date grid down to the bottom, square off container corners, add a hover-based “Current …” bubble above the year/month columns, and swap NAOLOGIC logos to use the provided PNG asset.

**Prompt text (paraphrased):**

> Make the timeline area reach further down like the reference image, tint the year/month grid with rgba(247,249,252,1) all the way, remove rounded corners, show a “Current month/day/hour” rectangle when hovering the column headers, and switch the NAOLOGIC logo to the supplied PNG with specific 80×10px dimensions.

**Changes made:**
- Layout and background:
  - Increased `.timeline-grid-wrapper` min-height so the grid and Work Center column extend closer to the bottom of the viewport.
  - Set `.timeline-body` background to `rgba(247, 249, 252, 1)` and removed border radius to match the flat card in the design.
  - Kept `.timeline-left` (Work Center column) white while tinting the right-hand grid.
  - Applied the same tint to `.timeline-grid` so the year/month columns have the light background.
- Current indicator:
  - Restyled `.current-day-label` to a 109×22px pill (`border-radius: 5px`, `background-color: rgba(212, 215, 255, 1)`) with centered Circular Std Book 12px text in primary blue.
  - Kept the existing logic that shows “Current hour/day/week/month” when today is in range, but added hover behaviour:
    - Track the hovered column index/signals.
    - When hovering a column header, show the same “Current …” pill above that column using the configured width/height and colors.
- Logos:
  - Updated the global app header to use `assets/Group 3@10x.png` with 80×10px dimensions at (101px, 20px) in the 50px header.
  - Replaced the text NAOLOGIC label in the timeline header with the same PNG, styled to 80×10px with 45px spacing above “Work Orders”.

---

New prompts and significant AI-assisted decisions will continue to be appended here as the implementation progresses.

