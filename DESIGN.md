---
name: BChecker
description: A CPU and GPU bottleneck estimator set as a stamped laboratory test report on a paper sheet lying on a teal desk.
colors:
  desk: "#1b4742"
  desk-lit: "#2f675e"
  paper: "#e4eae1"
  paper-bright: "#edf2e9"
  paper-shade: "#dde5da"
  panel: "#eef2e9"
  field: "#fbfcf8"
  under-sheet: "#cdd7c9"
  rule: "#a9b8ac"
  ink: "#12312e"
  ink-muted: "#47605c"
  teal-ink: "#0e6b63"
  paper-white: "#f3f6ee"
  amber-stamp: "#955700"
  red-stamp: "#b3301a"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.25rem, 8.5vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.45
  typed:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  sheet: "3px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-white}"
    rounded: "0px"
    padding: "12px 48px"
  button-primary-hover:
    backgroundColor: "{colors.teal-ink}"
  button-primary-disabled:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.ink}"
  entry:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "0px"
    padding: "8px 12px"
  entry-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-white}"
  section-tab:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-white}"
    height: "32px"
---

# Design System: BChecker

## Overview

**Creative North Star: "The Stamped Test Report"**

BChecker is a laboratory test report you fill in and get stamped. The whole page is one sheet of cool security paper lying on a deep teal desk, with a second sheet turned slightly beneath it. Everything on the sheet is printed in teal-black ink: lettered sections, ruled form boxes, typed entries, a graduated scale, and, once a test has run, a red rubber stamp carrying the verdict. The page refuses both of the looks it replaced: the near-black neon HUD, and the generic white-card calculator.

Depth belongs to the page, not to its parts. The sheet and the desk are the only elevated surfaces. Inside the sheet the print is flat, as printed forms are. The system is a light, daytime-desk world; there is no dark mode.

**Key Characteristics:**
- One paper sheet on a desk, one cast shadow, a second sheet visible beneath.
- Ink-on-paper contrast: selected means ink fill with paper text, never a glow.
- Two voices only: forms lettering (Barlow Condensed) and typed entries (Courier Prime).
- Sections lettered A to G as a real sequence, as on a printed form.
- A graduated caliper scale and a red stamp carry the result, not a dashboard meter.

## Colors

A restrained, committed palette: one cool paper family, one teal-black ink, a teal accent, and two stamp colours reserved for verdicts.

