import HeroCopy from "@/components/HeroCopy/HeroCopy";
import HeroBackdrop from "./HeroBackdrop";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="top" className={styles.section} aria-label="Hero">
      {/* Cursor-tracked dot field. Sits behind HeroCopy via z-index;
          pointer events pass through so HeroCopy's interactive
          words still receive clicks. */}
      <HeroBackdrop />

      {/* Wrapping HeroCopy in a relatively-positioned div lifts it
          above the absolutely-positioned backdrop without having to
          modify HeroCopy's own styles. */}
      <div className={styles.copy}>
        <HeroCopy />
      </div>
    </section>
  );
}
