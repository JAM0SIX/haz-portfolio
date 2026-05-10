"use client";

/* ─────────────────────────────────────────────────────────────
   Menu — Haz.
   Animated floating menu, fixed top-right.

   Closed state:
     A 56px hard-cornered paper-on-page pill holding a 9-dot grid
     in the top-right. Default pattern is a capital "H"; on hover
     the dots morph into a contrasting plus/diamond.

   Open state:
     The pill grows out from the icon in two stages — width first,
     then height — then content fades in. Closing reverses the
     sequence. Hovering the icon while open plays the dot-rearrange
     in reverse so it visually reads as "close".

   Behaviour:
     · Click the icon to toggle.
     · Click outside the panel to close.
     · Press Escape to close.
     · Click any nav item to close (and let the native anchor scroll
       handle navigation — `scroll-behavior: smooth` is set globally).
   ───────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

/* ─── Patterns ─────────────────────────────────────────────────
   Two 3×3 dot patterns the icon animates between.
   1 = active, 0 = inactive. */

const patternA = [
  [1, 0, 1],
  [1, 1, 1],
  [1, 0, 1],
] as const;

const patternB = [
  [0, 1, 0],
  [1, 0, 1],
  [0, 1, 0],
] as const;

/* ─── Sizing ─────────────────────────────────────────────────── */

const ICON_SIZE = 56;
const PANEL_WIDTH = 320;
const PANEL_HEIGHT = 430;

/* ─── Timing (seconds) ────────────────────────────────────────
   Total open = X_DURATION + Y_DURATION + content fade. */

const X_DURATION = 0.55;
const Y_DURATION = 0.6;
const CONTENT_DURATION = 0.45;
const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Design-system colors ────────────────────────────────────
   These mirror src/styles/tokens.css. Inlined as hex strings so
   Motion can interpolate between them (CSS custom properties
   can't be animated cross-frame by Motion's spring/tween API).
   If tokens change, update both places.
   ──────────────────────────────────────────────────────────── */

const PANEL_COLOR = "#1A1815"; // --ink-panel / --ink
const TEXT_COLOR = "#F5F3EE"; // --paper (text on ink-panel)
const MUTED_COLOR = "rgba(245, 243, 238, 0.42)"; // paper @ 42% on ink-panel
const ACCENT_COLOR = "#C2410C"; // --accent
const CONTRAST_COLOR = "#F5F3EE"; // --paper (matches the page surface)
// Closed-state pill background: a barely-tinted paper wash that sits over
// a backdrop-blur, giving the icon a frosted-glass chip feel rather than a
// solid swatch. Pair with `backdrop-filter: blur(...)` on the same element.
const CLOSED_BG_COLOR = "rgba(236, 234, 227, 0.1)";
const CLOSED_BACKDROP_BLUR = "blur(10px)";

/** Convert a hex / rgb(a) color to an rgba() string with the given
 *  alpha. Returns the input untouched if it can't be parsed, so we
 *  never emit invalid CSS. */
function withAlpha(color: string, alpha: number): string {
  if (!color) return `rgba(26, 24, 21, ${alpha})`;
  const c = color.trim();

  if (c.startsWith("#")) {
    let hex = c.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (!Number.isNaN(r + g + b)) {
        return `rgba(${r},${g},${b},${alpha})`;
      }
    }
  }

  const m = c.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((p) => p.trim());
    const [r, g, b] = parts;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  return color;
}

/* ─── Public API ─────────────────────────────────────────────── */

export type MenuItem = {
  label: string;
  link: string;
};

type MenuProps = {
  /** Top group — primary site navigation. The first item is rendered
   *  in the "muted current-location" style (e.g. "Home / Index"). */
  primaryItems?: MenuItem[];
  /** Bottom group — secondary or external resources. */
  resourceItems?: MenuItem[];
  /** Distance from the top of the viewport, in px. */
  offsetTop?: number;
  /** Distance from the right of the viewport, in px. */
  offsetRight?: number;
};

const DEFAULT_PRIMARY: MenuItem[] = [
  { label: "Home", link: "/" },
  { label: "Work", link: "/projects" },
  { label: "About", link: "/about" },
  { label: "Contact", link: "/#contact" },
];

