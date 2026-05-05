/* ─────────────────────────────────────────────────────────────
   ScaleBar — fused scalebar that lives directly under the carousel
   track. Major ticks are clickable (jump to that article); the
   accent marker glides to the active position.
   ───────────────────────────────────────────────────────────── */

import styles from "./BookLogCarousel.module.css";

type ScaleBarProps = {
  focus: number;
  total: number;
  onPick: (i: number) => void;
};

export default function ScaleBar({ focus, total, onPick }: ScaleBarProps) {
  const minorPerMajor = 6;
  const totalMinors = (total - 1) * minorPerMajor;
  const majorPos = (i: number) => (i / (total - 1)) * 100;
  const pos = majorPos(focus);

  return (
    <div className={styles.scalebar}>
      <div className={styles.scalebarTrack}>
        <span className={styles.scalebarBaseline} />

        {Array.from({ length: totalMinors + 1 }).map((_, i) => {
          const isMajor = i % minorPerMajor === 0;
          if (isMajor) return null;
          return (
            <span
              key={`mn-${i}`}
              className={`${styles.scalebarTick} ${styles.scalebarTickMinor}`}
              style={{ left: `${(i / totalMinors) * 100}%` }}
            />
          );
        })}

        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === focus;
          const cls = isActive
            ? `${styles.scalebarMajor} ${styles.isActive}`
            : styles.scalebarMajor;
          return (
            <button
              key={`mj-${i}`}
              type="button"
              className={cls}
              style={{ left: `${majorPos(i)}%` }}
              onClick={() => onPick(i)}
              aria-label={`Article ${i + 1}`}
            >
              <span
                className={`${styles.scalebarTick} ${styles.scalebarTickMajor}`}
              />
              <span className={styles.scalebarMajorLabel}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}

        <span
          className={styles.scalebarMarker}
          style={{ left: `${pos}%` }}
          aria-hidden
        >
          <span className={styles.scalebarMarkerArrow} />
        </span>
      </div>
    </div>
  );
}
