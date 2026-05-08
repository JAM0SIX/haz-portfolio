# Haz. — Portfolio Design System

> A lightweight, dev-ready reference for the visual language of Haz. portfolio components.
> Single source of truth. When in doubt, this file wins.

**Version** 0.1 · **Last updated** 2026-05-04
**Aesthetic** Minimal, technical, instrument-like. Warm paper + ink + a single accent.
**Use** Drop the tokens block straight into a stylesheet. Use the component patterns as the canonical recipes.

---

## 1. Foundations

### 1.1 Color

The system runs on **three surfaces, one ink, one accent** — nothing else. Every grey on screen is `ink` at an alpha, never a separate color value.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F5F3EE` | Default page background. Every screen starts here. |
| `--paper-deep` | `#ECEAE3` | Recessed surface — bottom of gradient floors, embossed/inset elements, "below" the page. |
| `--ink-panel` | `#1A1815` | Dominant dark surface — modals, menu panels, footer bands. Pairs with paper-colored text on top. |
| `--ink` | `#1A1815` | Primary text and stroke color. The same hex as `ink-panel` by design — type on dark inverts to `paper`. |
| `--accent` | `#C2410C` | Single accent. Used sparingly — primary CTAs, active indicators, focused state markers. |

#### Ink alphas (greys)

There is no separate "grey" palette. All greys are `ink` at five fixed opacities. Pick the closest — never invent a new alpha.

| Token | Value | Use |
|---|---|---|
| `--ink-12` | `rgba(26, 24, 21, 0.12)` | Hairline rules, subtle borders, dot-field background dots |
| `--ink-22` | `rgba(26, 24, 21, 0.22)` | Card borders, dashed dividers, secondary tick marks |
| `--ink-42` | `rgba(26, 24, 21, 0.42)` | Muted icons, disabled state borders |
| `--ink-62` | `rgba(26, 24, 21, 0.62)` | Secondary text — captions, metadata, labels |
| `--ink-82` | `rgba(26, 24, 21, 0.82)` | Body text on subdued surfaces |

> **Note:** The previous components used 14 different black-alpha values. They all collapse cleanly to one of the five above.

#### Accent alphas + states

| Token | Value | Use |
|---|---|---|
| `--accent` | `#C2410C` | Default — borders, fills, indicators |
| `--accent-hover` | `#A8380A` | Hover state — ~6% darker burnt orange. Used on primary fill and tertiary border/text |
| `--accent-soft` | `rgba(194, 65, 12, 0.18)` | Selection highlights, focus glows |

#### Ink hover

| Token | Value | Use |
|---|---|---|
| `--ink-hover` | `#2A2722` | Secondary button fill on hover — ~6% lifted, paper-tinted dark |

---

### 1.2 Typography

Two fonts. **Sora** does all the work. **Apple Garamond** is reserved for H1 section headings and is always bold.

```css
--font-sans: "Sora", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
--font-heading: "Apple Garamond", "Garamond", "Times New Roman", serif;
```

Load locally with `next/font/local` in `src/app/layout.tsx`.

#### Type scale

A 9-step scale. No half-steps, no off-rhythm sizes. If a size isn't on this list, don't use it.

| Token | px | Role |
|---|---|---|
| `--text-2xs` | 10 | Caps labels, technical readouts (P/01, coordinates) |
| `--text-xs` | 11 | Button labels, small metadata |
| `--text-sm` | 12 | Captions, secondary text |
| `--text-base` | 14 | Body text |
| `--text-md` | 16 | Emphasized body |
| `--text-lg` | 20 | Card titles, section headings |
| `--text-xl` | 28 | Page titles, active heading |
| `--text-2xl` | 44 | Detail panel title |
| `--text-hero` | 64 | Hero header (H1 only) |

#### Font weights

| Token | Weight |
|---|---|
| `--weight-regular` | 400 |
| `--weight-medium` | 500 |
| `--weight-semibold` | 600 |
| `--weight-bold` | 700 |

#### Letter-spacing

Five tracking values — that's it.

| Token | Value | Use |
|---|---|---|
| `--track-tight` | -0.02em | Display sizes (`xl` and up) |
| `--track-normal` | 0 | Body and most UI |
| `--track-wide` | 0.04em | Mid-size titles |
| `--track-caps` | 0.16em | Uppercase labels, button text |
| `--track-caps-wide` | 0.22em | Spaced-out caps for technical readouts ("P/01 · ACTIVE") |

#### Line-height

