import CursorDotField from "@/components/CursorDotField/CursorDotField";
import styles from "./Footer.module.css";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Read.cv", href: "https://read.cv/", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/", external: true },
  { label: "Get in touch", href: "mailto:harryspawforth@gmail.com" },
];

export default function Footer() {
  return (
    <>
      <footer
        id="contact"
        className={styles.footer}
        aria-labelledby="footer-title"
      >
        {/* Cursor-tracked dot field, ink variant — same proximity
            reveal as the hero, retuned for the dark --ink-panel
            surface. Sits absolutely behind .inner via z-index;
            pointer-events pass through. */}
        <CursorDotField variant="ink" />

        <div className={styles.inner}>
          <div className={styles.footerRow}>
            <div className={styles.mark}>
              <h2 id="footer-title" className={styles.wordmark}>
                Haz
              </h2>
              <ul className={styles.nav} aria-label="Footer navigation">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      className={styles.navLink}
                      href={l.href}
                      {...(l.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className={styles.tagline}>
            Learning with <em>intent</em>
          </p>
        </div>
      </footer>

      <div className={styles.baseline}>
        <div className={styles.baselineInner}>
          <span>© {new Date().getFullYear()} Haz.</span>
          <span>Designed &amp; built · London</span>
        </div>
      </div>
    </>
  );
}
