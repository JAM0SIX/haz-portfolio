"use client";

/**
 * Footer 3×3 “H” dot grid (matches Menu idle pattern).
 * Hover: 0.6s radial scramble center → orthogonal → corners, then settles
 * to the H palette while hovered. Mouse leave returns to idle H.
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const PATTERN_H: number[][] = [
  [1, 0, 1],
  [1, 1, 1],
  [1, 0, 1],
];

const ROWS = 3;
const COLS = 3;

const dotPositions: { row: number; col: number }[] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    dotPositions.push({ row: r, col: c });
  }
}

const DESIGN_BASE_SIZE = 88;

/** Chebyshev distance from centre (1,1): 0=center, 1=orthogonal, 2=corners. */
function scrambleRing(row: number, col: number): number {
  return Math.max(Math.abs(row - 1), Math.abs(col - 1));
}

const DEFAULT_SCRAMBLE_MS = 600;
const DEFAULT_SCRAMBLE_PALETTE = ["#FFFFFF", "#C2410C", "#311305"] as const;

/** How often each dot’s palette index may change during scramble (~6–7/s). Higher = gentler (less “strobe”). */
const FLICKER_SLICE_MS = 150;

/** Deterministic flicker: palette index jumps per slice but stays legible as “random”. */
function flickerPick(
  dotIndex: number,
  elapsedMs: number,
  palette: readonly string[]
): string {
  const slice = Math.floor(elapsedMs / FLICKER_SLICE_MS);
  let h = Math.imul(dotIndex + 1, 73417) ^ Math.imul(slice + 1, 19349663);
  h = Math.imul(h ^ (h >>> 15), h | 1);
  h ^= h >>> 8;
  return palette[(h >>> 0) % palette.length] ?? palette[0];
}

export type FooterLogoDotsProps = {
  /** Edge length (px) of the square wrapper — usually from ResizeObserver parent. */
  size: number;
  restActiveColor?: string;
  restInactiveColor?: string;
  containerBg?: string;
  /** Logical dot/gap/radius matching design at `designBase` px (default 88). */
  designBase?: number;
  dotSize?: number;
  dotGap?: number;
  radius?: number;
  /** Radial scramble + settle duration (default 600). */
  scrambleDurationMs?: number;
  scramblePalette?: readonly [string, string, string];
};

function DotsShell({
  size,
  restActiveColor = "#FFFFFF",
  restInactiveColor = "#C2410C",
  containerBg = "transparent",
  designBase = DESIGN_BASE_SIZE,
  dotSize: dotSizeProp = 20,
  dotGap: dotGapProp = 12,
  radius: radiusProp = 0,
  scrambleDurationMs = DEFAULT_SCRAMBLE_MS,
  scramblePalette = DEFAULT_SCRAMBLE_PALETTE,
}: FooterLogoDotsProps) {
  const [hovered, setHovered] = useState(false);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const scale = Math.max(size, 32) / designBase;
  const dotSize = Math.max(2, dotSizeProp * scale);
  const dotGap = Math.max(0, dotGapProp * scale);
  const radius = Math.max(0, radiusProp * scale);

  const staggerMs = scrambleDurationMs / 3;

  const applyPatternH = useCallback(
    (transition: string) => {
      dotRefs.current.forEach((el, i) => {
        if (!el) return;
        const { row, col } = dotPositions[i];
        const isOn = PATTERN_H[row]![col] === 1;
        el.style.transition = transition;
        el.style.backgroundColor = isOn ? restActiveColor : restInactiveColor;
      });
    },
    [restActiveColor, restInactiveColor]
  );

  /** Idle / mouse leave — soft settle to H. */
  const settleIdle = useCallback(() => {
    applyPatternH(
      "background-color 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
    );
  }, [applyPatternH]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hovered) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      settleIdle();
      return;
    }

    dotRefs.current.forEach((el) => {
      if (el) el.style.transition = "none";
    });

    const t0 = performance.now();

    const tick = (now: number) => {
      const elapsedMs = now - t0;

      if (elapsedMs >= scrambleDurationMs) {
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        applyPatternH(
          "background-color 0.22s cubic-bezier(0.22, 1, 0.36, 1)"
        );
        return;
      }

      for (let i = 0; i < dotRefs.current.length; i++) {
        const el = dotRefs.current[i];
        if (!el) continue;
        const { row, col } = dotPositions[i];
        const ring = scrambleRing(row, col);
        const ringStartMs = ring * staggerMs;

        if (elapsedMs < ringStartMs) {
          const isOn = PATTERN_H[row]![col] === 1;
          el.style.backgroundColor = isOn ? restActiveColor : restInactiveColor;
        } else {
          el.style.backgroundColor = flickerPick(i, elapsedMs, scramblePalette);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [
    hovered,
    staggerMs,
    scrambleDurationMs,
    scramblePalette,
    restActiveColor,
    restInactiveColor,
    settleIdle,
    applyPatternH,
  ]);

  const setDotRef = (i: number) => (el: HTMLSpanElement | null) => {
    dotRefs.current[i] = el;
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: containerBg,
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "visible",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${dotSize}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${dotSize}px)`,
          gap: dotGap,
        }}
      >
        {dotPositions.map(({ row, col }, i) => {
          const isOn = PATTERN_H[row]![col] === 1;
          return (
            <span
              key={i}
              ref={setDotRef(i)}
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: "50%",
                display: "block",
                backgroundColor: isOn ? restActiveColor : restInactiveColor,
                transition:
                  "background-color 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export type FooterLogoDotsResponsiveProps = Omit<FooterLogoDotsProps, "size"> & {
  ariaLabel?: string;
  className?: string;
};

/**
 * Sizes the dot grid from layout (fills a square `.logoDotsMount`).
 */
export default function FooterLogoDots({
  ariaLabel = "Haz",
  className,
  ...dotProps
}: FooterLogoDotsResponsiveProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState(280);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const read = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const s = Math.floor(Math.min(w || 9999, h || 9999));
      if (s > 32) setSide(s);
    };

    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <DotsShell size={side} {...dotProps} />
    </div>
  );
}
