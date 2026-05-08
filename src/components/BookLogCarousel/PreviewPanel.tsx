/* ─────────────────────────────────────────────────────────────
   PreviewPanel — title + rule + excerpt + CTA.
   The CTA uses the design-system Button (secondary tier, ink fill,
   trailing arrow), matching the original .cta recipe exactly.
   The whole panel re-animates on article switch via the `key` prop.
   ───────────────────────────────────────────────────────────── */

import Button from "@/components/ui/Button";
import type { Article } from "./articles";
import styles from "./BookLogCarousel.module.css";

type PreviewPanelProps = {
  article: Article;
};

export default function PreviewPanel({ article }: PreviewPanelProps) {
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
            onClick={() => {
              // TODO: navigate to /reading/[id] when the route exists
              console.log(`Open article ${article.id}`);
            }}
          >
            Open Article
          </Button>
        </div>
      </div>
    </div>
  );
}
