import type { CSSProperties, ReactNode } from "react";
import Button from "@/components/ui/Button";
import styles from "./AboutSection.module.css";

type Trait = {
  title: string;
  body: ReactNode;
};

const TRAITS: Trait[] = [
  {
    title: "AI native",
    body: (
      <>
        Focus on AI digital transformation. In fact, I&rsquo;ve been
        designing AI products before it was cool. Expert in bringing
        research and design closer to code with a focus on AI
        communication&hellip;
      </>
    ),
  },
  {
    title: "Student of tech",
    body: (
      <>
        This is a turbulent time in tech but I&rsquo;m embracing the ever
        evolving role of a designer. That is due to my belief to always{" "}
        <em>learn</em> and <em>live</em>.
      </>
    ),
  },
  {
    title: "Happy",
    body: <>Thanks for stopping by, I hope you enjoyed viewing my work.</>,
  },
];

const FIELDS = [
  "Finance",
  "Professional services",
  "Data",
  "Med-tech",
  "Agencies",
  "and more",
];

type AboutSectionProps = {
  /** Optional portrait image URL. When omitted, a tonal gradient placeholder
      with a hint label is rendered in its place. */
  portraitSrc?: string;
  /** Caption shown beside the portrait (top of the right column). */
  caption?: ReactNode;
  /** Click handler for the secondary CTA. */
  onAboutMeClick?: () => void;
};

export default function AboutSection({
  portraitSrc = "/projects/Aboutme.png",
  caption = (
    <>
      35mm
      <br />
      Manhattan rooftop
    </>
  ),
  onAboutMeClick,
}: AboutSectionProps = {}) {
  const portraitStyle: CSSProperties | undefined = portraitSrc
    ? { backgroundImage: `url(${portraitSrc})` }
    : undefined;

  return (
    <section id="about" className={styles.section} aria-label="About">
      <div className={styles.shell}>
        <div className={styles.heroImage} style={portraitStyle}>
          {!portraitSrc && (
            <span className={styles.imagePlaceholderNote}>
              Replace with portrait.jpg
            </span>
          )}
        </div>

        <div className={styles.heroSide}>
          <p className={styles.filemeta}>{caption}</p>
          <Button variant="secondary" arrow="→" onClick={onAboutMeClick}>
            About Me
          </Button>
        </div>

        {TRAITS.map((t) => (
          <div key={t.title} className={styles.trait}>
            <h4 className={styles.traitHeading}>{t.title}</h4>
            <hr className={styles.rule} />
            <p className={styles.traitBody}>{t.body}</p>
          </div>
        ))}

        <div className={styles.fields}>
          <h4 className={styles.fieldsHeading}>Fields of work</h4>
          <hr className={styles.rule} />
          <ul className={styles.fieldsList}>
            {FIELDS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