| Token | Value | Use |
|---|---|---|
| `--leading-tight` | 1 | Display headings, single-line labels |
| `--leading-snug` | 1.15 | Card titles, multi-line headings |
| `--leading-normal` | 1.5 | Body text |
| `--leading-relaxed` | 1.6 | Long-form prose |

#### Type roles (recipes)

These are the named compositions you reach for. Match the recipe — don't recompose from scratch.

| Role | Font | Size | Weight | Tracking | Transform |
|---|---|---|---|---|---|
| **Hero (H1 only)** | Apple Garamond | 64 | 700 | -0.02em | none |
| **Display** | Sora | 44 | 600 | -0.02em | none |
| **Title** | Sora | 28 | 600 | 0.04em | none |
| **Heading** | Sora | 20 | 500 | 0.02em | none |
| **Body** | Sora | 14 | 400 | 0 | none |
| **Caption** | Sora | 12 | 400 | 0 | none |
| **Label / Caps** | Sora | 11 | 500 | 0.16em | UPPERCASE |
| **Technical** | Sora | 10 | 500 | 0.22em | UPPERCASE |
| **Editorial body** | Sora | 14 | 400 | 0 | none |

---

### 1.3 Spacing

A 4px-based scale. Pick the closest step — don't invent.

| Token | px | Common use |
|---|---|---|
| `--space-1` | 4 | Tight gaps, icon padding |
| `--space-2` | 8 | Button-internal gap, small stack gap |
| `--space-3` | 12 | Default gap between related elements |
| `--space-4` | 16 | Button padding-x, card-internal gap |
| `--space-5` | 22 | Section margin |
| `--space-6` | 28 | Card padding |
| `--space-7` | 36 | Section padding |
| `--space-8` | 44 | Major section gap |
| `--space-9` | 64 | Page padding (desktop) |

---

### 1.4 Borders & corners

The system is **hard-cornered**. No rounded radii anywhere except circular elements (dots, indicators, profile shapes).

| Token | Value | Use |
|---|---|---|
| `--radius-none` | 0 | Default — buttons, cards, panels |
| `--radius-full` | 50% | Dots, status indicators, circular crops |

**Border widths.** Three values only.

| Token | Value | Use |
|---|---|---|
| `--border-hairline` | 0.5px | Internal grids, ticks, fine technical detail |
| `--border-default` | 1px | Default — buttons, cards, dividers |
| `--border-emphasis` | 1.5px | Active states, focused borders |

#### Chamfer (signature hover treatment)

On hover, interactive elements get their **top-left and bottom-right corners cut on a 45° diagonal**. This is the system's signature interaction — distinctive, technical, and consistent across every clickable surface.

```css
--chamfer-size: 8px;
```

The full hover treatment is defined in **§ 2.1 Buttons** because it composes with text weight, color shift, and child-element motion. The chamfer alone is just one piece — never apply it in isolation to a button.

> Apply to: buttons, nav arrows, cards on hover, any clickable surface where the affordance benefits from a state change. Do **not** apply to dots, circular indicators, or text links.

---

### 1.5 Motion

Three easings. One is dominant. Don't reach for new ones.

| Token | Value | Use |
|---|---|---|
| `--ease-default` | `cubic-bezier(0.32, 0.72, 0.32, 1)` | Default — almost everything |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Quick, snappy reveals (menu rows, panel entries) |
| `--ease-soft` | `cubic-bezier(0.22, 0.8, 0.2, 1)` | Carousel, slow positional changes |

| Token | Duration | Use |
|---|---|---|
| `--dur-fast` | 150ms | Color/border transitions on hover |
| `--dur-base` | 250ms | Standard hover/state changes |
| `--dur-slow` | 450ms | Layout transitions, slide-ins |
| `--dur-slower` | 650ms | Major reveals (panel open, accordion) |

---

## 2. Components

### 2.1 Buttons

Three tiers. Always use the right tier for the situation. **Never mix the styles** — a "primary-but-with-border" doesn't exist in this system.

#### Canonical anatomy (all tiers share these)

Every text button — primary, secondary, tertiary — has the **exact same dimensions, type, and content pattern**. Only the colors differ between tiers. This is non-negotiable; if you find yourself wanting a different padding or a different font size, use a different component, not a tweaked button.

| Property | Value |
|---|---|
| Display | `inline-flex`, `align-items: center`, `justify-content: center` |
| Padding | `10px 16px` |
| Gap (between content children) | `12px` |
| Font | Sora, `11px`, weight `500` (rest) → `600` (hover), `0.16em` tracking, UPPERCASE, `line-height: 1` |
| Border | None (visual border drawn via two-layer fill technique — see below) |
| Corner | Hard at rest, chamfered (8px) on hover |

