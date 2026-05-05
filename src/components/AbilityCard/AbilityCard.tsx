/* ─────────────────────────────────────────────────────────────
   AbilityCard — Haz.
   Hover-reveal capability card.

   Frame (rest):    4 L-corners only. No connecting lines.
   Frame (hover):   4 sides draw in from their origin corners,
                    TL + BR corners morph from L-shape to
                    chevron-with-diagonal, and the card's
                    clip-path animates in matching chamfers.
   Content (rest):  Heading visible. Description + CTA invisible
                    (opacity 0 + 4px blur) but laid out in place
                    so the heading never reflows on hover.
   Content (hover): Description fades+unblurs at 100ms, CTA at
                    200ms — gentle top-down cascade.

   Accessibility:
     · The CTA is the focusable element. `:focus-within` on the
       card mirrors hover, so keyboard focus also lights the
       frame and reveals the description.
     · The four L-corner SVGs / spans are decorative and use
       aria-hidden so screen readers don't announce them.
     · Reduced-motion users skip the directional draw + blur
       cascade (handled in CSS).
   ───────────────────────────────────────────────────────────── */

import type { ReactNode } from "react";
import styles from "./AbilityCard.module.css";

/* Initial path strings for the morphing TL + BR corners.
   Mirrored as a fallback `d` attribute on each <path> so browsers
   that don't yet support CSS's `d` property still render the
   rest-state corners (modern Chrome / Firefox / Safari ≥16 use
   the CSS rule and animate between the two states). */
const TL_REST_PATH = "M 0.5 16 L 0.5 0.5 L 0.5 0.5 L 16 0.5";
const BR_REST_PATH = "M 15.5 0 L 15.5 15.5 L 15.5 15.5 L 0 15.5";

export type AbilityCardProps = {
  title: string;
  description: ReactNode;
  /** Caps-tracked CTA label, e.g. "VIEW APPROACH". */
  ctaLabel: string;
  /** Anchor href for the CTA. External links open in a new tab. */
  href: string;
  /** Force-open external behaviour (icon hint, target, rel). */
  external?: boolean;
};

export default function AbilityCard({
  title,
  description,
  ctaLabel,
  href,
  external = false,
}: AbilityCardProps) {
  return (
    <article className={styles.card}>
      {/* Static L-corners (TR + BL) — never morph. */}
      <span className={styles.cornerTR} aria-hidden="true" />
      <span className={styles.cornerBL} aria-hidden="true" />

      {/* Morphing corners (TL + BR) — single path each, two states.
          The `d` is set via CSS for the animated transition; the
          attribute version below is a graceful-degradation fallback. */}
      <svg
        className={styles.morphCornerTL}
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        <path className={styles.morphPath} d={TL_REST_PATH} />
      </svg>
      <svg
        className={styles.morphCornerBR}
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        <path className={styles.morphPath} d={BR_REST_PATH} />
      </svg>

      {/* Side-lines — full edge each, scaleX/scaleY 0 → 1 on hover.
          Each originates from one of the static L-corners (TR or BL)
          so the draw direction matches the spec in the CSS file. */}
      <span className={styles.topLine} aria-hidden="true" />
      <span className={styles.rightLine} aria-hidden="true" />
      <span className={styles.bottomLine} aria-hidden="true" />
      <span className={styles.leftLine} aria-hidden="true" />

      {/* Content. Heading is always visible; description + CTA are
          laid out at rest but invisible (opacity 0 + blur 4px) so
          the heading never reflows. */}
      <div className={styles.content}>
        <h3 className={styles.heading}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <a
          className={styles.cta}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          <span className={styles.ctaLabel} data-text={ctaLabel}>
            {ctaLabel}
          </span>
          <span className={styles.ctaArrow} aria-hidden="true">
            {external ? "↗" : "→"}
          </span>
        </a>
      </div>
    </article>
  );
}
