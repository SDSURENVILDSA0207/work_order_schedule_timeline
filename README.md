# Naologic FE Take-Home — Project Setup Guide

Complete walkthrough: Angular project scaffold → GitHub repo → README → first commit.

---

## Prerequisites

Before starting, confirm these are installed:

```bash
node --version      # Must be 18.x or 20.x (LTS)
npm --version       # 9.x or 10.x
ng version          # Angular CLI 17+
git --version       # Any recent version
```

### Install Angular CLI if not present

```bash
npm install -g @angular/cli
```

### Confirm you have Node 18+ (required for Angular 17)

```bash
node --version
# If below 18, install via: https://nodejs.org or use nvm
nvm install 20 && nvm use 20
```

---

## Step 1 — Scaffold the Angular Project

```bash
ng new naologic-timeline \
  --style=scss \
  --routing=false \
  --standalone \
  --strict
```

When prompted:
- **Which stylesheet format?** → SCSS *(already set via flag)*
- **Enable SSR?** → **No**

```bash
cd naologic-timeline
```

Verify it runs:

```bash
ng serve
# Open http://localhost:4200 — should see default Angular page
```

---

## Step 2 — Install Required Dependencies

These are **mandatory** per the spec:

```bash
# ng-select — for all dropdown/select inputs
npm install @ng-select/ng-select

# ng-bootstrap — for ngb-datepicker
npm install @ng-bootstrap/ng-bootstrap

# Bootstrap CSS (peer dependency for ng-bootstrap)
npm install bootstrap
```

Verify installations:

```bash
npm list @ng-select/ng-select @ng-bootstrap/ng-bootstrap bootstrap
```

### Wire bootstrap CSS into angular.json

Open `angular.json` and add bootstrap to the `styles` array:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.scss"
]
```

> **Note:** You'll override/strip most Bootstrap styles with custom SCSS. It's required only as a peer dependency for ng-bootstrap to function.

---

## Step 3 — Project Folder Structure

Create the following structure inside `src/app/`:

```bash
mkdir -p src/app/components/timeline
mkdir -p src/app/components/work-order-bar
mkdir -p src/app/components/work-order-panel
mkdir -p src/app/components/timescale-selector
mkdir -p src/app/services
mkdir -p src/app/models
mkdir -p src/app/data
mkdir -p src/app/utils
```

Final structure:

```
src/
├── app/
│   ├── app.component.ts          ← root standalone component
│   ├── app.component.html
│   ├── app.component.scss
│   ├── components/
│   │   ├── timeline/             ← main grid component
│   │   ├── work-order-bar/       ← individual bar + 3-dot menu
│   │   ├── work-order-panel/     ← create/edit slide panel
│   │   └── timescale-selector/   ← custom pill dropdown
│   ├── services/
│   │   ├── work-order.service.ts ← state + CRUD + overlap check
│   │   └── timeline.service.ts   ← date math utilities
│   ├── models/
│   │   └── work-order.model.ts   ← TypeScript interfaces
│   ├── data/
│   │   └── sample-data.ts        ← hardcoded work centers + orders
│   └── utils/
│       └── date.utils.ts         ← pure date helper functions
├── styles.scss                   ← global styles + CSS variables
└── index.html                    ← add Circular Std font link here
```

---

## Step 4 — Add Font & Global CSS Variables

### index.html — add Circular Std font

```html
<!-- src/index.html -->
<head>
  <link rel="stylesheet"
    href="https://naologic-com-assets.naologic.com/fonts/circular-std/circular-std.css">
  <!-- Google Fonts for Nunito (label font) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap"
    rel="stylesheet">
</head>
```

### styles.scss — design tokens as CSS variables

```scss
// src/styles.scss

// ─── Design Tokens (from fe-take-home-challenge.tokens.json) ──────────────────
:root {
  // Primary palette
  --color-primary:        #5659FF;   // 3-Element primary / 3
  --color-primary-dark:   #3E40DB;   // (1)-primary-shade2
  --color-primary-light:  #AAAFFF;   // 3-Element primary / 6

  // Text
  --color-text-primary:   #030929;   // 5-H3 color + Text-Primary
  --color-text-labels:    #687196;   // text-4-labels
  --color-text-disabled:  #D8DCEB;   // text-6-disabled

  // Stroke / Border
  --color-stroke:         #F0F1F5;   // stroke-2

  // Typography
  --font-heading:         "Circular-Std", "Circular Std", system-ui, sans-serif;
  --font-label:           "Nunito", system-ui, sans-serif;

  // Shadow
  --shadow-sm:            0px 1px 0.8px 0px rgba(0, 0, 0, 0.50);

  // Layout
  --timeline-left-width:  220px;
  --timeline-row-height:  52px;
  --timeline-header-height: 44px;
}

