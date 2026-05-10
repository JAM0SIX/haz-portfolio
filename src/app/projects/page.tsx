import Image from "next/image";
import Link from "next/link";
import { PROJECTS, type Project } from "@/components/PortfolioDial/projects";
import Footer from "@/components/sections/Footer/Footer";
import styles from "./page.module.css";

/** Split PROJECTS into two columns, alternating by index.
 *  Desktop: col-A renders projects 1, 3 ; col-B renders projects 2, 4.
 *  Each card carries its global 1-based index so the mobile media query
 *  can re-order them back into source order via .project--pN classes. */
function partitionByColumn(items: readonly Project[]) {
  const colA: Array<{ project: Project; idx: number }> = [];
  const colB: Array<{ project: Project; idx: number }> = [];
  items.forEach((project, i) => {
    (i % 2 === 0 ? colA : colB).push({ project, idx: i });
  });
  return { colA, colB };
}

function ProjectCard({ project, idx }: { project: Project; idx: number }) {
  const orderClass = styles[`project--p${idx + 1}`];

  return (
    <Link
      href={`/projects/${project.id}`}
      className={`${styles.project} ${orderClass ?? ""}`}
      aria-label={`Open case study: ${project.title}`}
    >
      <div className={styles.project__image}>
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 720px) 100vw, 480px"
          />
        ) : null}
      </div>

      <div className={styles.project__head}>
        <h3 className={styles.project__title}>{project.title}</h3>
        <span className={styles.project__date}>{project.year}</span>
      </div>
      <p className={styles.project__role}>{project.role}</p>

      <div className={styles.project__pills}>
        {project.tags.map((tag) => (
          <span key={tag} className={styles.pill}>
            <span>{tag}</span>
          </span>
        ))}
      </div>

      <div className={styles.project__reveal}>
        <div className={styles["project__reveal-inner"]}>
          <div className={styles.project__metrics}>
            {project.metrics.map(([label, value, unit]) => (
              <div key={label} className={styles.project__metric}>
                <span className={styles["project__metric-value"]}>
                  {value}
                  {unit}
                </span>
                <span className={styles["project__metric-label"]}>{label}</span>
              </div>
            ))}
          </div>
          <p className={styles.project__desc}>{project.summary}</p>
          <span className={styles.project__cta}>
            Open case study
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsIndexPage() {
  const { colA, colB } = partitionByColumn(PROJECTS);

  return (
    <>
      <main className={styles.page}>
        <div className={styles.column}>
          <p className={styles.bio}>
            <strong>Design and engineering by Harry.</strong> A
            designer-engineer building tactile, instrument-like tools — apps,
            browsers, plugins, and the occasional{" "}
            <span className={styles.accent}>long-form note</span>. Currently
            working between Figma and code.
          </p>
        </div>

        <div className={`${styles.column} ${styles["column--wide"]}`}>
          <section aria-label="Work">
            <div className={styles.section__head}>
              <span className={styles.section__label}>Work</span>
              <span className={styles.section__rule} aria-hidden="true" />
              <span className={styles.section__count}>
                {PROJECTS.length} projects
              </span>
            </div>

            <div className={styles.projects}>
              <div className={styles.projects__col}>
                {colA.map(({ project, idx }) => (
                  <ProjectCard key={project.id} project={project} idx={idx} />
                ))}
              </div>
              <div className={styles.projects__col}>
                {colB.map(({ project, idx }) => (
                  <ProjectCard key={project.id} project={project} idx={idx} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
