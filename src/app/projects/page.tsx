import Link from "next/link";
import { PROJECTS } from "@/components/PortfolioDial/projects";
import Footer from "@/components/sections/Footer/Footer";
import styles from "./page.module.css";

export default function ProjectsIndexPage() {
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.heading}>Projects</h1>
        <p className={styles.lead}>
          Select a case study. Same layout will apply to each project page.
        </p>
        <ul className={styles.list}>
          {PROJECTS.map((p) => (
            <li key={p.id}>
              <Link className={styles.link} href={`/projects/${p.id}`}>
                {p.title}
                <span className={styles.meta}>
                  {p.year} · {p.role}
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
