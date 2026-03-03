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

New prompts and significant AI-assisted decisions will be appended here as the implementation progresses.

