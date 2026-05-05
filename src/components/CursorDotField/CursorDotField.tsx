"use client";

/* ─────────────────────────────────────────────────────────────
   CursorDotField — Haz.
   Cursor-tracked proximity-reveal dot field, scoped to its
   parent box.

   Behaviour:
     · A grid of small dots (default 32px spacing) is drawn on a
       <canvas>. Each dot's brightness and radius scale with its
       proximity to the cursor — within ~410px the dot pulls up
       toward a stronger value, with a power-curve falloff so
       the edge of the field reads as a soft halo rather than a
       hard circle.
     · While the user is moving the cursor, the field tracks live.
       After ~2.5s of no input, the renderer falls into a gentle
       Lissajous drift so the surface stays alive for visitors
       who pause. (Suppressed entirely under
       `prefers-reduced-motion: reduce`.)
     · Pointer tracking happens on the window, but coordinates
       are computed relative to the backdrop's bounding rect —
       leaving the section snaps the focus back to "far away"
       so dots return to their baseline state.

   Variants:
     · `paper` — tuned for light surfaces (e.g. --paper, --paper-deep).
       Far-from-cursor dots sit near paper white at 5% alpha
       (subtle ambient texture); under-cursor dots resolve to a
       mid grey at 75% alpha for a soft ink reveal.
     · `ink` — tuned for dark surfaces (e.g. --ink-panel). The
       palette is inverted: far dots sit at a dim warm grey that
       barely separates from the bg, and under-cursor dots brighten
       toward paper-tone for a luminous reveal.

   Performance:
     · Canvas is sized to the backdrop's box via ResizeObserver,
       not window dimensions, so re-layouts (viewport changes,
       responsive 100vh adjustments) are tracked cleanly.
     · An IntersectionObserver short-circuits the RAF loop while
       the host section is scrolled out of view — no work runs
       while you browse the rest of the page.
     · The canvas itself is `pointer-events: none`, so it never
       intercepts clicks/taps meant for content layered above.
       Pointer tracking lives on `window`.

   This component is purposefully self-contained — it owns the
   single OKLCH→sRGB lookup table for both palettes and draws
   every frame imperatively, no Motion / GSAP / etc.
   ───────────────────────────────────────────────────────────── */

import { useEffect, useRef } from "react";
import styles from "./CursorDotField.module.css";

/* ─── Renderer config ────────────────────────────────────────
   Values reflect the settings the prototype was tuned to. */
const CFG = {
  spacing: 32, // px between dots
  dotSize: 0.8, // base dot radius (px)
  radius: 410, // proximity radius (px)
  falloff: 2.1, // 1 = linear, >1 = sharper edge
  growth: 3.4, // dot scale-up factor at the cursor
  idleDrift: true, // gentle drift after 2.5s of no input
  /* Peak alpha for a dot directly under the cursor. The frame
     loop caps `baseline + strength` at this value, so a value
     of 0.75 keeps even the brightest dot at 75% of full ink —
     subtler reveal, less risk of competing with surrounding
     content. Bump back toward 1 for a punchier focal point. */
  hoverOpacity: 0.75,
  /* Whether to draw a soft radial halo behind the dot cluster.
     Disabled in the prototype's tuned config; left here so it's
     a single-line toggle if you want it later. */
  halo: 0,
  haloRadius: 440,
} as const;

/* ─── Mono OKLCH ramps ────────────────────────────────────────
   The renderer reads `(1 - strength) * 255` as the LUT index, so
   strength = 0 (far from cursor) → STOP 1.0 (last entry), and
   strength = 1 (under the cursor) → STOP 0.0 (first entry).

   `paper` is tuned for light surfaces: cursor-adjacent dots land
   on a quiet mid grey, far dots sit on near-paper.

   `ink` flips the direction for dark surfaces: cursor-adjacent
   dots land near paper-tone for a bright reveal, far dots sit on
   a dim warm grey just bright enough to read as field texture
   above the ink-panel surface.
   ───────────────────────────────────────────────────────────── */
type PaletteStop = readonly [number, readonly [number, number, number]];

