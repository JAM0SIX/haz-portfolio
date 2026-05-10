import PortfolioDial from "@/components/PortfolioDial/PortfolioDial";
import styles from "./DialSection.module.css";

export default function DialSection() {
  return (
    <section
      id="dial"
      className={styles.section}
      aria-label="Key Projects"
    >
      {/* Empty topbar preserves the section's top spacing (padding-top:
          80px from .topbar) now that the visible heading was removed. */}
      <header className={styles.topbar} aria-hidden="true" />
      <PortfolioDial />
    </section>
  );
}
