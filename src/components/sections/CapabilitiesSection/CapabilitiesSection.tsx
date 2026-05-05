import styles from "./CapabilitiesSection.module.css";

const CAPABILITIES = [
  {
    slug: "CAP/01",
    title: "Product strategy",
    body: "Roadmap shaping, narrative work, north-star artefacts, and the workshops that make them stick.",
  },
  {
    slug: "CAP/02",
    title: "Identity systems",
    body: "Marks, type systems, and the rules that hold them together at scale across surfaces.",
  },
  {
    slug: "CAP/03",
    title: "Design ops",
    body: "Component libraries, contribution models, and the tooling that keeps a system honest.",
  },
  {
    slug: "CAP/04",
    title: "Motion",
    body: "Animation language, micro-interactions, and the easings that make a product feel inevitable.",
  },
  {
    slug: "CAP/05",
    title: "Dataviz",
    body: "Charts that pull their weight \u2014 unified grammar, source-grounded summaries, no decoration.",
  },
  {
    slug: "CAP/06",
    title: "Frontend",
    body: "Production-ready React, TypeScript, and CSS. The handoff is the pull request.",
  },
];

export default function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      className={styles.section}
      aria-labelledby="capabilities-title"
    >
      <p className={`type-technical ${styles.cornerLabel}`}>
        CAPABILITIES / 003
      </p>

      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={`type-technical ${styles.eyebrow}`}>
            CAPABILITIES / 003
          </p>
          <h2
            id="capabilities-title"
            className={`type-display ${styles.heading}`}
          >
            What I do.
          </h2>
          <p className={`type-body ${styles.lede}`}>
            Six things, in roughly the order I reach for them on any given
            week. Most projects involve at least three.
          </p>
        </div>

        <div className={styles.grid}>
          {CAPABILITIES.map((c) => (
            <article key={c.slug} className={styles.card}>
              <span className={`type-label ${styles.cardSlug}`}>{c.slug}</span>
              <h3 className={`type-heading ${styles.cardTitle}`}>{c.title}</h3>
              <p className={`type-body ${styles.cardBody}`}>{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