const PALETTES: Record<"paper" | "ink", ReadonlyArray<PaletteStop>> = {
  paper: [
    [0.0, [0.45, 0.005, 240]],
    [0.5, [0.7, 0.005, 240]],
    [1.0, [0.92, 0.005, 240]],
  ],
  ink: [
    [0.0, [0.92, 0.005, 60]],
    [0.5, [0.7, 0.005, 60]],
    [1.0, [0.42, 0.005, 60]],
  ],
};

type RGB = readonly [number, number, number];

/* ─── OKLCH → sRGB (Björn Ottosson) ───────────────────────────
   Standard L*C*h → linear RGB transform, then sRGB encoding.
   Result is clamped 0..255 ints (close enough; the renderer
   re-clamps via `|0` truncation per channel). */
function oklchToRgb(L: number, C: number, hDeg: number): RGB {
  const h = (hDeg * Math.PI) / 180;
  const a = Math.cos(h) * C;
  const b = Math.sin(h) * C;
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const enc = (v: number) => {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };
  return [enc(r) * 255, enc(g) * 255, enc(bl) * 255] as const;
}

/* Build a 256-entry RGB lookup table from a stop list.
   Hue interpolation takes the short way around the wheel so a
   palette that crosses 0°/360° doesn't smear through every hue
   in between. */
function buildLUT(
  stops: ReadonlyArray<readonly [number, readonly [number, number, number]]>,
): RGB[] {
  const lut: RGB[] = new Array(256);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let a = stops[0];
    let b = stops[stops.length - 1];
    for (let k = 0; k < stops.length - 1; k++) {
      if (t >= stops[k][0] && t <= stops[k + 1][0]) {
        a = stops[k];
        b = stops[k + 1];
        break;
      }
    }
    const span = b[0] - a[0] || 1;
    const u = (t - a[0]) / span;
    const L = a[1][0] + (b[1][0] - a[1][0]) * u;
    const C = a[1][1] + (b[1][1] - a[1][1]) * u;
    const h0 = a[1][2];
    const h1 = b[1][2];
    let dh = h1 - h0;
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;
    const H = h0 + dh * u;
    lut[i] = oklchToRgb(L, C, H);
  }
  return lut;
}

/* Tiny seeded PRNG — used to give each dot a small fixed jitter
   so the grid reads as a field rather than a checkerboard. */
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Dot = { x: number; y: number; jx: number; jy: number; phase: number };

export type CursorDotFieldVariant = "paper" | "ink";

interface CursorDotFieldProps {
  /* Which palette to use. `paper` (default) is tuned for light
     surfaces; `ink` is tuned for dark surfaces. */
  variant?: CursorDotFieldVariant;
}

