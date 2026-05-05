import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.section} aria-labelledby="hero-title">
      <p className={`type-technical ${styles.cornerLabel}`}>P/00 · INDEX</p>
      <p className={`type-technical ${styles.cornerLabelRight}`}>
        STATUS · ACTIVE
      </p>

      <div className={styles.inner}>
        <p className={`type-technical ${styles.eyebrow}`}>
          PORTFOLIO · 2026
        </p>

        <h1 id="hero-title" className={`type-hero ${styles.wordmark}`}>
          Haz<em>.</em>
        </h1>

        <p className={`type-body ${styles.lede}`}>
          Designer of products, identity systems, and small precise things.
          Currently building tooling at the edge of design and engineering.
          Previously at GWI, LexisNexis, and a few others worth mentioning.
        </p>

        <div className={styles.actions}>
          <a href="#dial" className="btn btn-primary">
            <span data-text="Begin">Begin</span>
            <span className="btn-arrow" aria-hidden>
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
