# Design Tokens — Pixel-Perfect Reference

> Extracted from design reference images and project README.
> Sketch URL: https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667
>
> **Note:** Sketch files require authentication and load dynamically. Tokens were derived from the provided design screenshots and the fe-take-home-challenge tokens referenced in the README.

## Colors

### Primary
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#5659FF` | NAOLOGIC logo, Create/Save button, active states |
| `--color-primary-dark` | `#3E40DB` | Button hover |
| `--color-primary-light` | `#AAAFFF` | Row hover tint, current day line, borders |

### Status (Work Order Bars & Badges)
| Status | Bar Background | Badge BG | Badge Text |
|--------|----------------|----------|------------|
| Open | `#E3F2FD` (blue 25%) | `#4A90E2` | `#FFFFFF` |
| In Progress | `#E8E6FA` | `#7B61FF` / `#8B7FC7` | `#FFFFFF` |
| Complete | `#E6FAE6` | `#4CAF50` | `#FFFFFF` |
| Blocked | `#FFF3E0` | `#FF9800` | `#FFFFFF` or `#333` |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#030929` | Titles, work center names, bar labels |
| `--color-text-labels` | `#687196` | Column headers, form labels |
| `--color-text-disabled` | `#D8DCEB` | Placeholders |

### UI
| Token | Value | Usage |
|-------|-------|-------|
| `--color-stroke` | `#F0F1F5` | Borders, grid lines |
| `--color-bg-page` | `#F7F7F9` | Page background |
| `--color-bg-row-hover` | `#F4F5FF` | Row hover state |
| `--color-current-day` | `#8B7FC7` | Current day vertical line |

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Logo | Circular Std | 14px | 600 |
| Title | Circular Std | 28px | 700 |
| Work Center names | Circular Std | 14px | 400 |
| Column headers | Circular Std | 12px | 600 |
| Bar name | Circular Std | 13px | 500 |
| Status badge | Circular Std | 11px | 600 |
| Panel title | Circular Std | 20px | 700 |
| Panel subtitle | Circular Std | 14px | 400 |
| Form labels | Circular Std | 14px | 500 |

## Layout (px)

| Token | Value |
|-------|-------|
| `--timeline-left-width` | 220px |
| `--timeline-row-height` | 52px |
| `--timeline-header-height` | 44px |
| `--timeline-container-padding` | 24px |
| `--panel-width` | 400px |
| `--panel-header-padding` | 24px |
| `--panel-form-padding` | 24px |

## Spacing

| Element | Padding |
|---------|---------|
| Left panel header | 0 16px |
| Row label | 0 16px |
| Column header | 0 8px |
| Work order bar | 0 8px 0 12px (right, left) |
| Bar vertical | top: 6px, height: calc(100% - 12px) |
| Status badge | 2px 8px |
| Form group | margin-bottom: 20px |
| Form label | margin-bottom: 6px |

## Border Radius

| Element | Value |
|---------|-------|
| Timeline body | 12px |
| Work order bar | 8px |
| Status badge | 12px |
| Form inputs | 8px |
| Buttons | 8px |
| Panel | 0 (sharp edges from right) |

## Shadows

| Token | Value |
|-------|-------|
| Panel | `-4px 0 24px rgba(0, 0, 0, 0.15)` |
| Dropdown | `0 2px 8px rgba(0, 0, 0, 0.1)` |

## Current Day/Month Indicator

- Line: 2px width, `#8B7FC7` or `#AAAFFF`
- Label: 10px, `#687196`, above the line
- Badge (Month view): pill-shaped, `#D9F7BE` background