// ─── Global Reset ─────────────────────────────────────────────────────────────
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  font-family: var(--font-heading);
  color: var(--color-text-primary);
  background: #F7F7F9;
  margin: 0;
  padding: 0;
}
```

---

## Step 5 — Initialize Git Repository

```bash
# Inside naologic-timeline/
git init
git add .
git commit -m "feat: initial Angular 17 project scaffold"
```

---

## Step 6 — Create GitHub Repository

### Option A: GitHub CLI (recommended)

```bash
# Install gh CLI if needed: https://cli.github.com
gh auth login
gh repo create naologic-timeline \
  --public \
  --description "Naologic FE Take-Home: Work Order Schedule Timeline" \
  --source=. \
  --remote=origin \
  --push
```

### Option B: Manual via GitHub.com

1. Go to https://github.com/new
2. Repository name: `naologic-timeline`
3. Visibility: **Public**
4. Do NOT initialize with README (you already have one)
5. Click **Create repository**
6. Run the commands shown under "push an existing repository":

```bash
git remote add origin https://github.com/YOUR_USERNAME/naologic-timeline.git
git branch -M main
git push -u origin main
```

---

## Step 7 — Create the README.md

Replace the default README with this:

```markdown
# Naologic Work Order Schedule Timeline

A production scheduling UI built for the Naologic Frontend Engineer take-home challenge.
Displays work orders across work centers on an interactive, zoomable timeline.

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- Angular CLI 17+

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/naologic-timeline.git
cd naologic-timeline
npm install
```

### Run

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

---

## Features

- **Timeline grid** — Day, Week, and Month zoom levels with correct date headers
- **Work order bars** — Positioned by date, colored by status (Open / In Progress / Complete / Blocked)
- **Create work orders** — Click any empty timeline area to open a pre-filled create panel
- **Edit work orders** — Three-dot (⋯) menu on each bar opens Edit/Delete options
- **Overlap detection** — Prevents scheduling two orders on the same work center at the same time
- **Slide-out panel** — Smooth animation, closes on outside click or Cancel
- **Today indicator** — Vertical line marking today's date on the grid
- **Today button** — Scrolls viewport to center on today
- **localStorage persistence** — Work orders survive page refresh *(bonus)*
- **Responsive** — Horizontal scroll on smaller screens

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Angular | 17+ | Framework — standalone components, OnPush CD |
| TypeScript | 5.x strict | Type safety throughout |
| SCSS | — | All styling via CSS custom properties |
| @ng-select/ng-select | latest | Status dropdown with custom badge template |
| @ng-bootstrap/ng-bootstrap | latest | ngb-datepicker for date fields |
| Bootstrap | 5.x | Peer dependency for ng-bootstrap |

---

## Architecture

```
src/app/
├── components/
│   ├── timeline/             # Main grid: header + rows + today line
│   ├── work-order-bar/       # Bar rendering + 3-dot dropdown
│   ├── work-order-panel/     # Create/Edit slide panel with Reactive Form
│   └── timescale-selector/   # Custom pill control (Hour/Day/Week/Month)
├── services/
│   ├── work-order.service.ts # State management + CRUD + overlap validation
│   └── timeline.service.ts   # Date-to-pixel math, column generation
├── models/
│   └── work-order.model.ts   # WorkCenterDocument, WorkOrderDocument interfaces
├── data/
│   └── sample-data.ts        # 5 work centers, 8+ work orders, all 4 statuses
└── utils/
    └── date.utils.ts         # Pure date helpers (addDays, diffDays, etc.)
```

### Key Design Decision: Date-to-Pixel Math

The hardest part of a timeline component is correctly converting dates to pixel positions.
The core formula lives in `TimelineService.dateToPixel()`:

```typescript
// Day view: each day = colWidth px
left = diffDays(rangeStart, startDate) * colWidth

// Week view: each 7 days = colWidth px
left = (diffDays(rangeStart, startDate) / 7) * colWidth

