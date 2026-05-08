"use client";

/* ─────────────────────────────────────────────────────────────
   BookLog Carousel — Haz.
   A horizontal notebook carousel for the "Currently reading" section.

   Interactions (only when the section is at least 50% in view, so
   arrow keys scroll the page when the carousel is off-screen):
     ← →   step prev / next (clamped at ends)
     click ◂ ▸ via the IconButton chevrons
     click on a faded card to focus it
     click on a scalebar major tick to jump

   Layout:
     [topbar — eyebrow / title / counter ────────────────────────]
     [track  ──── focused card pinned to the left, others trail ──]
     [scalebar — fused under the track, marker on the active idx ]
     [nav  ◂  ▸  — sits at the top of the preview, controlling   ]
     [preview — title / rule / excerpt / CTA                     ]
   ───────────────────────────────────────────────────────────── */

import { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/Button";
import { ARTICLES } from "./articles";
import Cover from "./Cover";
import PreviewPanel from "./PreviewPanel";
import ScaleBar from "./ScaleBar";
import styles from "./BookLogCarousel.module.css";

// How many neighbours render to the right of the focused card.
const PEEK_COUNT = 3;

// Card width + visible gap. STEP must equal CARD_WIDTH + CARD_GAP so
// translateX(-focus * STEP) brings the focused card's left edge to
// the track padding. These mirror --card-w in
// BookLogCarousel.module.css (216 desktop, 198 mobile); update both
// places together if you ever resize the cards.
const CARD_GAP = 40;
const CARD_WIDTH_DESKTOP = 216;
const CARD_WIDTH_MOBILE = 198;
const STEP_DESKTOP = CARD_WIDTH_DESKTOP + CARD_GAP;
const STEP_MOBILE = CARD_WIDTH_MOBILE + CARD_GAP;

export default function BookLogCarousel() {
  const articles = ARTICLES;
  const total = articles.length;

  const [focus, setFocus] = useState(0);
  const [step, setStep] = useState(STEP_DESKTOP);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const go = useCallback(
    (dir: number) => {
      setFocus((f) => Math.max(0, Math.min(total - 1, f + dir)));
    },
    [total],
  );

  // Recompute step from viewport (mobile cards are narrower).
  // SSR-safe: defaults to desktop step, updates after mount.
  useEffect(() => {
    const update = () => {
      setStep(window.innerWidth <= 720 ? STEP_MOBILE : STEP_DESKTOP);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Scope keyboard input to when the carousel is at least 50% in view.
  // This prevents arrow keys from hijacking the page when the user is
  // reading other sections, and avoids fighting the dial section's
  // arrow-key handler.
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, go]);

  const focused = articles[focus];

  return (
    <div ref={containerRef} className={styles.root}>
      {/* ===== TOPBAR ===== */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <h2 className={styles.topbarTitle}>My Notes</h2>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.topbarCount}>
            {String(focus + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </header>

      {/* ===== NOTEBOOKS ===== */}
      <section className={styles.trackWrap}>
        <div
          className={styles.track}
          style={{ transform: `translateX(${-focus * step}px)` }}
        >
          {articles.map((a, i) => {
            const offset = i - focus;
            const isFocus = offset === 0;
            const visible = offset >= 0 && offset <= PEEK_COUNT + 1;
            const cls = [
              styles.card,
              isFocus ? styles.cardFocus : "",
              visible ? "" : styles.cardHidden,
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={a.id}
                type="button"
                className={cls}
                style={{
                  opacity: isFocus
                    ? 1
                    : Math.max(0, 1 - Math.max(0, offset) * 0.18),
                }}
                onClick={() => {
                  if (!isFocus) setFocus(i);
                }}
                aria-label={`${a.title} by ${a.author}`}
              >
                <Cover article={a} focused={isFocus} />
              </button>
            );
          })}
        </div>

        <div className={styles.trackScale}>
          <ScaleBar focus={focus} total={total} onPick={setFocus} />
        </div>
      </section>

      {/* ===== DETAILED PREVIEW ===== */}
      <section className={styles.previewWrap}>
        {/* Nav lives at the top of the preview block, controlling
            which card is focused (and therefore which article shows
            below). Left-aligned to match the preview's content gutter. */}
        <div className={styles.trackNav}>
          <IconButton
            size="md"
            aria-label="Previous article"
            onClick={() => go(-1)}
            disabled={focus === 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M15 4 L7 12 L15 20"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
          </IconButton>
          <IconButton
            size="md"
            aria-label="Next article"
            onClick={() => go(1)}
            disabled={focus === total - 1}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M9 4 L17 12 L9 20"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
          </IconButton>
        </div>

        <PreviewPanel article={focused} />
      </section>
    </div>
  );
}