**Content pattern.** A button has at most two children: a label span and an optional trailing arrow.

```html
<button class="btn btn-primary">
  <span data-text="Label Text">Label Text</span>
  <span class="btn-arrow" aria-hidden>→</span>
</button>
```

- The label is **always** wrapped in a `<span>` with a `data-text` attribute matching its visible text — required for the ghost-width reservation that prevents the button from resizing on the weight bump.
- The arrow `<span class="btn-arrow">` is optional. When present, it slides right 3px on hover. Acceptable arrow glyphs: `→`, `↗`, `↘`. No other glyphs.
- **No internal divider lines.** No ornamental separators between label and arrow. No leading dots. No badges. The button is label + (optional) arrow. That's it.

**Sizing rule.** Buttons are content-sized (`inline-flex`). Never apply `width`, `min-width`, or `flex: 1` to a button to stretch it. If layout requires the button to anchor to one side of a grid cell, use `justify-self` on the cell, not width on the button.

#### Hover treatment (applies to all three tiers)

Every button gets the same composed hover behavior. The pieces below combine — they're not optional.

| Aspect | At rest | On hover |
|---|---|---|
| **Shape** | Hard rectangle | Chamfered (top-left + bottom-right cut on 45°, 8px) |
| **Outline** | 1px border, full rectangle | 1px border, **traces the chamfered shape** (no broken edges) |
| **Text weight** | 500 (medium) | 600 (semibold) |
| **Fill / border color** | `--accent` or `--ink` | `--accent-hover` or `--ink-hover` (shifted ~6%) |
| **Trailing arrow `→`** | Static | Slides right ~3px |
| **Duration** | — | 250ms `--ease-default` |

**The chamfered-outline technique.** Standard CSS `border` can't follow a `clip-path` — clipping cuts the border too, leaving open edges. The system uses a **two-layer fill technique** so the outline follows the chamfer perfectly:

- **Outer element** (`.btn`) is filled with the *border color*. It's the one that gets `clip-path` applied.
- **Inner element** (`.btn::before` or wrapper) sits inset by 1px on all sides, also chamfered (with `--chamfer-size - 1px`), and filled with the *actual button background* (accent, ink, or transparent for tertiary).
- The visible 1px gap between outer and inner *is* the border — and because both elements share the same chamfer shape, the outline follows the cut corners cleanly.

**Animating the chamfer.** CSS can only interpolate `clip-path: polygon(...)` between two polygons that have **the same vertex count**. A 4-point rest polygon and a 6-point hover polygon will snap instantly with no animation. To make the corner-cut animate smoothly:

- Both rest and hover polygons must have **6 points**.
- At rest, the two "cut" vertices are placed *at the corner positions* (e.g., both at `0 0` for the top-left, both at `100% 100%` for the bottom-right). Visually no corner is cut.
- On hover, those vertices move inward by `--chamfer-size`. Visually the corners cut on a 45° diagonal.

Rest: `polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0)`
Hover: `polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)`

This is the **only** way to get a smoothly animated chamfer. Always use 6-point polygons for both states.

**Preventing layout shift from the weight bump.** When text shifts from weight 500 to 600 on hover, the bolder glyphs are slightly wider — the button visibly grows. To stop this, each text-bearing `<span>` inside a button reserves the bold-state width upfront via a hidden ghost element rendered at weight 600.

```css
.btn > span:not(.btn-arrow) {
  position: relative;
  display: inline-block;
}
.btn > span:not(.btn-arrow)::before {
  content: attr(data-text);
  display: block;
  height: 0;
  overflow: hidden;
  visibility: hidden;
  font-weight: 600;
}
```

Then in markup, every text span needs a `data-text` attribute matching the visible text:

```html
<button class="btn btn-primary">
  <span data-text="Open Project">Open Project</span>
  <span class="btn-arrow" aria-hidden>→</span>
</button>
```

The ghost `::before` sets the slot width at the bold size; the visible text fills in below at whatever weight is currently active. Hover swaps weight 500 ↔ 600 without changing layout.

