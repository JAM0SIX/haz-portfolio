import BookLogCarousel from "@/components/BookLogCarousel/BookLogCarousel";
import styles from "./BookLogSection.module.css";

export default function BookLogSection() {
  return (
    <section
      id="reading"
      className={styles.section}
      aria-label="Currently reading"
    >
      <BookLogCarousel />
    </section>
  );
}
