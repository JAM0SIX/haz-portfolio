import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/components/BookLogCarousel/articles";
import Footer from "@/components/sections/Footer/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Reading · Haz.",
  description:
    "An index of essays, field notes and longform writing — the notebook behind the carousel.",
};

export default function ReadingIndexPage() {
  return (
    <>
      <main className={styles.main}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back
          </Link>
          <h1 className={styles.heading}>Reading</h1>
          <p className={styles.lead}>
            Field notes, essays and longform — the writing behind each notebook
            on the carousel.
          </p>
        </header>

        <ul className={styles.list}>
          {ARTICLES.map((a) => (
            <li key={a.id} className={styles.item}>
              <Link className={styles.link} href={`/reading/${a.id}`}>
                <span className={styles.itemNum}>№ {a.num}</span>
                <span className={styles.itemBody}>
                  <span className={styles.itemTitle}>{a.title}</span>
                  <span className={styles.itemSubtitle}>{a.subtitle}</span>
                  <span className={styles.itemMeta}>
                    {a.section} · {a.author} · {a.readtime} · {a.date}
                  </span>
                </span>
                <span className={styles.itemArrow} aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