```css
:root {
  --chamfer-size: 8px;
  --chamfer-inner: 7px; /* chamfer-size minus 1px border */
}

/* Shared button base */
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 16px;
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--track-caps);
  line-height: 1;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  background: transparent; /* set per tier below */
  /* outer layer = border color when filled. Clip-path cuts the corners. */
  clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
  transition:
    clip-path var(--dur-base) var(--ease-default),
    background-color var(--dur-base) var(--ease-default),
    color var(--dur-base) var(--ease-default),
    font-weight var(--dur-base) var(--ease-default);
}
.btn:hover:not(:disabled) {
  font-weight: var(--weight-semibold);
  clip-path: polygon(
    var(--chamfer-size) 0,
    100% 0,
    100% calc(100% - var(--chamfer-size)),
    calc(100% - var(--chamfer-size)) 100%,
    0 100%,
    0 var(--chamfer-size)
  );
}

/* Inner layer — drawn with ::before, sits 1px inset, also chamfered */
.btn::before {
  content: "";
  position: absolute;
  inset: 1px;
  z-index: 0;
  background: inherit; /* overridden per tier */
  clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
  transition:
    clip-path var(--dur-base) var(--ease-default),
    background-color var(--dur-base) var(--ease-default);
}
.btn:hover:not(:disabled)::before {
  clip-path: polygon(
    var(--chamfer-inner) 0,
    100% 0,
    100% calc(100% - var(--chamfer-inner)),
    calc(100% - var(--chamfer-inner)) 100%,
    0 100%,
    0 var(--chamfer-inner)
  );
}

/* Button content sits on top of the ::before fill layer */
.btn > * { position: relative; z-index: 1; }
```

#### Primary — accent fill

The strongest call-to-action on the page. Used for the single most important action (Open Project, Submit, Continue).

```css
.btn-primary {
  /* outer = border color (= accent). Inner ::before = accent fill. */
  background: var(--accent);
  color: var(--paper);
}
.btn-primary::before { background: var(--accent); }

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
}
.btn-primary:hover:not(:disabled)::before { background: var(--accent-hover); }
```

#### Secondary — ink fill

A strong but neutral action. Used when you need weight without drawing the eye to the accent.

```css
.btn-secondary {
  background: var(--ink);
  color: var(--paper);
}
.btn-secondary::before { background: var(--ink); }

.btn-secondary:hover:not(:disabled) {
  background: var(--ink-hover);
}
.btn-secondary:hover:not(:disabled)::before { background: var(--ink-hover); }
```

#### Tertiary — accent border, transparent fill

Lower-emphasis interactive surface. Used for inline CTAs alongside other actions.

```css
.btn-tertiary {
  /* outer = accent (the visible border). Inner ::before = transparent. */
  background: var(--accent);
  color: var(--accent);
}
.btn-tertiary::before { background: var(--paper); }

.btn-tertiary:hover:not(:disabled) {
  background: var(--accent-hover);
  color: var(--accent-hover);
}
/* inner ::before stays paper — only the outline shifts */
```

> **Note on tertiary on dark surfaces:** if a tertiary button sits on `--ink-panel`, the `::before` fill should be `var(--ink-panel)` instead of `var(--paper)` so the inside still reads transparent against the panel. The principle: inner `::before` always matches the surface behind the button.

#### Trailing arrow

The arrow slides 3px to the right on hover. It sits inside the button and reacts to its `:hover` state.

```css
.btn-arrow {
  display: inline-block;
  transition: transform var(--dur-base) var(--ease-default);
}
.btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(3px);
}
```

#### Disabled state (any tier)

```css
.btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.btn:disabled:hover {
  /* no chamfer, no weight bump, no color shift */
  clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
  font-weight: var(--weight-medium);
}
.btn:disabled:hover::before {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
}
.btn:disabled:hover .btn-arrow { transform: translateX(0); }
```

#### Usage

```html
<button class="btn btn-primary">
  <span>Open Project</span>
  <span class="btn-arrow" aria-hidden>→</span>
</button>
```

#### Icon-only button (nav arrows, close, etc.)

The canonical icon button: **accent border, accent icon at rest.** Hover shifts to `--accent-hover` and the chamfer animates in. Disabled state is the same colors at 35% opacity. No text, no dot, no arrow — just the SVG icon and the chamfer + color shift on hover.

| State | Border (outer) | Icon color | Inner ::before |
|---|---|---|---|
| **Rest** | `--accent` | `--accent` | `--paper` (or surface color) |
| **Hover** | `--accent-hover` | `--accent-hover` | `--paper` (unchanged) + chamfered |
| **Disabled** | `--accent` at 35% | `--accent` at 35% | `--paper` (unchanged) |

Three standard sizes — all square. Pick the closest. Don't invent custom dimensions.