export default function CursorDotField({
  variant = "paper",
}: CursorDotFieldProps = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Pre-build the palette LUT once per variant. The renderer
       never asks for it by name, so this can stay scoped to the
       effect. */
    const LUT = buildLUT(PALETTES[variant]);

    /* Honour the user's reduced-motion setting at mount. We don't
       react to subsequent changes — typical for this kind of
       ambient effect — but the matchMedia is cheap enough that
       we could revisit if needed. */
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const idleDrift = CFG.idleDrift && !prefersReduced;

    /* ─── State (closed over by event handlers + RAF) ─── */
    let W = 0;
    let H = 0;
    let DPR = 1;
    /* `mx` / `my` are the smoothed cursor coords actually used in
       the render. `realMx` / `realMy` are the raw input. The
       smoothing in the frame() loop gives the field a soft
       follow rather than a snappy lock. */
    let mx = -9999;
    let my = -9999;
    let realMx = -9999;
    let realMy = -9999;
    let lastInputAt = 0;
    let dots: Dot[] = [];
    let isVisible = true;
    let rafId = 0;

    /* Resize sync'd to the backdrop's actual box. `clientWidth /
       clientHeight` would also work, but getBoundingClientRect
       handles fractional layouts cleanly when the section is
       affected by `min-height: 100vh` rounding. */
    const resize = () => {
      const rect = container.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      DPR = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      rebuildDots();
    };

    const rebuildDots = () => {
      dots = [];
      const sp = CFG.spacing;
      const cols = Math.ceil(W / sp) + 2;
      const rows = Math.ceil(H / sp) + 2;
      const ox = (W - (cols - 1) * sp) / 2;
      const oy = (H - (rows - 1) * sp) / 2;
      const r = mulberry32(7);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          dots.push({
            x: ox + i * sp,
            y: oy + j * sp,
            jx: (r() - 0.5) * 0.6,
            jy: (r() - 0.5) * 0.6,
            phase: r() * Math.PI * 2,
          });
        }
      }
    };

    /* Pointer tracking is window-scoped (so we never miss events
       even if the cursor passes over interactive children) but
       coordinates are translated into backdrop-local space. If
       the cursor is outside the backdrop's rect, we treat it as
       infinitely far away so the field returns to baseline. */
    const onPointerMove = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        realMx = -9999;
        realMy = -9999;
        return;
      }
      realMx = x;
      realMy = y;
      lastInputAt = performance.now();
    };

    const onMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      onPointerMove(t.clientX, t.clientY);
    };
    const onMouseLeaveDoc = () => {
      realMx = -9999;
      realMy = -9999;
    };

    /* ─── Halo (optional; no-op while CFG.halo === 0) ─── */
    const drawHalo = (cx: number, cy: number, intensity: number) => {
      if (CFG.halo <= 0 || intensity <= 0) return;
      const r = CFG.haloRadius;
      const c = LUT[40];
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      const a = CFG.halo * intensity;
      grad.addColorStop(0, `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a * 0.18})`);
      grad.addColorStop(0.35, `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a * 0.06})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    };

    /* ─── Frame loop ───
       Smoothes cursor coords toward target, then renders every
       dot as a circle with proximity-driven fill + radius. */
    const frame = () => {
      rafId = requestAnimationFrame(frame);
      if (!isVisible) return;

      const now = performance.now();
      const idleFor = now - lastInputAt;
      let useX = realMx;
      let useY = realMy;
      const intensity = 1;

      if (idleDrift && (idleFor > 2500 || lastInputAt === 0)) {
        const k = now / 1000;
        const cx = W * 0.5 + Math.cos(k * 0.35) * W * 0.28;
        const cy = H * 0.5 + Math.sin(k * 0.55) * H * 0.22;
        const blend = Math.min(1, (idleFor - 2500) / 1500);
        useX = realMx * (1 - blend) + cx * blend;
        useY = realMy * (1 - blend) + cy * blend;
        if (lastInputAt === 0) {
          useX = cx;
          useY = cy;
        }
      }

      mx += (useX - mx) * 0.18;
      my += (useY - my) * 0.18;

      /* Transparent clear so the host section's bg colour shows
         through. The prototype filled with #ffffff each frame;
         every host of this component already owns its surface. */
      ctx.clearRect(0, 0, W, H);

      const R = CFG.radius;
      const R2 = R * R;
      const fall = CFG.falloff;
      const growth = CFG.growth;
      const baseR = CFG.dotSize;

      drawHalo(mx, my, intensity);

      for (let n = 0; n < dots.length; n++) {
        const d = dots[n];
        const px = d.x + d.jx;
        const py = d.y + d.jy;
        const dx = px - mx;
        const dy = py - my;
        const dist2 = dx * dx + dy * dy;

        let strength = 0;
        if (dist2 < R2) {
          const dist = Math.sqrt(dist2);
          strength = 1 - dist / R;
          strength = Math.pow(strength, fall);
        }

        /* Baseline keeps every dot faintly visible even at rest;
           total alpha caps at `CFG.hoverOpacity` so dots near
           the cursor stay below full ink and the field reads as
           a soft reveal rather than a hard hot-spot. */
        const baseline = 0.05;
        const total = Math.min(CFG.hoverOpacity, baseline + strength);

        const lutIdx = Math.max(
          0,
          Math.min(255, Math.floor((1 - strength) * 255)),
        );
        const [r, g, b] = LUT[lutIdx];

        const radius = baseR * (1 + (growth - 1) * strength);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${total.toFixed(3)})`;
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /* ─── Observers ───
       Resize: keep canvas in sync with section size.
       Intersection: pause RAF when section is off-screen. */
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(container);

    /* ─── Wire up + start ─── */
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveDoc);

    resize();
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
      ro.disconnect();
      io.disconnect();
    };
  }, [variant]);

  return (
    <div ref={containerRef} className={styles.backdrop} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
