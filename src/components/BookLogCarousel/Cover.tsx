/* ─────────────────────────────────────────────────────────────
   Cover — generative book cover for a single article.

   Layout zones (top → bottom):
     · Top metadata band      — field code (centered)
     · Big number             — "NO." + 2-digit number
     · Center insignia        — geometric mark (variant by id)
     · Title block            — serif title (centered)

   Decorative chrome:
     · Hairline grid (CSS gradient overlay)
     · Punch holes on the left binding edge
     · Vertical spine line
     · Corner ticks (4)
     · Pulsing accent border when focused
   ───────────────────────────────────────────────────────────── */

import type { Article } from "./articles";
import Insignia from "./Insignia";
import styles from "./BookLogCarousel.module.css";

type CoverProps = {
  article: Article;
  focused: boolean;
};

export default function Cover({ article, focused }: CoverProps) {
  const { num, title, cover, field } = article;

  // Boost chroma + brighten when focused so the active card pops vs
  // its greyed-out neighbours.
  const chroma = focused
    ? Math.min(0.16, cover.chroma * 4 + 0.06)
    : cover.chroma;
  const lightness = focused
    ? Math.min(0.78, cover.lightness + 0.05)
    : cover.lightness;
  const bg = `oklch(${lightness * 100}% ${chroma} ${cover.hue})`;
  const ink = lightness > 0.55 ? "#1A1815" : "#ECEAE5";
  const inkSoft =
    lightness > 0.55 ? "rgba(26, 24, 21, 0.62)" : "rgba(236, 234, 229, 0.55)";
  const rule =
    lightness > 0.55 ? "rgba(26, 24, 21, 0.22)" : "rgba(236, 234, 229, 0.28)";

  const seed = parseInt(article.id, 10);
  const numLabel = String(parseInt(num, 10)).padStart(2, "0");

  return (
    <div className={styles.cover} style={{ background: bg, color: ink }}>
      <div
        className={styles.coverGrid}
        style={{
          backgroundImage:
            `linear-gradient(to right,  ${rule} 1px, transparent 1px),` +
            `linear-gradient(to bottom, ${rule} 1px, transparent 1px)`,
        }}
      />

      <div className={styles.coverPunches} aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className={styles.coverPunch} />
        ))}
      </div>

      <span className={styles.coverSpine} aria-hidden />

      <div className={`${styles.coverBand} ${styles.coverBandTop}`}>
        <span className={styles.coverBandLabel}>{field}</span>
      </div>

      <svg
        className={`${styles.coverCorner} ${styles.cornerTl}`}
        viewBox="0 0 24 24"
      >
        <path d="M0 8 L0 0 L8 0" stroke={ink} fill="none" strokeWidth="1" />
      </svg>
      <svg
        className={`${styles.coverCorner} ${styles.cornerTr}`}
        viewBox="0 0 24 24"
      >
        <path d="M16 0 L24 0 L24 8" stroke={ink} fill="none" strokeWidth="1" />
      </svg>
      <svg
        className={`${styles.coverCorner} ${styles.cornerBl}`}
        viewBox="0 0 24 24"
      >
        <path d="M0 16 L0 24 L8 24" stroke={ink} fill="none" strokeWidth="1" />
      </svg>
      <svg
        className={`${styles.coverCorner} ${styles.cornerBr}`}
        viewBox="0 0 24 24"
      >
        <path
          d="M16 24 L24 24 L24 16"
          stroke={ink}
          fill="none"
          strokeWidth="1"
        />
      </svg>

      <div className={styles.coverBignum} style={{ color: ink }}>
        <span className={styles.bignumPrefix} style={{ color: inkSoft }}>
          NO.
        </span>
        <span className={styles.bignumVal}>{numLabel}</span>
      </div>

      <div className={styles.coverInsignia}>
        <Insignia seed={seed} ink={ink} inkSoft={inkSoft} />
      </div>

      <div className={styles.coverTitleBlock}>
        <p className={styles.coverTitle}>{title}</p>
      </div>

      {focused && <div className={styles.coverFocusedPulse} />}
    </div>
  );
}