### Primary
- **Teal Ink** (#0e6b63): the accent. Links on hover, the "balanced" stamp, the low-severity scale fill, the guilloche and seal linework, focus rings.

### Secondary
- **Stamp Red** (#b3301a): the verdict stamp for "Upgrade CPU/GPU", the high-severity scale fill and error text. It appears on a result, never on chrome.
- **Amber Stamp** (#955700): the mid-severity scale fill and the "Low sample" chip.

### Neutral
- **Desk Teal** (#1b4742, lit to #2f675e at the top): the surface the sheet lies on. Never used inside the sheet.
- **Paper** (#e4eae1) with **Paper Bright** (#edf2e9) and **Paper Shade** (#dde5da): the sheet's body, lit from above as a vertical gradient.
- **Under Sheet** (#cdd7c9): the second sheet beneath the report.
- **Panel** (#eef2e9): pre-printed form areas. **Field** (#fbfcf8): boxes the visitor fills in or reads typed values from.
- **Rule** (#a9b8ac): hairline dividers and the unfilled part of bars.
- **Ink** (#12312e): all text, thick rules and selected states. **Ink Muted** (#47605c): secondary text. **Paper White** (#f3f6ee): text on ink.

### Named Rules
**The Ink Inversion Rule.** A selected entry is ink fill with paper-white text. Selection is never expressed with a glow, a tint or a colour change alone.

**The Stamp Colour Rule.** Red and amber belong to results (stamp, scale fill, remarks). They are not used for buttons, links or decoration.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow, sans-serif)
**Body Font:** Barlow Condensed
**Label/Mono Font:** Courier Prime, used only as typed entry: scores, readings, report numbers, field values.

**Character:** a condensed industrial forms face set large and tight against a typewriter voice for anything that was "filled in". The pairing is the paper form and the typed data on it.

### Hierarchy
- **Display** (700, clamp(3.25rem, 8.5vw, 6rem), 0.95): the page title only. Balanced wrapping, 16ch measure.
- **Headline** (700, 1.875 to 2.25rem): lettered section titles (A to G).
- **Title** (700, 1.5rem): sub-headings inside a section (Readings, Known limits, Remarks).
- **Body** (400, 1.1875rem, 1.45): prose, kept to about 62ch.
- **Typed** (Courier Prime 400/700, 0.875 to 1rem): every filled-in value.
- **Label** (600, 0.875rem, 0.12em, uppercase): field legends on the form only (A1, B2 ...).

### Named Rules
**The Two Voices Rule.** Forms lettering for what the report says; typewriter for what was entered. Typewriter is never used as a costume for "technical" copy.

**The Legend-Only Rule.** Tracked uppercase labels exist only as form field legends. Headings are real headings; no small caption sits above a heading.

## Layout

A single centred sheet, max 72rem wide, with 16px gutters on phones and 32px on desktop, set on a desk with 8px (phone) to 24px (desktop) of visible desk at the sides. Content flows top to bottom as one report: masthead, title and report details, then the form (A, B, C), the result (D), the method (E), traceability (F) and authorisation (G).

The form is two columns for the CPU and GPU pickers from 1024px and a single column below. The Analyze row is sticky to the bottom of the form so the primary action never leaves the screen. Section rhythm is generous (48 to 112px between sections) with tight groups (8 to 12px) inside them. Lists scroll inside a 15rem region; tables scroll horizontally inside labelled regions on narrow screens.

## Elevation & Depth

Hybrid: depth is carried by two cast shadows at page level and by ink rules inside the sheet. Inside the sheet nothing is embossed, bevelled or recessed.

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 2px 4px rgb(0 0 0 / 0.25), 0 36px 60px -24px rgb(0 0 0 / 0.6)`): the report sheet resting on the desk.
- **Under sheet** (`box-shadow: 0 2px 4px rgb(0 0 0 / 0.2), 0 28px 44px -22px rgb(0 0 0 / 0.55)`): the second sheet beneath.
- **Raised button** (`box-shadow: 0 10px 18px -8px rgb(18 49 46 / 0.7)`): the primary action standing proud of the paper; pressed state drops to `0 3px 6px -3px` and moves 2px down.

### Named Rules
**The Cast Shadow Rule.** Every shadow has an offset and a blur and is cast onto paper or desk. No glow, no inset, no hard offset, no border-plus-shadow pairing.

**The Flat Print Rule.** Anything printed on the sheet (boxes, tables, tabs, scales) is flat ink. Depth is not added to individual boxes.

## Shapes

Printed geometry: square corners everywhere except the sheet itself (3px). Boxes are 1.5px ink outlines; form areas and section heads use 2px rules. The recurring silhouettes are the lettered square tab, the ruled rectangle, the rosette seal (twelve rotated ellipses in two rings), and the guilloche band (eight phase-shifted sine waves). The verdict stamp is a rotated (-4deg) double-ruled rectangle.

## Components

### Buttons
- **Shape:** square, no radius.
- **Primary (Analyze):** ink fill (#12312e), paper-white text, 12px 48px padding, uppercase at 0.18em tracking. Disabled: Rule fill with ink text.
- **Hover / Focus:** fill shifts to Teal Ink; pressed moves 2px down. Focus is a 3px Teal Ink outline offset 2px.
- **Secondary:** vendor filter chips are bordered boxes that invert to ink fill when pressed.

### Chips
- **Style:** 1.5px ink outline on Field, uppercase 0.875rem.
- **State:** pressed (`aria-pressed`) inverts to ink fill with paper-white text.

### Cards / Containers
- **Sheet:** Panel fill with a 2px ink border for form areas and results; a result sheet opens with a full-width ink bar carrying its letter, title and report number.
- **Shadow Strategy:** none inside the page sheet; see Elevation.
- **Internal Padding:** 20px on phones, 32px from 640px.

### Inputs / Fields
- **Style:** Field fill, 1.5px ink outline, no radius, typed (Courier Prime) text; placeholder in Ink Muted.
- **Focus:** the global 3px Teal Ink outline. Rows in the scrolling picker use an inset outline so the list does not clip it.
- **Selection:** radio groups are native inputs; the visible control is a tile or row that inverts to ink fill with a drawn tick.

### Navigation
- Two underlined text links in the masthead (Method, Sources and limits), 1.125rem, underline in Ink Muted turning to ink on hover. A skip link jumps to the main content.

### Result Scale (signature)
A caliper-style scale: ticks every 1% (longer every 5%, longest at 0, 25, 50, 75, 100), numerals at true positions, a 16px fill bar in the severity colour and a diamond pointer at the value. It has `role="meter"`; the ticks and numerals are decoration.

### Verdict Stamp (signature)
Rotated double-ruled rectangle in condensed uppercase, 2 to 3.5rem, in Stamp Red (needs upgrade) or Teal Ink (balanced), multiplied onto the paper. The single authored motion: it lands with a 340ms ease-out scale-down. Reduced motion removes all animation.

## Do's and Don'ts

### Do:
- **Do** keep every elevated surface to the sheet, the under-sheet and the primary button, each with an offset and blur.
- **Do** express selection as an ink fill with paper-white text.
- **Do** set filled-in values in Courier Prime and everything else in Barlow Condensed.
- **Do** continue the lettered sequence (A to G) when adding a section, with the shared section heading.
- **Do** keep component classes (`.paper`, `.sheet`, `.entry`, `.btn-primary`, `.stamp`, `.tab`) inside `@layer components` so utilities can override them.

### Don't:
- **Don't** return to the near-black neon-green HUD, corner brackets or a grid backdrop (the rejected anti-reference).
- **Don't** add inset shadows, bevels or glows to printed boxes; the sheet is flat print.
- **Don't** use red or amber for chrome, links or decoration.
- **Don't** place a tracked small-caps caption above a heading; legends belong to form fields only.
- **Don't** add grain or paper-fibre imitations; the paper is a flat gradient and the texture is the guilloche and seal geometry.
- **Don't** introduce a dark theme without reconsidering the world: the page is a daytime desk.
