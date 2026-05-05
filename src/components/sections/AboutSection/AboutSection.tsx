import styles from "./AboutSection.module.css";

const ASIDE = [
  {
    key: "Skills",
    value: "Product, identity, motion, design ops, frontend.",
  },
  {
    key: "Clients",
    value:
      "PHILPOT\u2014PEARCE, GWI, LexisNexis, SoundTrends, plus a handful under NDA.",
  },
  {
    key: "Tools",
    value: "Figma, TypeScript, Next.js, Framer Motion, a stubborn Wacom.",
  },
  {
    key: "Based",
    value: "London \u2014 working internationally.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="about-title"
    >
      <p className={`type-technical ${styles.cornerLabel}`}>ABOUT / 004</p>

      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={`type-technical ${styles.eyebrow}`}>ABOUT / 004</p>
          <h2 id="about-title" className={`type-display ${styles.heading}`}>
            About.
          </h2>
        </div>

        <div className={styles.grid}>
          <div className={`type-editorial ${styles.bio}`}>
            <p>
              I&rsquo;m a designer who works at the seam between product,
              identity, and engineering. Most of what I make is dense, quiet,
              and built to last&mdash;instrument-like, if I had to pick a
              word. I care about defaults, type rhythm, and the precise
              moment a hover state earns its keep.
            </p>
            <p>
              Lately I&rsquo;ve been writing as much code as I draw rectangles.
              Frontend systems, build tooling, the kind of internal interfaces
              that don&rsquo;t get a launch. A few public things along the
              way; mostly the work I&rsquo;m proudest of is invisible.
            </p>
            <p>
              If you&rsquo;re building something where the small parts have to
              be exactly right, we should talk.
            </p>
          </div>

          <aside className={styles.aside}>
            {ASIDE.map((row) => (
              <div key={row.key} className={styles.asideGroup}>
                <span className={`type-label ${styles.asideKey}`}>
                  {row.key}
                </span>
                <p className={`type-body ${styles.asideValue}`}>{row.value}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
