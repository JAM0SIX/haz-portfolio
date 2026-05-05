import Button from "@/components/ui/Button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p className={`type-technical ${styles.eyebrow}`}>P/00 · Foundation</p>

        <h1 className={`type-hero ${styles.wordmark}`}>
          Haz<em>.</em>
        </h1>

        <p className={`type-body ${styles.lede}`}>
          A minimal, technical, instrument-like portfolio. The foundation is
          live — design tokens, typography recipes, and the chamfered button
          system are wired up. Hover any button to see the system breathe.
        </p>

        <div className={styles.actions}>
          <Button variant="primary" arrow="→">
            Open Project
          </Button>
          <Button variant="secondary" arrow="↗">
            Open Case
          </Button>
          <Button variant="tertiary">View Index</Button>
        </div>

        <div className={`type-technical ${styles.foot}`}>
          <span>Status · Active</span>
          <span>v0.1</span>
        </div>
      </main>
    </div>
  );
}
