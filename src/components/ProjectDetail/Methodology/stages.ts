export type Stage = {
  id: string;
  label: string;
  title: string;
  body: string;
  readout: string;
  metaLabel: string;
  metaBody: string;
  href: string;
};

export const STAGES: readonly Stage[] = [
  {
    id: "discover",
    label: "Strategy",
    title: "Map the legal-research workflow",
    body:
      "Interviewed associates, partners, and knowledge staff to map where legal research slows down and where confidence in AI outputs drops.",
    readout: "01 / RESEARCH",
    metaLabel: "Primary insight",
    metaBody: "Users trust citations before summaries.",
    href: "#",
  },
  {
    id: "define",
    label: "Philosophy",
    title: "Turn ambiguity into product principles",
    body:
      "Translated qualitative findings into concrete design principles: source-grounded responses, transparent confidence, and deterministic disclosure patterns.",
    readout: "02 / PRINCIPLES",
    metaLabel: "Design north star",
    metaBody: "Evidence first, explanation second.",
    href: "#",
  },
  {
    id: "prototype",
    label: "AI",
    title: "Prototype citation-first interactions",
    body:
      "Built interactive prototypes exploring search-result cards, citation trails, and progressive detail reveals to test comprehension speed.",
    readout: "03 / PROTOTYPING",
    metaLabel: "Validation focus",
    metaBody: "Can lawyers verify claims in seconds?",
    href: "#",
  },
  {
    id: "ship",
    label: "Research",
    title: "Launch in scoped enterprise slices",
    body:
      "Released in controlled cohorts with telemetry around query refinement, citation opens, and session success outcomes.",
    readout: "04 / DELIVERY",
    metaLabel: "Rollout strategy",
    metaBody: "Cohort rollout with measurable checkpoints.",
    href: "#",
  },
  {
    id: "iterate",
    label: "Business",
    title: "Refine from usage and expert review",
    body:
      "Partnered with legal SMEs and PMs to tune language, information density, and ranking heuristics based on production behavior.",
    readout: "05 / OPTIMISATION",
    metaLabel: "Iteration loop",
    metaBody: "Weekly review + monthly redesign spikes.",
    href: "#",
  },
] as const;
