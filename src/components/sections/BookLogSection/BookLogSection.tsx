import styles from "./BookLogSection.module.css";

export default function BookLogSection() {
  return (
    <section
      id="reading"
      className={styles.section}
      aria-labelledby="reading-title"
    >
      <p className={`type-technical ${styles.cornerLabel}`}>READING / 002</p>

      <div className={styles.inner}>
        <p className={`type-technical ${styles.eyebrow}`}>READING / 002</p>

        <h2 id="reading-title" className={`type-display ${styles.heading}`}>
          Currently reading.
        </h2>

        <div className={styles.placeholder}>
          <span className={`type-label ${styles.placeholderTag}`}>
            CMP/02 · BookLog Carousel
          </span>
          <p className={`type-body ${styles.placeholderText}`}>
            The reading shelf goes here. A horizontal carousel of books with
            covers, notes, and the date I finished each one. Coming next.
          </p>
        </div>
      </div>
    </section>
  );
}
