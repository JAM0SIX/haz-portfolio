import PortfolioDial from "@/components/PortfolioDial/PortfolioDial";
import styles from "./DialSection.module.css";

export default function DialSection() {
  return (
    <section id="dial" className={styles.section} aria-label="Selected work">
      <p className={`type-technical ${styles.eyebrow}`}>
        WORK / 001 · 04 PROJECTS
      </p>
      <PortfolioDial />
    </section>
  );
}