const DEFAULT_RESOURCES: MenuItem[] = [
  { label: "LinkedIn", link: "https://www.linkedin.com" },
  { label: "CV", link: "/cv.pdf" },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function Menu({
  primaryItems = DEFAULT_PRIMARY,
  resourceItems = DEFAULT_RESOURCES,
  offsetTop = 24,
  offsetRight = 24,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const [iconHover, setIconHover] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const pathname = usePathname();

  const shellRef = useRef<HTMLDivElement | null>(null);

  // Closed: resting = A, hover = B.
  // Open (icon acts as close): reverse — resting = B, hover = A.
  const currentPattern = open
    ? iconHover
      ? patternA
      : patternB
    : iconHover
      ? patternB
      : patternA;

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  // Close on Escape and on pointerdown outside the shell.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (!shellRef.current || !(target instanceof Node)) return;
      if (!shellRef.current.contains(target)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Dot colors flip based on state so the icon reads well against
  // both the page (closed) and the dark panel (open).
  const activeDot = open ? TEXT_COLOR : PANEL_COLOR;
  const inactiveDot = open ? MUTED_COLOR : withAlpha(PANEL_COLOR, 0.33);

  // Shell background: a subtle paper-chip when closed, ink-panel when open.
  const shellBg = open ? PANEL_COLOR : CLOSED_BG_COLOR;

  const isPrimaryItemMuted = (link: string, idx: number): boolean => {
    if (link.startsWith("/")) {
      const [routePath] = link.split("#");
      return pathname === routePath;
    }

    // Hash links are page-local. Keep Home muted on the landing page.
    if (link === "#top") {
      return pathname === "/" || pathname === "";
    }

    // Fallback to the previous behavior for unknown link patterns.
    return idx === 0;
  };

  const wrapperStyle: CSSProperties = {
    position: "fixed",
    top: offsetTop,
    right: offsetRight,
    zIndex: 9999,
    fontFamily: "var(--font-sans)",
  };

  return (
    <div style={wrapperStyle}>
      <motion.div
        ref={shellRef}
        initial={false}
        animate={{
          width: open ? PANEL_WIDTH : ICON_SIZE,
          height: open ? PANEL_HEIGHT : ICON_SIZE,
          backgroundColor: shellBg,
          boxShadow: open
            ? "0 20px 60px rgba(26, 24, 21, 0.25), 0 4px 12px rgba(26, 24, 21, 0.12)"
            : "0 0 0 rgba(26, 24, 21, 0)",
          // Border on the open panel using the contrast color; hidden
          // when closed (transparent) so the closed pill looks borderless.
          borderColor: open ? CONTRAST_COLOR : withAlpha(CONTRAST_COLOR, 0),
        }}
        transition={{
          width: {
            duration: X_DURATION,
            ease: EASE,
            // open: first; close: after Y collapses
            delay: open ? 0 : Y_DURATION,
          },
          height: {
            duration: Y_DURATION,
            ease: EASE,
            // open: after X; close: first
            delay: open ? X_DURATION : 0,
          },
          backgroundColor: {
            duration: 0.25,
            ease: EASE,
            // Open: sync with width growth. Close: begin near the end of
            // the shell collapse so the page returns to its default
            // surface snappily.
            delay: open ? 0 : Y_DURATION + X_DURATION * 0.55,
          },
          boxShadow: {
            duration: 0.25,
            ease: EASE,
            delay: open ? 0 : Y_DURATION + X_DURATION * 0.55,
          },
          borderColor: {
            duration: 0.25,
            ease: EASE,
            // Border appears as the panel finishes growing on open,
            // and fades out as the shell starts shrinking on close.
            delay: open ? X_DURATION + Y_DURATION * 0.5 : 0,
          },
        }}
        onMouseEnter={() => setIconHover(true)}
        onMouseLeave={() => setIconHover(false)}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          overflow: "hidden",
          // 1px solid border, color animated above. Always present so
          // width/style don't jump — only the color toggles.
          borderWidth: 1,
          borderStyle: "solid",
          boxSizing: "border-box",
          // Frosted-glass effect for the closed chip. Has no visible cost
          // when open since the panel background is fully opaque.
          backdropFilter: CLOSED_BACKDROP_BLUR,
          WebkitBackdropFilter: CLOSED_BACKDROP_BLUR,
        }}
      >
        {/* Icon — same element in both states, anchored top-right.
            Padding inside the shell differs between states so the
            visual inset matches the reference. */}
        <motion.button
          type="button"
          onClick={toggle}
          whileTap={{ scale: 0.92 }}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu-panel"
          // Skip mount animation so the icon is just present on page
          // load — no fade/slide-in.
          initial={false}
          animate={{
            top: open ? 22 : 14,
            right: open ? 24 : 14,
            width: 28,
            height: 28,
          }}
          transition={{
            duration: 0.35,
            ease: EASE,
            // Open: settle into its panel position mid-way through the
            // shell growth. Close: stay put until the panel has mostly
            // collapsed, then slide back to the corner.
            delay: open ? X_DURATION + Y_DURATION * 0.3 : Y_DURATION * 0.4,
          }}
          style={{
            position: "absolute",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            gap: 4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            zIndex: 2,
          }}
        >
          {currentPattern.flat().map((on, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{
                backgroundColor: on ? activeDot : inactiveDot,
                scale: on ? 1 : 0.85,
              }}
              transition={{
                duration: 0.35,
                ease: EASE,
                delay: i * 0.02,
              }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                display: "block",
              }}
            />
          ))}
        </motion.button>

        {/* Expanded content — fades in after both X and Y finish.
            On close we fade it out FIRST (fast, no delay) so it's
            gone before the shell starts collapsing. */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="site-menu-panel"
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: CONTENT_DURATION,
                  ease: EASE,
                  delay: X_DURATION + Y_DURATION * 0.5,
                },
              }}
              exit={{
                opacity: 0,
                y: 4,
                transition: {
                  duration: 0.15,
                  ease: EASE,
                  delay: 0,
                },
              }}
              style={{
                position: "absolute",
                inset: 0,
                padding: "72px 28px 28px",
                color: TEXT_COLOR,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Primary navigation */}
              <nav
                aria-label="Primary"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {primaryItems.map((item, idx) => {
                  const key = `primary-${idx}`;
                  return (
                    <MenuRow
                      key={key}
                      label={item.label}
                      link={item.link}
                      isMuted={isPrimaryItemMuted(item.link, idx)}
                      size={28}
                      hovered={hoveredKey === key}
                      onHoverStart={() => setHoveredKey(key)}
                      onHoverEnd={() => setHoveredKey(null)}
                      onClick={close}
                    />
                  );
                })}
              </nav>

              {resourceItems.length > 0 && (
                <>
                  <div
                    style={{
                      height: 1,
                      background: MUTED_COLOR,
                      opacity: 0.3,
                      margin: "24px 0 18px",
                    }}
                  />

                  {/* Resources — design system "Technical" recipe label */}
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      color: MUTED_COLOR,
                      marginBottom: 14,
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    RESOURCES
                  </div>
                  <nav
                    aria-label="Resources"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {resourceItems.map((item, idx) => {
                      const key = `resource-${idx}`;
                      const external = /^https?:\/\//i.test(item.link);
                      return (
                        <MenuRow
                          key={key}
                          label={item.label}
                          link={item.link}
                          isMuted={false}
                          size={18}
                          hovered={hoveredKey === key}
                          onHoverStart={() => setHoveredKey(key)}
                          onHoverEnd={() => setHoveredKey(null)}
                          onClick={close}
                          external={external}
                        />
                      );
                    })}
                  </nav>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ─── Row ─────────────────────────────────────────────────────
   Single menu row with magnetic shift + animated underline +
   sliding indicator dot on hover. */

type MenuRowProps = {
  label: string;
  link: string;
  isMuted: boolean;
  size: number;
  hovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
  external?: boolean;
};

function MenuRow({
  label,
  link,
  isMuted,
  size,
  hovered,
  onHoverStart,
  onHoverEnd,
  onClick,
  external = false,
}: MenuRowProps) {
  return (
    <motion.a
      href={link || "#"}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      animate={{ x: hovered ? 8 : 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
        color: isMuted && !hovered ? MUTED_COLOR : TEXT_COLOR,
        fontSize: size,
        lineHeight: 1.25,
        fontWeight: 400,
        padding: "4px 0",
        width: "fit-content",
        cursor: "pointer",
        transition: "color 0.25s ease",
      }}
    >
      {/* Sliding indicator dot on the left */}
      <motion.span
        animate={{
          opacity: hovered ? 1 : 0,
          x: hovered ? 0 : -6,
          scale: hovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{
          position: "absolute",
          left: -18,
          top: "50%",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: ACCENT_COLOR,
          marginTop: -3,
        }}
      />
      <span style={{ position: "relative", display: "inline-block" }}>
        {label}
        <motion.span
          initial={false}
          animate={{
            scaleX: hovered ? 1 : 0,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -2,
            height: 1,
            background: ACCENT_COLOR,
            transformOrigin: "left center",
            display: "block",
          }}
        />
      </span>
    </motion.a>
  );
}
