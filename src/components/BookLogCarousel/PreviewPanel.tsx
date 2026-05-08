"use client";

/* ─────────────────────────────────────────────────────────────
   PreviewPanel — title + rule + excerpt + CTA.
   The CTA uses the design-system Button (secondary tier, ink fill,
   trailing arrow), matching the original .cta recipe exactly. The
   onClick navigates client-side to /reading/[id], and we prefetch
   the route on mount so the article opens instantly. Routing via
   `useRouter` (rather than wrapping the <button> in an <a>) keeps
   the markup valid and the Button polymorphism-free.
   The whole panel re-animates on article switch via the `key` prop.
   ───────────────────────────────────────────────────────────── */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import type { Article } from "./articles";
import styles from "./BookLogCarousel.module.css";

type PreviewPanelProps = {
  article: Article;
};

export default function PreviewPanel({ article }: PreviewPanelProps) {
  const router = useRouter();
  const href = `/reading/${article.id}`;

  /* Warm the route as the user lands on each article so clicking
     "Open Article" feels instant — Next.js dedupes prefetches. */
  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  return (
    <div className={styles.preview} key={article.id}>
      <div className={styles.previewHead}>
        <div className={styles.previewTitleblock}>
          <h3 className={styles.previewTitle}>{article.title}</h3>
        </div>
      </div>

      <div className={styles.rule} />

      <div className={styles.previewRow}>
        <p className={styles.rowExcerpt}>{article.excerpt}</p>
        <div className={styles.rowCta}>
          <Button
            variant="secondary"
            arrow="→"
            onClick={() => router.push(href)}
          >
            Open Article
          </Button>
        </div>
      </div>
    </div>
  );
}
