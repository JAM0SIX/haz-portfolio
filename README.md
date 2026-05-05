# Haz. — Portfolio

A minimal, technical, instrument-like portfolio. Next.js 16 (App Router) + TypeScript, plain CSS + CSS Modules, Framer Motion for non-trivial animation work.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
.
├── DESIGN-SYSTEM.md            Canonical design reference. When in doubt, this wins.
├── src/
│   ├── app/
│   │   ├── layout.tsx          Root layout — fonts (next/font), metadata
│   │   ├── page.tsx            Home — replace as feature components arrive
│   │   ├── globals.css         Imports the three system stylesheets in cascade order
│   │   └── page.module.css     Home-only styles
│   ├── styles/
│   │   ├── tokens.css          :root design tokens + base reset (DESIGN-SYSTEM.md §3)
│   │   ├── typography.css      .type-* role recipes (DESIGN-SYSTEM.md §1.2)
│   │   └── buttons.css         .btn / .btn-icon system (DESIGN-SYSTEM.md §2.1)
│   ├── components/
│   │   └── ui/
│   │       └── Button.tsx      <Button> + <IconButton> primitives
│   └── lib/                    Utilities (empty)
└── public/                     Static assets
```

## Adding a new component

1. Create `src/components/<FeatureName>/<FeatureName>.tsx` and a sibling `.module.css` for component-scoped styles.
2. Reference design tokens via the CSS variables (`var(--paper)`, `var(--accent)`, `var(--space-4)`, etc.) — never hardcode colors or sizes.
3. Reach for the type recipe classes (`type-hero`, `type-body`, `type-label`...) on text elements. Don't recompose typography from scratch.
4. For interactive surfaces, reuse `<Button>` / `<IconButton>` from `@/components/ui/Button`. Don't reinvent the chamfer hover.

## Styling rules of thumb

- All greys are `--ink-XX` at one of five fixed alphas. Never invent a new alpha.
- All surfaces are `--paper`, `--paper-deep`, or `--ink-panel`. No pure white, no pure black.
- The chamfer hover is the only corner treatment. No `border-radius` except for circular dots.
- Spectral is hero/editorial only. DM Sans does the rest.

## Animation

- Hover micro-animations and CSS transitions live in `.css` files alongside their components.
- For scroll-driven reveals, page transitions, layout animations, or gestures, use `motion/react` (Framer Motion).

```tsx
"use client";
import { motion } from "motion/react";
```

## Deployment

GitHub repo connected to Vercel. Push to `main` → automatic production deploy.

```bash
git push                # auto-deploys via Vercel-GitHub integration
```

Local production build check:

```bash
npm run build
npm start
```
