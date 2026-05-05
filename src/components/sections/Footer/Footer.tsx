import styles from "./Footer.module.css";

const NAV_LINKS = [
  { label: "Work", href: "#dial" },
  { label: "Reading", href: "#reading" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "About", href: "#about" },
];

const CONTACT_LINKS = [
  { label: "hello@haz.studio", href: "mailto:hello@haz.studio" },
  { label: "Are.na", href: "https://www.are.na", external: true },
  { label: "Read.cv", href: "https://read.cv", external: true },
  { label: "GitHub", href: "https://github.com", external: true },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className={styles.footer}
      aria-labelledby="footer-title"
    >
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h2
              id="footer-title"
              className={`type-display ${styles.wordmark}`}
            >
              Haz<em>.</em>
            </h2>
            <p className={`type-body ${styles.tagline}`}>
              Designer of products, identity systems, and small precise
              things. London, working internationally.
            </p>
          </div>

          <nav className={styles.column} aria-label="Site navigation">
            <span className={`type-technical ${styles.columnTitle}`}>
              Index
            </span>
            <ul className={styles.linkList}>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a className={`type-body ${styles.link}`} href={l.href}>
                    <span>{l.label}</span>
                    <span className={styles.linkArrow} aria-hidden>
                      &rarr;
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.column}>
            <span className={`type-technical ${styles.columnTitle}`}>
              Contact
            </span>
            <ul className={styles.linkList}>
              {CONTACT_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    className={`type-body ${styles.link}`}
                    href={l.href}
                    {...(l.external
                      ? { target: "_blank", rel: "noreferrer noopener" }
                      : {})}
                  >
                    <span>{l.label}</span>
                    <span className={styles.linkArrow} aria-hidden>
                      {l.external ? "\u2197" : "\u2192"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`type-technical ${styles.bottom}`}>
          <span>
            <span className={styles.statusDot} />
            STATUS &middot; ACTIVE &middot; {new Date().getFullYear()} HAZ.
          </span>
          <span>v0.1 &middot; BUILT WITH NEXT</span>
        </div>
      </div>
    </footer>
  );
}
