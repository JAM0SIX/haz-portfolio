import FooterLogoDots from "./FooterLogoDots";
import FooterNavLink from "./FooterNavLink";
import styles from "./Footer.module.css";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "/about" },
  { label: "Read.cv", href: "https://read.cv/", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/", external: true },
  { label: "Get in touch", href: "mailto:harryspawforth@gmail.com" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className={styles.footer}
      aria-labelledby="footer-title"
    >
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <h2 id="footer-title" className={styles.logoHeading}>
            <div className={styles.logoDotsMount}>
              <FooterLogoDots ariaLabel="Haz" />
            </div>
          </h2>
          <div className={styles.sideColumn}>
            <ul className={styles.nav} aria-label="Footer navigation">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <FooterNavLink
                    href={l.href}
                    label={l.label}
                    external={Boolean(l.external)}
                  />
                </li>
              ))}
            </ul>
            <p className={styles.tagline}>
              Learning with <em>intent</em>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
