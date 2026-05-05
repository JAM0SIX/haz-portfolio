import PortfolioDial from "@/components/PortfolioDial/PortfolioDial";
import styles from "./DialSection.module.css";

export default function DialSection() {
  return (
    <section id="dial" className={styles.section} aria-label="Selected work">
      <PortfolioDial />
    </section>
  );
}
