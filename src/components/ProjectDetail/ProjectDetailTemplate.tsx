import Image from "next/image";
import Link from "next/link";
import AbilityCard from "@/components/AbilityCard/AbilityCard";
import type { Project } from "@/components/PortfolioDial/projects";
import Methodology from "@/components/ProjectDetail/Methodology/Methodology";
import CursorDotField from "@/components/CursorDotField/CursorDotField";
import styles from "./ProjectDetailTemplate.module.css";

type Props = {
  project: Project;
};

export default function ProjectDetailTemplate({ project }: Props) {
  const outcomes = project.metrics.slice(0, 3);
  const galleryItems = [
    { id: "fig-01", label: "FIG. 01", note: "Primary product canvas used in stakeholder walkthroughs.", shape: "hero" },
    { id: "fig-02", label: "FIG. 02", note: "Component audit documenting edge-state behaviour.", shape: "smallTop" },
    { id: "fig-03", label: "FIG. 03", note: "Interaction map for key navigation and disclosure.", shape: "smallBottom" },
    { id: "fig-04", label: "FIG. 04", note: "End-to-end flow board aligning product and engineering.", shape: "wide" },
    { id: "fig-05", label: "FIG. 05", note: "High-fidelity interface pass for the core task path.", shape: "leftMid" },
    { id: "fig-06", label: "FIG. 06", note: "Research synthesis snapshot from interview rounds.", shape: "rightMid" },
    { id: "fig-07", label: "FIG. 07", note: "Iteration set comparing spacing and hierarchy options.", shape: "leftBottom" },
    { id: "fig-08", label: "FIG. 08", note: "Final visual QA sweep before release handoff.", shape: "rightBottom" },
    { id: "fig-09", label: "FIG. 09", note: "Closing flow board summarising the shipped experience.", shape: "wideBottom" },
  ] as const;
  const reflectionItems = [
    {
      id: "l-01",
      label: "L / 01",
      title: "Most problems are search problems.",
      body:
        "Users mostly need help finding the right thing fast. Good search should guide, not force a new mental model.",
    },
    {
      id: "l-02",
      label: "L / 02",
      title: "AI tools have their own pain points.",
      body:
        "AI summaries can introduce risk when stakes are high. Time-to-validation became a key metric to keep trust intact.",
    },
    {
      id: "l-03",
      label: "L / 03",
      title: "Capabilities + context = concept.",
      body:
        "Strong concepts come from matching what the model can do with what users are trying to achieve in the moment.",
    },
    {
      id: "l-04",
      label: "L / 04",
      title: "AI is not the feature.",
      body:
        "People care about outcomes, not the engine. The goal is a better experience, whether or not AI is visible.",
    },
  ] as const;
  const heroItem = galleryItems.find((item) => item.shape === "hero");
  const smallTopItem = galleryItems.find((item) => item.shape === "smallTop");
  const smallBottomItem = galleryItems.find((item) => item.shape === "smallBottom");
  const remainingGalleryItems = galleryItems.filter(
    (item) => item.shape !== "hero" && item.shape !== "smallTop" && item.shape !== "smallBottom",
  );

  const renderGalleryItem = (item: (typeof galleryItems)[number]) => (
    <figure
      key={item.id}
      className={`${styles.galleryItem} ${styles[`galleryItem${item.shape[0].toUpperCase()}${item.shape.slice(1)}`]}`}
    >
      <div className={styles.galleryMedia}>
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} gallery frame ${item.label}`}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        ) : null}
      </div>
      <figcaption className={styles.galleryCaption}>
        <span className={styles.galleryTag}>{item.label}</span>
        <p>{item.note}</p>
      </figcaption>
    </figure>
  );

  return (
    <article className={styles.wrap}>
      <div className={styles.introContainer}>
        <CursorDotField variant="paper" />
        <div className={styles.introContent}>
          <Link className={styles.back} href="/#dial">
            ← Back
          </Link>

          <header className={styles.heroSection}>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.subtitle}>
              {project.role} · {project.year} · {project.tags.join(" / ")}
            </p>
            <p className={styles.heroCopy}>{project.summary}</p>
          </header>

          {project.image ? (
            <div className={styles.hero}>
              <Image
                src={project.image}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 900px"
                priority
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : (
            <div className={styles.hero} aria-hidden />
          )}

          <section className={styles.outcomesSection}>
            <div className={styles.outcomesGrid}>
              {outcomes.map(([k, v, u]) => (
                <AbilityCard
                  key={k}
                  title={`${v}${u ?? ""}`}
                  description={k}
                  variant="metric"
                  className={styles.outcomeCard}
                  tabIndex={0}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className={styles.methodologySection} aria-labelledby="methodology-heading">
        <div className={styles.methodologyContainer}>
          <h2 id="methodology-heading" className={styles.sectionLabel}>
            Methodology / 002
          </h2>
          <Methodology />
        </div>
      </section>

      <section className={styles.gallerySection} aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className={styles.sectionLabel}>
          Gallery / 003
        </h2>
        <div className={styles.galleryGrid}>
          {heroItem && smallTopItem && smallBottomItem ? (
            <div className={styles.galleryTopCluster}>
              {renderGalleryItem(heroItem)}
              <div className={styles.gallerySmallStack}>
                {renderGalleryItem(smallTopItem)}
                {renderGalleryItem(smallBottomItem)}
              </div>
            </div>
          ) : null}
          {remainingGalleryItems.map(renderGalleryItem)}
        </div>
      </section>

      <section className={styles.reflectionSection} aria-labelledby="reflection-heading">
        <p className={styles.sectionLabel}>
          Reflection / 004
        </p>
        <h2 id="reflection-heading" className={styles.reflectionIntro}>
          The lessons that outlived the brief{" "}
          <span className={styles.reflectionIntroMuted}>and still shape how I work.</span>
        </h2>
        <div className={styles.reflectionGrid}>
          {reflectionItems.map((item) => (
            <article key={item.id} className={styles.reflectionCard}>
              <p className={styles.reflectionLabel}>{item.label}</p>
              <h4 className={styles.reflectionTitle}>{item.title}</h4>
              <p className={styles.reflectionBody}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}
