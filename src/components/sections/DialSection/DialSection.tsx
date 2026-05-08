import PortfolioDial from "@/components/PortfolioDial/PortfolioDial";
import styles from "./DialSection.module.css";

export default function DialSection() {
  return (
    <section
      id="dial"
      className={styles.section}
      aria-labelledby="dial-heading"
    >
      <header className={styles.topbar}>
        <h2 id="dial-heading" className={styles.topbarTitle}>
          Key project
        </h2>
      </header>
      <PortfolioDial />
    </section>
  );
}
