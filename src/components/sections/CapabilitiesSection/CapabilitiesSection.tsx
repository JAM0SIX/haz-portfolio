import AbilityCard from "@/components/AbilityCard/AbilityCard";
import styles from "./CapabilitiesSection.module.css";

/* Featured abilities surfaced under the section corner-label.
   Cards reveal body copy on hover/focus; no in-card CTAs by design. */
const FEATURED_ABILITIES: {
  title: string;
  description: string;
}[] = [
  {
    title: "Strategy",
    description:
      "Diagnose, frame, decide. North-star artefacts and the workshops that turn them into roadmaps everyone can ship from.",
  },
  {
    title: "Systems",
    description:
      "Tokens, components, governance. Design systems that hold their shape across surfaces, teams, and a year of changing requirements.",
  },
  {
    title: "Production",
    description:
      "TypeScript, motion, accessibility. Hand-off is the pull request — interfaces that ship, scale, and stay legible after launch.",
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