| Modifier | Size | Use |
|---|---|---|
| `.btn-icon-sm` | 28×28 | Inline / compact UI — paired with text or alongside other small controls |
| `.btn-icon-md` | 40×40 | Default — primary navigation, carousel arrows, mobile-friendly touch targets |
| `.btn-icon-lg` | 48×48 | Prominent / standalone — feature controls, hero-area navigation |

```css
.btn-icon-sm { width: 28px; height: 28px; }
.btn-icon-md { width: 40px; height: 40px; }
.btn-icon-lg { width: 48px; height: 48px; }
```

The visual treatment (accent border, chamfer hover, color shift) stays the same at every size.

```css
.btn-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--accent); /* outer = border color */
  color: var(--accent);
  cursor: pointer;
  border: none;
  padding: 0;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
  transition:
    background-color var(--dur-base) var(--ease-default),
    color var(--dur-base) var(--ease-default),
    clip-path var(--dur-base) var(--ease-default);
}
.btn-icon::before {
  content: "";
  position: absolute;
  inset: 1px;
  background: var(--paper);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
  transition: clip-path var(--dur-base) var(--ease-default);
}
.btn-icon > svg { position: relative; z-index: 1; }

.btn-icon:hover:not(:disabled) {
  background: var(--accent-hover);
  color: var(--accent-hover);
  clip-path: polygon(
    var(--chamfer-size) 0, 100% 0,
    100% calc(100% - var(--chamfer-size)),
    calc(100% - var(--chamfer-size)) 100%,
    0 100%, 0 var(--chamfer-size)
  );
}
.btn-icon:hover:not(:disabled)::before {
  clip-path: polygon(
    var(--chamfer-inner) 0, 100% 0,
    100% calc(100% - var(--chamfer-inner)),
    calc(100% - var(--chamfer-inner)) 100%,
    0 100%, 0 var(--chamfer-inner)
  );
}

.btn-icon:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
```

> **Note on tertiary/icon on dark surfaces:** if an icon button sits on `--ink-panel`, the `::before` fill should be `--ink-panel` instead of `--paper` so the inside still reads transparent against the panel.

---

### 2.2 Surfaces

| Component | Surface | Border |
|---|---|---|
| Page (default) | `--paper` | — |
| Page (with depth) | linear-gradient `--paper` → `--paper-deep` | — |
| Card on paper | `--paper` | `1px solid var(--ink-22)` |
| Recessed panel | `--paper-deep` | optional `1px solid var(--ink-12)` |
| Modal / floating panel | `--paper` | `1px solid var(--ink-22)` |
| Dark menu / overlay | `--ink-panel` | none, or `1px solid var(--ink)` |
| Modal backdrop | `rgba(245, 243, 238, 0.92)` + `backdrop-filter: blur(2px)` | — |

---

### 2.3 Indicators & dots

The "active dot" pattern is core to the system — it appears next to active items, in mini-maps, and as button leaders.

```css
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.dot--active   { background: var(--accent); }
.dot--inactive { background: transparent; border: 1px solid var(--ink-42); }
.dot--ink      { background: var(--ink); }
```

---

### 2.4 Dividers

| Style | Use |
|---|---|
| `border-top: 1px solid var(--ink-22)` | Default section divider |
| `border-top: 1px dashed var(--ink-22)` | Inline metric divider, in-card divider |
| `width: 1px; height: 12px; background: var(--ink-22)` | Inline vertical separator (topbar) |

---

## 3. Tokens — drop-in CSS

Paste this block at the top of your stylesheet (or into a `:root` declaration).

