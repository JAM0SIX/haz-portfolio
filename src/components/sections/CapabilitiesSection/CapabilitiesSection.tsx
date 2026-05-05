import AbilityCard from "@/components/AbilityCard/AbilityCard";
import styles from "./CapabilitiesSection.module.css";

/* Featured abilities surfaced under the section corner-label.
   Each card reveals body + CTA on hover/focus; tweak copy and
   hrefs to point at the live case studies. */
const FEATURED_ABILITIES: {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  external?: boolean;
}[] = [
  {
    title: "Strategy",
    description:
      "Diagnose, frame, decide. North-star artefacts and the workshops that turn them into roadmaps everyone can ship from.",
    ctaLabel: "VIEW APPROACH",
    href: "#strategy",
  },
  {
    title: "Systems",
    description:
      "Tokens, components, governance. Design systems that hold their shape across surfaces, teams, and a year of changing requirements.",
    ctaLabel: "VIEW SYSTEM",
    href: "#systems",
  },
  {
    title: "Production",
    description:
      "TypeScript, motion, accessibility. Hand-off is the pull request — interfaces that ship, scale, and stay legible after launch.",
    ctaLabel: "VIEW WORK",
    href: "#production",
  },
];

export default function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      className={styles.section}
      aria-label="Capabilities"
    >
      <div className={styles.inner}>
        <div className={styles.abilityRow}>
          {FEATURED_ABILITIES.map((a) => (
            <AbilityCard
              key={a.title}
              title={a.title}
              description={a.description}
              ctaLabel={a.ctaLabel}
              href={a.href}
              external={a.external}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