// Month view: fractional month offset
left = (monthDiff + dayFraction) * colWidth
```

Bar width = `dateToPixel(endDate) - dateToPixel(startDate)`.

### Overlap Detection

```typescript
// Two date ranges overlap when: startA < endB AND endA > startB
orders
  .filter(o => o.data.workCenterId === targetWcId && o.docId !== excludeId)
  .some(o => newStart < parseDate(o.data.endDate) && newEnd > parseDate(o.data.startDate))
```

---

## Sample Data

5 work centers with 8+ work orders demonstrating:
- All four statuses: `open`, `in-progress`, `complete`, `blocked`
- Multiple non-overlapping orders on the same work center
- Orders spanning different date ranges (past, current, future)

---

## AI Assistance

This project used Claude (Anthropic) as an AI assistant for:
- Prototyping the timeline math and pixel-positioning logic in React before porting to Angular
- Validating overlap detection edge cases
- Design token extraction from the Figma/Sketch file

See [`AI_PROMPTS.md`](./AI_PROMPTS.md) for the full prompt log.

---

## License

Built for Naologic's Frontend Engineer take-home challenge — not for redistribution.
```

---

## Step 8 — Create Commit Strategy

Use this commit structure to show clean progression:

```
feat: initial Angular 17 project scaffold
feat: add models, interfaces, and sample data
feat: implement timeline date utilities
feat: build timeline grid with day/week/month zoom
feat: add work order bar component with status colors
feat: add 3-dot actions menu with edit/delete
feat: implement create/edit slide panel with reactive forms
feat: add overlap detection and form validation
feat: wire work order service with full CRUD
style: pixel-perfect design tokens and layout matching sketch
feat(bonus): add localStorage persistence
feat(bonus): add Today button and smooth animations
docs: add README and AI prompts log
```

### Commit after each major feature:

```bash
git add .
git commit -m "feat: add models, interfaces, and sample data"
git push
```

---

## Step 9 — Create AI_PROMPTS.md (Bonus — Easy Win)

```bash
touch AI_PROMPTS.md
```

Template to fill in as you build:

```markdown
# AI Prompts Log

Documenting key prompts used during development as requested in the challenge spec.

---

## 1. Timeline Architecture

**Prompt:**
> "I'm building an Angular 17 Work Order Schedule Timeline. The main challenge is
> converting dates to pixel positions across Day/Week/Month zoom levels.
> What's the cleanest way to structure this math as a service?"

**Decision made:** Created `TimelineService` with a single `dateToPixel(date, rangeStart, zoom, colWidth)` 
pure function. This keeps all date math testable and out of components.

---

## 2. Overlap Detection

**Prompt:**
> "Two work orders on the same work center overlap when their date ranges intersect.
> What's the canonical overlap check formula?"

**Answer used:** `startA < endB && endA > startB`

---

## 3. Fixed Left Panel + Scrollable Grid

**Prompt:**
> "In Angular with SCSS, how do I keep a fixed left panel while only the right
> timeline grid scrolls horizontally, and sync hover states across both?"

**Decision made:** CSS Grid layout with `position: sticky` on left panel...
```

---

## Step 10 — Final Pre-Submission Checklist

Before submitting, verify:

```bash
# 1. Clean install works
rm -rf node_modules && npm install && ng serve

# 2. No TypeScript errors
ng build --configuration=production

# 3. Repo is public and has clean commits
gh repo view --web

# 4. README renders correctly on GitHub
# Visit: https://github.com/YOUR_USERNAME/naologic-timeline
```

### Submission items:
- [ ] GitHub repo URL (public)
- [ ] Loom video URL (5–10 min)
- [ ] AI_PROMPTS.md committed to repo

---

## Quick Reference: Token Values

| CSS Variable | Value | Used For |
|---|---|---|
| `--color-primary` | `#5659FF` | Buttons, active states, primary blue |
| `--color-primary-dark` | `#3E40DB` | Hover states, bar text |
| `--color-primary-light` | `#AAAFFF` | Bar borders, light accents |
| `--color-text-primary` | `#030929` | All primary text |
| `--color-text-labels` | `#687196` | Secondary labels, column headers |
| `--color-text-disabled` | `#D8DCEB` | Placeholders, disabled |
| `--color-stroke` | `#F0F1F5` | All borders and gridlines |
| `--shadow-sm` | `0px 1px 0.8px rgba(0,0,0,0.50)` | Panel shadow |
