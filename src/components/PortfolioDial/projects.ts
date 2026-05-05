export type Metric = readonly [label: string, value: string, unit: string];

export type Project = {
  id: string;
  title: string;
  role: string;
  year: string;
  tags: string[];
  /** Optional — center disc currently renders solid `--paper-deep`. */
  image?: string;
  summary: string;
  metrics: readonly Metric[];
};

export const PROJECTS: readonly Project[] = [
  {
    id: "philpotpearce",
    title: "PHILPOT—PEARCE",
    role: "Lead Designer & Consultant",
    year: "2026",
    tags: ["Identity", "Product", "Web"],
    summary:
      "End-to-end product and identity for a London-based studio. Type system, motion language, component library, and a static site that scores 100 on every Lighthouse axis.",
    metrics: [
      ["ENGAGEMENT", "+ 42.0", "%"],
      ["LOAD TIME", "— 1.18", "s"],
      ["COMPONENTS", "128", ""],
    ],
  },
  {
    id: "gwi",
    title: "GWI",
    role: "Senior Product Designer, Data",
    year: "2025 - Current",
    tags: ["Dataviz", "Dashboard", "B2B"],
    summary:
      "Reworked the audience-insights dashboard for the world's largest consumer-research platform. Reduced query-to-insight time by half through progressive disclosure and a unified chart grammar.",
    metrics: [
      ["TIME-TO-INSIGHT", "— 51.4", "%"],
      ["NPS", "+ 18", "pt"],
      ["CHARTS", "36", ""],
    ],
  },
  {
    id: "lexisnexis",
    title: "LEXISNEXIS",
    role: "Senior Product Designer",
    year: "2023 - 2025",
    tags: ["Enterprise", "Search", "AI"],
    summary:
      "Designed the legal-search experience for an AI-augmented research tool used by 60,000 lawyers. Citation-first results, source-grounded summaries, and a deterministic disclosure pattern.",
    metrics: [
      ["SEARCHES / DAY", "410k", ""],
      ["CITATION RATE", "99.2", "%"],
      ["LAWYERS", "60 030", ""],
    ],
  },
  {
    id: "soundtrends",
    title: "SOUNDTRENDS",
    role: "Personal project",
    year: "2026",
    tags: ["Audio", "Discovery", "Mobile"],
    summary:
      "Reimagined music discovery for a long-running app with a loyal but ageing user base. Native iOS, audio-first navigation, daily mixtape rituals, and a typography pass that doubled DAU retention.",
    metrics: [
      ["DAU RETENTION", "+ 104", "%"],
      ["SESSIONS", "+ 38.0", "%"],
      ["STREAMS", "2.4 M", ""],
    ],
  },
] as const;