```css
:root {
  /* ─── Surfaces ─── */
  --paper: #F5F3EE;
  --paper-deep: #ECEAE3;
  --ink-panel: #1A1815;

  /* ─── Ink ─── */
  --ink: #1A1815;
  --ink-hover: #2A2722;
  --ink-12: rgba(26, 24, 21, 0.12);
  --ink-22: rgba(26, 24, 21, 0.22);
  --ink-42: rgba(26, 24, 21, 0.42);
  --ink-62: rgba(26, 24, 21, 0.62);
  --ink-82: rgba(26, 24, 21, 0.82);

  /* ─── Accent ─── */
  --accent: #C2410C;
  --accent-hover: #A8380A;
  --accent-soft: rgba(194, 65, 12, 0.18);

  /* ─── Typography ─── */
  --font-sans: "Sora", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-heading: "Apple Garamond", "Garamond", "Times New Roman", serif;

  --text-2xs: 10px;
  --text-xs: 11px;
  --text-sm: 12px;
  --text-base: 14px;
  --text-md: 16px;
  --text-lg: 20px;
  --text-xl: 28px;
  --text-2xl: 44px;
  --text-hero: 64px;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  --track-tight: -0.02em;
  --track-normal: 0;
  --track-wide: 0.04em;
  --track-caps: 0.16em;
  --track-caps-wide: 0.22em;

  --leading-tight: 1;
  --leading-snug: 1.15;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;

  /* ─── Spacing ─── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 22px;
  --space-6: 28px;
  --space-7: 36px;
  --space-8: 44px;
  --space-9: 64px;

  /* ─── Borders & corners ─── */
  --radius-none: 0;
  --radius-full: 50%;

  --border-hairline: 0.5px;
  --border-default: 1px;
  --border-emphasis: 1.5px;

  --chamfer-size: 8px;
  --chamfer-inner: 7px; /* chamfer-size - 1px border */

  /* ─── Motion ─── */
  --ease-default: cubic-bezier(0.32, 0.72, 0.32, 1);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-soft: cubic-bezier(0.22, 0.8, 0.2, 1);

  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 450ms;
  --dur-slower: 650ms;
}

/* ─── Base ─── */
html, body {
  margin: 0;
  padding: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
}
::selection { background: var(--accent-soft); }
```

---

## 4. Migration notes — what changes in existing components

A short list of what to update when refactoring the four existing files against this system.

**Portfolio Dial.html**
- Background `#f5f3ee` → `var(--paper)` ✓ (already correct)
- Text `#1a1815` → `var(--ink)` (rename only)
- Replace all `rgba(0,0,0,.X)` with the closest `--ink-XX` token
- Swap `JetBrains Mono` for `var(--font-sans)` (Sora) globally
- "View Project" CTA → repromote to `.btn-primary` (currently uses accent border = tertiary; this CTA is the primary action of the active card)
- "Open Case · ↗" → `.btn-secondary` (already correct pattern, just retoken)
- "Back · Esc" → `.btn-icon` style
- Add chamfer hover to all buttons + nav arrows
- Remove the tiny 4px border-radius nudges on nav arrows → 0

**BookLog Carousel.html**
- `--bg` → `--paper` (rename)
- `--bg-deep` → `--paper-deep`
- `--ink` → `--ink` (already aligned)
- `--accent: #1A1916` → `--accent: #C2410C` (currently mis-named — accent was just ink)
- `.cta` "Open Article" → `.btn-secondary` (it's an ink fill, not accent)
- `.navbtn` → `.btn-icon`
- Swap `JetBrains Mono` for Sora
- Use Sora for `.cover-title` and `.preview-title` (Spectral is no longer used)
- Add chamfer hover to `.cta`, `.navbtn`, `.card`

**Subtle Hover.html**
- Background `#ffffff` → `var(--paper)` (this is the only file using pure white)
- Update label font from system sans to Sora
- The "Hello" reveal text — change from Inter 700 to **Apple Garamond 700** when it is an H1 heading

**Menu.tsx**
- `panelColor` default `#0F0F10` → `#1A1815` (var(--ink-panel))
- `contrastColor` default `#F4F6F6` → `#F5F3EE` (var(--paper))
- `accentColor` default `#FFFFFF` → `#C2410C` (var(--accent)) — finally gives the menu a real accent
- `mutedColor` default `#6B6B70` → match `--ink-42` brightness on dark (`rgba(245,243,238,0.42)` for paper-on-ink-panel context)
- `fontFamily` default `Inter, system-ui` → `Sora, ui-sans-serif, system-ui`
- Border radii `14px` (icon) and `22px` (panel) → **0 for both** (system is hard-cornered)
- Add chamfer hover to the panel border on icon hover (replaces the soft radius signature)

---

## 5. Don'ts

- **Don't** introduce a new color. Every grey is `--ink-XX`. Every tint of paper is one of the three surfaces.
- **Don't** mix accent into secondary buttons or vice-versa. The three button tiers are non-negotiable.
- **Don't** use Apple Garamond outside H1 section headings.
- **Don't** use border-radius. The chamfer is the only corner treatment.
- **Don't** invent a font size between scale steps. Use the closest one.
- **Don't** use pure white (`#FFFFFF`) or pure black (`#000000`). Always paper and ink.

---

*This is a living document. When a new component genuinely needs a token that doesn't exist, add it here first — then build the component. Components don't get to define tokens.*
