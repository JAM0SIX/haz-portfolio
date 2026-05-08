"use client";

/* ─────────────────────────────────────────────────────────────
   NotebookArticle — Field Notes editorial template.

   A minimal, utility-editorial article page styled like a
   composition notebook: warm off-white paper, faint blue ruled
   lines on a 32px baseline, an ink-red margin rule, and a
   single accent color. Set in Newsreader (editorial serif) and
   JetBrains Mono (utility labels).

   The page opens straight on the eyebrow → headline. There is no
   top masthead and no left-side meta column; the body fills the
   page with a single right-hand gutter that pull-quotes, stats,
   the hero, the inline figure and the colophon span across.

   Templated CMS slots wired up as `data-slot` attributes:

     eyebrow · headline · deck · byline ·
     hero_image (src/caption/credit) · body.dropcap_paragraph ·
     body.paragraphs · section_heading · pull_quote ·
     inline_image · stats · sidebar_aside · endmark ·
     tags · further_reading.

   Behaviour:
     · Inline marginalia marks in the body — visual only in
       this layout, since the dedicated margin column was removed.
     · Optional CMS-overlay (driven by the showTemplate prop)
       outlines every templated slot with its field name.
   ───────────────────────────────────────────────────────────── */

import type { CSSProperties, ReactNode } from "react";
import type { Article } from "@/components/BookLogCarousel/articles";

/* ─── Tokens ─────────────────────────────────────────────────── */

const TOKENS = {
  paper: "oklch(0.975 0.012 80)",
  paperEdge: "oklch(0.945 0.014 78)",
  ink: "oklch(0.20 0.018 60)",
  inkSoft: "oklch(0.42 0.020 60)",
  inkFaint: "oklch(0.66 0.018 60)",
  rule: "oklch(0.60 0.115 250 / 0.32)",
  ruleSoft: "oklch(0.60 0.115 250 / 0.18)",
  accent: "oklch(0.55 0.18 25)",
} as const;

/* ─── Helpers ────────────────────────────────────────────────── */

/* Article.date arrives as "2026.04.18" — turn it into the editorial
   "APR 18, 2026" the byline strip expects. Falls back to the raw
   string if the input doesn't match the dotted pattern. */
function formatArticleDate(input: string): string {
  const m = input.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!m) return input;
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  const month = months[Number(m[2]) - 1] ?? m[2];
  return `${month} ${m[3]}, ${m[1]}`;
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ─── Types ──────────────────────────────────────────────────── */

type PaperTexture = "ruled" | "grid" | "dot" | "blank";
type DropCapStyle = "ink" | "block" | "outline";

type MetaCell = { k: string; v: string };

type StatCell = { v: string; sup?: string; k: string };

type FurtherItem = { n: string; t: string; meta?: string };

type BodyBlock =
  | { type: "p"; nodes: ReactNode; dropcap?: boolean; lead?: boolean }
  | { type: "h2"; num: string; text: string }
  | { type: "pullquote" }
  | { type: "fig" }
  | { type: "stats" }
  | { type: "aside" }
  | { type: "endmark" };

export type NotebookArticleProps = {
  /** Notebook paper background. */
  paper?: PaperTexture;
  /** Drop-cap variant for the lead paragraph. */
  dropCap?: DropCapStyle;
  /** Override the ink-red accent. Any CSS color. */
  accent?: string;
  /** Reveal inline marginalia marks (the small superscripted highlights). */
  showAnnotations?: boolean;
  /** Outline every CMS slot with its field name. */
  showTemplate?: boolean;
  /**
   * Optional article record — when supplied, the editorial header
   * (eyebrow, headline, deck, byline strip, accent) is driven by the
   * BookLog Article fields. The rich body, stats, pull-quote, fig and
   * colophon below the byline remain as scaffold content for the CMS
   * to fill in per article.
   */
  article?: Article;
};

/* ─── Default content ────────────────────────────────────────── */

const ARTICLE = {
  issue: "ISSUE 04",
  section: "FIELD NOTES",
  date: "MAY 08, 2026",
  readTime: "12 MIN READ",
  filed: "VOL. 04 / FOLIO 12",
  number: "№ 037",
  eyebrow: "An Essay on Quiet Software",
  byline: { name: "M. Ostlund", role: "Staff Designer" },
  meta: [
    { k: "Filed", v: "May 08, 2026" },
    { k: "Section", v: "Field Notes" },
    { k: "Reading", v: "12 min · 2,840 wd" },
    { k: "Set in", v: "Newsreader / JetBrains Mono" },
  ] satisfies MetaCell[],
  hero: {
    caption:
      "A workbench at the studio, three weeks before the project shipped. Marker on butcher paper; the spec was thinner than the prototype.",
    credit: "PHOTO — A. PERRELLI",
  },
  stats: [
    { v: "63", sup: "%", k: "Reduction in interface elements between v0 and ship" },
    { v: "1.2", sup: "kb", k: "Total weight of the final stylesheet, gzipped" },
    { v: "11", k: "Months in private build with the same four testers" },
    { v: "0", k: "Notification permissions requested at any point" },
  ] satisfies StatCell[],
  pullquote: {
    text:
      "The honest measure of a tool is whether you reach for it on a Sunday — not whether it can do everything you asked of it on a Monday.",
    attrib: "Working note, week 31",
  },
  inlineFig: {
    label: "FIGURE 02",
    caption:
      "Sketches from the second redesign. The middle column was deleted that afternoon and never returned.",
    credit: "STUDIO ARCHIVE",
  },
  aside: {
    label: "MARGINALIA",
    title: "On the cost of being clever",
    body:
      "A footnote we kept circling back to: every clever interaction we shipped had a maintenance bill that came due in roughly six weeks — usually on a Friday. We started writing the bill into the spec next to the feature.",
  },
  tags: ["Tools", "Process", "Editorial", "Slow Software", "Field Notes", "2026"],
  further: [
    { n: "01", t: "On reading the room before drawing the screen", meta: "Vol. 03" },
    { n: "02", t: "Three drafts of a settings menu, none kept", meta: "Vol. 03" },
    { n: "03", t: "What changed when we deleted the dashboard", meta: "Vol. 04" },
  ] satisfies FurtherItem[],
};

/** Inline marginalia marker — a small superscripted highlight in body text. */
function Anno({ num, children }: { num: number; children: ReactNode }) {
  return (
    <span className="anno" data-anno-num={num} data-num={num}>
      {children}
    </span>
  );
}

const BODY: BodyBlock[] = [
  {
    type: "p",
    dropcap: true,
    lead: true,
    nodes: (
      <>
        Begin with the part nobody asks about: the desk drawer. The first prototype lived
        there for nine weeks before anyone saw it, written into a notebook with a{" "}
        <Anno num={1}>blue ballpoint</Anno> and then re-written, three days later, in
        pencil. The pencil version is the one that shipped.
      </>
    ),
  },
  {
    type: "p",
    nodes: (
      <>
        We had a brief — quiet tools, for studios — and a single instruction that became
        something like a doctrine: <em>do not give the user something to manage</em>. Every
        screen, every surface, every clever animation was charged against that line. Most
        of them lost. The interface that remains is small enough to describe in one
        paragraph; the year of subtraction is not.
      </>
    ),
  },
  { type: "h2", num: "01", text: "The grid was the brief" },
  {
    type: "p",
    nodes: (
      <>
        The thing about a ruled notebook is that it tells you when you
        are being indulgent. A line you cannot rest a sentence on is a line you should
        reconsider. We adopted a 32-pixel grid in week two and didn&apos;t break it.
        Headlines hang from it; pull-quotes breathe across two of them; the captions sit
        on a half-line under their figures. Designers who visited the studio mistook this
        for restraint. It was relief.
      </>
    ),
  },
  {
    type: "p",
    nodes: (
      <>
        Restraint is something else — restraint is when you have an option, and decline.
        The grid was a gift: it took the option away. By the third month the team had
        stopped asking <em>can we?</em> and started asking <em>does it want to?</em> Most
        things do not want to.
      </>
    ),
  },
  { type: "pullquote" },
  { type: "h2", num: "02", text: "What we threw away" },
  {
    type: "p",
    nodes: (
      <>
        A working list, transcribed from the back of a meeting agenda the week before
        launch: the onboarding tour. The empty-state illustration. The &ldquo;what&apos;s
        new&rdquo; modal. The keyboard-shortcut cheat sheet. The toast notification
        system. The settings page, twice. A second theme. A third theme. The avatar. The
        badge. The hover-reveal toolbar with the seven actions on it, which we replaced
        with three actions and a very small letter that says <em>more</em>.
      </>
    ),
  },
  { type: "fig" },
  {
    type: "p",
    nodes: (
      <>
        None of these were bad ideas. Several of them were our better ideas. The point of
        the list is not that they failed; the point is that the product worked the same —
        and in some cases better — without them. A feature you can remove without anyone
        writing in is, quietly, a feature that was never wanted.
      </>
    ),
  },
  { type: "stats" },
  { type: "h2", num: "03", text: "What we kept" },
  {
    type: "p",
    nodes: (
      <>
        Three things, in the end. A typeface chosen for its silences. A single accent
        colour, used mostly for marking, rarely for celebrating. And a body of empty space
        — a margin, really — large enough that the user always knows where the page ends.
        The product is the page; the page is mostly margin. We are still arguing about
        whether to admit this in the marketing.
      </>
    ),
  },
  { type: "aside" },
  {
    type: "p",
    nodes: (
      <>
        A year later, the tool sits in a drawer somewhere, probably next to a notebook.
        That was the brief. The rest is field notes.
      </>
    ),
  },
  { type: "endmark" },
];

/* ─── Image placeholder ─────────────────────────────────────── */

function ImgSlot({
  slot,
  ratio = "16 / 9",
}: {
  slot: string;
  ratio?: string;
}) {
  return (
    <div
      className="na-imgslot"
      data-slot={slot}
      style={{ aspectRatio: ratio } as CSSProperties}
    />
  );
}

/* ─── Main component ─────────────────────────────────────────── */

export default function NotebookArticle({
  paper = "ruled",
  dropCap = "ink",
  accent,
  showAnnotations = true,
  showTemplate = false,
  article,
}: NotebookArticleProps) {
  /* When an Article record is passed, derive the editorial header and
     metadata strip from it. The fallback values mirror the original
     hard-coded ARTICLE so the standalone demo still renders unchanged. */
  const header = article
    ? {
        eyebrow: article.subtitle,
        number: `№ ${article.num}`,
        section: article.section,
        date: formatArticleDate(article.date),
        readTime: `${article.readtime} READ`,
        title: article.title,
        deck: article.subtitle,
        byline: { name: article.author, role: "Contributor" },
        meta: [
          { k: "Filed", v: formatArticleDate(article.date) },
          { k: "Section", v: titleCase(article.section) },
          { k: "Reading", v: article.readtime.toLowerCase() },
          { k: "Issue", v: article.issue },
        ] satisfies MetaCell[],
      }
    : {
        eyebrow: ARTICLE.eyebrow,
        number: ARTICLE.number,
        section: ARTICLE.section,
        date: ARTICLE.date,
        readTime: ARTICLE.readTime,
        title: null as null,
        deck: null as null,
        byline: ARTICLE.byline,
        meta: ARTICLE.meta,
      };

  /* Per-article accent is derived from the cover hue so the page tints
     in sympathy with the carousel cover the user clicked through from.
     An explicit `accent` prop still wins. */
  const derivedAccent =
    accent ??
    (article
      ? `oklch(0.55 0.18 ${article.cover.hue})`
      : TOKENS.accent);

  /* Per-instance CSS variables so multiple articles can coexist. */
  const styleVars = {
    ["--na-paper" as string]: TOKENS.paper,
    ["--na-paper-edge" as string]: TOKENS.paperEdge,
    ["--na-ink" as string]: TOKENS.ink,
    ["--na-ink-soft" as string]: TOKENS.inkSoft,
    ["--na-ink-faint" as string]: TOKENS.inkFaint,
    ["--na-rule" as string]: TOKENS.rule,
    ["--na-rule-soft" as string]: TOKENS.ruleSoft,
    ["--na-accent" as string]: derivedAccent,
  } as CSSProperties;

  return (
    <div className="na-root" style={styleVars}>
      <style>{CSS}</style>

      <div
        className="na-sheet"
        data-paper={paper}
        data-dropcap={dropCap}
        data-template={showTemplate ? "on" : "off"}
      >
        <article className="na-article" data-show-anno={showAnnotations ? "on" : "off"}>
          <div className="na-eyebrow" data-slot="eyebrow">
            <span className="na-sq" />
            <span>{header.eyebrow}</span>
            <span className="na-sep" />
            <span className="na-num">{header.number}</span>
          </div>

          <h2 className="na-hed" data-slot="headline">
            {header.title ? (
              header.title
            ) : (
              <>
                Field notes on <em>quiet</em> tools.
              </>
            )}
          </h2>

          <p className="na-deck" data-slot="deck">
            {header.deck ??
              "After a year designing software meant to fade into a desk drawer, an inventory of what was kept, what was thrown away, and what is still being argued about in the margins."}
          </p>

          <div className="na-byline" data-slot="byline">
            {header.meta.map((m, i) => (
              <div key={i} className="na-cell">
                <span className="na-k">{m.k}</span>
                <span className="na-v">{m.v}</span>
              </div>
            ))}
          </div>

          <figure className="na-hero" data-slot="hero_image">
            <ImgSlot slot="hero_image.src" />
            <figcaption className="na-caption">
              <span data-slot="hero_image.caption">{ARTICLE.hero.caption}</span>
              <span className="na-credit" data-slot="hero_image.credit">
                {ARTICLE.hero.credit}
              </span>
            </figcaption>
          </figure>

          {BODY.map((blk, i) => {
            if (blk.type === "p") {
              const isFirst = !!blk.dropcap;
              const cls = [
                "na-p",
                blk.dropcap ? "na-dropcap" : "",
                blk.lead ? "na-lead" : "",
              ]
                .filter(Boolean)
                .join(" ");
              const slot = isFirst
                ? "body.dropcap_paragraph"
                : i === 1
                ? "body.paragraphs"
                : undefined;
              return (
                <div
                  className="na-body"
                  key={i}
                  {...(slot ? { "data-slot": slot } : {})}
                >
                  <p className={cls}>{blk.nodes}</p>
                </div>
              );
            }
            if (blk.type === "h2") {
              return (
                <div className="na-body" key={i}>
                  <h2 data-slot={`section_heading[${blk.num}]`}>
                    <span className="na-nm">{blk.num} — Section</span>
                    {blk.text}
                  </h2>
                </div>
              );
            }
            if (blk.type === "pullquote") {
              return (
                <aside className="na-pullquote" key={i} data-slot="pull_quote">
                  <span className="na-mark">&ldquo;</span>
                  <div>
                    <q data-slot="pull_quote.text">{ARTICLE.pullquote.text}</q>
                    <div className="na-attrib">
                      <span className="na-dash" />
                      <span data-slot="pull_quote.attribution">
                        {ARTICLE.pullquote.attrib}
                      </span>
                    </div>
                  </div>
                </aside>
              );
            }
            if (blk.type === "fig") {
              return (
                <figure className="na-inline-fig" key={i} data-slot="inline_image">
                  <ImgSlot slot="inline_image.src" ratio="4 / 3" />
                  <div>
                    <div className="na-meta" data-slot="inline_image.caption">
                      <span className="na-meta-label">Caption</span>
                      {ARTICLE.inlineFig.caption}
                    </div>
                    <div className="na-meta" data-slot="inline_image.credit">
                      <span className="na-meta-label">Credit</span>
                      {ARTICLE.inlineFig.credit}
                    </div>
                  </div>
                </figure>
              );
            }
            if (blk.type === "stats") {
              return (
                <div
                  className="na-stats"
                  key={i}
                  data-slot="stats"
                  data-slot-pos="below"
                >
                  {ARTICLE.stats.map((s, j) => (
                    <div className="na-stat" key={j}>
                      <span className="na-stat-v">
                        {s.v}
                        {s.sup ? <sup>{s.sup}</sup> : null}
                      </span>
                      <span className="na-stat-k">{s.k}</span>
                    </div>
                  ))}
                </div>
              );
            }
            if (blk.type === "aside") {
              return (
                <aside className="na-aside" key={i} data-slot="sidebar_aside">
                  <div className="na-aside-label">
                    <span className="na-aside-dot" />
                    {ARTICLE.aside.label}
                  </div>
                  <div>
                    <h3>{ARTICLE.aside.title}</h3>
                    <p>{ARTICLE.aside.body}</p>
                  </div>
                </aside>
              );
            }
            if (blk.type === "endmark") {
              return (
                <div className="na-endmark" key={i} data-slot="endmark">
                  <span className="na-end-sq" />
                  <span>
                    End — Filed {header.date} · {header.byline.name}
                  </span>
                  <span className="na-end-line" />
                </div>
              );
            }
            return null;
          })}

          <div className="na-colophon">
            <div data-slot="further_reading">
              <h4>Further reading</h4>
              <div className="na-further">
                {ARTICLE.further.map((f, i) => (
                  <a key={i}>
                    <span className="na-fn">{f.n}</span>
                    <span className="na-ft">{f.t}</span>
                    <span className="na-arrow">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */

const CSS = `
.na-root{
  --na-margin: 96px;
  background: var(--na-paper-edge);
  color: var(--na-ink);
  font-family: "Newsreader", Georgia, "Times New Roman", serif;
  font-optical-sizing: auto;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  min-height: 100vh;
  padding: 0;
}
.na-root *{ box-sizing: border-box; }
.na-mono{ font-family: "JetBrains Mono", ui-monospace, monospace; }

/* Sheet */
.na-sheet{
  max-width: 1180px; margin: 0 auto;
  background: var(--na-paper); position: relative;
}
.na-sheet[data-paper="ruled"]{
  background-image:
    linear-gradient(to right, transparent 0, transparent calc(var(--na-margin) - 1px),
      var(--na-accent) calc(var(--na-margin) - 1px),
      var(--na-accent) var(--na-margin),
      transparent var(--na-margin)),
    repeating-linear-gradient(to bottom,
      transparent 0, transparent 31px,
      var(--na-rule) 31px, var(--na-rule) 32px);
  background-color: var(--na-paper);
}
.na-sheet[data-paper="grid"]{
  background-color: var(--na-paper);
  background-image:
    linear-gradient(to right, var(--na-rule-soft) 1px, transparent 1px),
    linear-gradient(to bottom, var(--na-rule-soft) 1px, transparent 1px);
  background-size: 24px 24px;
}
.na-sheet[data-paper="dot"]{
  background-color: var(--na-paper);
  background-image: radial-gradient(var(--na-rule) 1px, transparent 1.2px);
  background-size: 22px 22px;
  background-position: 11px 11px;
}
.na-sheet[data-paper="blank"]{ background-color: var(--na-paper); }

/* Article grid — body column + right gutter */
.na-article{
  --na-col-w: 640px;
  --na-gap: 32px;
  display: grid;
  grid-template-columns: var(--na-col-w) 1fr;
  gap: 0 var(--na-gap);
  padding: 56px 96px 0;
  position: relative;
}

/* Eyebrow / Hed / Deck */
.na-eyebrow{
  grid-column: 1 / 3;
  display: flex; align-items: center; gap: 14px;
  padding-top: 64px; padding-bottom: 28px;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--na-accent);
}
.na-eyebrow .na-sq{ width: 8px; height: 8px; background: var(--na-accent); display: inline-block; }
.na-eyebrow .na-sep{ flex: 1; height: 1px; background: var(--na-ink); max-width: 200px; opacity: .85; }
.na-eyebrow .na-num{ color: var(--na-ink-soft); letter-spacing: .18em; }

.na-hed{
  grid-column: 1 / 3;
  margin: 0 0 18px;
  font-family: "DM Serif Display", "Newsreader", serif;
  font-weight: 400;
  font-size: clamp(54px, 7.6vw, 104px);
  line-height: .96;
  letter-spacing: -.022em;
  color: var(--na-ink);
  text-wrap: balance;
}
.na-hed em{ font-style: italic; color: var(--na-accent); font-family: "Newsreader", serif; font-weight: 300; }

.na-deck{
  grid-column: 1 / 2;
  font-size: 22px; line-height: 1.36; color: var(--na-ink-soft);
  margin: 6px 0 36px; max-width: 600px; font-weight: 300; font-style: italic;
}

/* Byline strip */
.na-byline{
  grid-column: 1 / 3;
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  border-top: .5px solid var(--na-ink); border-bottom: .5px solid var(--na-ink);
  padding: 12px 0; margin: 8px 0 48px;
  font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11px; letter-spacing: .08em;
}
.na-byline .na-cell{ padding: 2px 16px 2px 0; border-right: .5px dotted var(--na-ink-faint); }
.na-byline .na-cell:last-child{ border-right: 0; }
.na-byline .na-k{ display: block; text-transform: uppercase; color: var(--na-ink-faint); font-size: 9.5px; letter-spacing: .16em; margin-bottom: 4px; }
.na-byline .na-v{ color: var(--na-ink); text-transform: none; font-size: 12.5px; letter-spacing: .02em; }

/* Hero */
.na-hero{ grid-column: 1 / 3; margin: 0 0 56px; }
.na-imgslot{
  position: relative; width: 100%;
  background:
    repeating-linear-gradient(45deg,
      oklch(0.93 0.013 78) 0, oklch(0.93 0.013 78) 8px,
      oklch(0.96 0.012 80) 8px, oklch(0.96 0.012 80) 16px);
  border: .5px solid oklch(0.78 0.014 78);
  display: flex; align-items: center; justify-content: center;
  color: var(--na-ink-soft);
}
.na-caption{
  margin-top: 12px;
  display: grid; grid-template-columns: 1fr auto; gap: 24px;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 11px; letter-spacing: .04em; color: var(--na-ink-soft); line-height: 1.5;
}
.na-credit{ text-transform: uppercase; letter-spacing: .14em; font-size: 10px; color: var(--na-ink-faint); }

/* Body */
.na-body{ grid-column: 1 / 2; font-size: 18px; line-height: 32px; color: var(--na-ink); max-width: 640px; }
.na-body .na-p{ margin: 0 0 32px; }
.na-body .na-p.na-lead{ font-size: 21px; line-height: 32px; }
.na-body a{ color: var(--na-accent); text-decoration: none; border-bottom: 1px solid var(--na-accent); }

/* Drop cap */
.na-body .na-p.na-dropcap::first-letter{
  font-family: "DM Serif Display", "Newsreader", serif;
  font-weight: 400; float: left;
  font-size: 110px; line-height: 88px; padding: 8px 14px 0 0;
  color: var(--na-accent);
}
.na-sheet[data-dropcap="block"] .na-body .na-p.na-dropcap::first-letter{
  background: var(--na-ink); color: var(--na-paper);
  padding: 16px 14px 14px 14px; margin-right: 14px;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 54px; line-height: 1; font-weight: 600;
}
.na-sheet[data-dropcap="outline"] .na-body .na-p.na-dropcap::first-letter{
  -webkit-text-stroke: 1.5px var(--na-ink); color: transparent;
  font-family: "DM Serif Display", serif;
}

/* Inline marginalia marker */
.anno{
  background: linear-gradient(to top,
    color-mix(in oklab, var(--na-accent) 16%, transparent) 0 36%,
    transparent 36%);
  cursor: default; position: relative;
}
.anno::after{
  content: attr(data-num);
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 10px; vertical-align: super; color: var(--na-accent);
  margin-left: 2px; letter-spacing: .04em;
}
.anno:hover, .anno.is-active{
  background: linear-gradient(to top,
    color-mix(in oklab, var(--na-accent) 32%, transparent) 0 36%,
    transparent 36%);
}
.na-article[data-show-anno="off"] .anno{ background: transparent; }
.na-article[data-show-anno="off"] .anno::after{ content: ""; }

.na-body h2{
  font-family: "Newsreader", serif; font-weight: 500;
  font-size: 30px; line-height: 36px; letter-spacing: -.01em;
  margin: 32px 0 24px; padding-top: 24px;
  border-top: .5px solid var(--na-ink-faint);
}
.na-body h2 .na-nm{
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--na-accent);
  display: block; margin-bottom: 8px; font-weight: 500;
}

/* Pull quote */
.na-pullquote{
  grid-column: 1 / 3; margin: 24px 0 32px;
  display: grid; grid-template-columns: 64px 1fr; gap: 24px;
  border-top: .5px solid var(--na-ink); border-bottom: .5px solid var(--na-ink);
  padding: 36px 0 32px;
}
.na-pullquote .na-mark{
  font-family: "DM Serif Display", serif; font-size: 84px; line-height: .7; color: var(--na-accent);
}
.na-pullquote q{
  quotes: none; display: block;
  font-family: "Newsreader", serif; font-style: italic; font-weight: 300;
  font-size: clamp(28px, 3vw, 40px); line-height: 1.18; letter-spacing: -.012em;
  color: var(--na-ink); text-wrap: balance;
}
.na-attrib{
  margin-top: 18px; font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--na-ink-soft);
  display: flex; align-items: center; gap: 10px;
}
.na-dash{ display: inline-block; width: 32px; height: 1px; background: var(--na-ink-soft); }

/* Stats */
.na-stats{
  grid-column: 1 / 3;
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; margin: 16px 0 56px;
  border-top: .5px solid var(--na-ink); border-bottom: .5px solid var(--na-ink);
}
.na-stat{ padding: 24px 22px 22px 0; border-right: .5px dotted var(--na-ink-faint); }
.na-stat:last-child{ border-right: 0; }
.na-stat-v{
  font-family: "DM Serif Display", serif;
  font-size: 54px; line-height: 1; letter-spacing: -.02em; color: var(--na-ink); display: block;
}
.na-stat-v sup{ font-size: 18px; color: var(--na-accent); font-family: "Newsreader", serif; font-weight: 400; vertical-align: top; margin-left: 2px; }
.na-stat-k{
  margin-top: 14px; font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--na-ink-soft); line-height: 1.5;
  display: block;
}

/* Inline figure */
.na-inline-fig{
  grid-column: 1 / 3; margin: 8px 0 48px;
  display: grid; grid-template-columns: 1fr 220px; gap: 24px;
  align-items: start;
}
.na-meta{ font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11px; line-height: 1.55; color: var(--na-ink-soft); }
.na-meta-label{ text-transform: uppercase; letter-spacing: .14em; font-size: 10px; color: var(--na-ink-faint); display: block; margin-bottom: 6px; }
.na-meta + .na-meta{ margin-top: 18px; padding-top: 18px; border-top: .5px solid var(--na-ink-faint); }

/* Aside */
.na-aside{
  grid-column: 1 / 3; margin: 16px 0 56px;
  border: .5px solid var(--na-ink); padding: 28px 32px;
  background: oklch(0.98 0.014 78);
  display: grid; grid-template-columns: 140px 1fr; gap: 32px;
}
.na-aside-label{
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase; color: var(--na-accent);
  display: flex; flex-direction: column; gap: 6px;
}
.na-aside-dot{ width: 7px; height: 7px; background: var(--na-accent); }
.na-aside h3{ margin: 0 0 12px; font-weight: 500; font-size: 22px; line-height: 1.25; letter-spacing: -.01em; }
.na-aside p{ margin: 0; font-size: 15.5px; line-height: 1.55; color: var(--na-ink-soft); }

/* Endmark */
.na-endmark{
  grid-column: 1 / 2; margin: 0 0 56px;
  display: flex; align-items: center; gap: 14px; color: var(--na-ink-faint);
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase;
}
.na-end-sq{ width: 10px; height: 10px; background: var(--na-ink); }
.na-end-line{ flex: 1; height: .5px; background: var(--na-ink-faint); }

/* Colophon */
.na-colophon{
  grid-column: 1 / 3;
  display: grid; grid-template-columns: 1fr 1fr; gap: 56px;
  border-top: .5px solid var(--na-ink); padding-top: 32px;
}
.na-colophon h4{
  margin: 0 0 18px; font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--na-ink); font-weight: 600;
}
.na-tags{ display: flex; flex-wrap: wrap; gap: 8px; }
.na-tag{
  font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11px;
  padding: 6px 12px; border: .5px solid var(--na-ink); color: var(--na-ink);
  text-transform: uppercase; letter-spacing: .1em; cursor: default;
}
.na-tag:hover{ background: var(--na-ink); color: var(--na-paper); }

.na-further{ display: flex; flex-direction: column; }
.na-further a{
  display: grid; grid-template-columns: 28px 1fr auto; align-items: baseline; gap: 14px;
  padding: 14px 0; border-bottom: .5px dotted var(--na-ink-faint);
  color: var(--na-ink); text-decoration: none; cursor: default;
}
.na-further a:hover{ background: oklch(0.98 0.014 78); }
.na-fn{ font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11px; color: var(--na-ink-faint); letter-spacing: .1em; }
.na-ft{ font-size: 16px; line-height: 1.3; font-style: italic; }
.na-arrow{ font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 14px; color: var(--na-ink-faint); }

/* Marginalia card */
.na-anno-card{
  border: .5px solid var(--na-ink);
  background: oklch(0.98 0.014 78);
  padding: 12px 14px;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 11.5px; line-height: 1.55; color: var(--na-ink);
}
.na-anno-num{ color: var(--na-accent); font-weight: 600; margin-right: 6px; }

/* Template-view overlay */
.na-sheet[data-template="on"] [data-slot]{
  position: relative;
  outline: 1px dashed var(--na-accent);
  outline-offset: 6px;
}
.na-sheet[data-template="on"] [data-slot]::before{
  content: attr(data-slot);
  position: absolute; top: -22px; left: -2px;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
  background: var(--na-accent); color: var(--na-paper);
  padding: 3px 7px; line-height: 1; white-space: nowrap;
  pointer-events: none; z-index: 5;
}
.na-sheet[data-template="on"] [data-slot][data-slot-pos="below"]::before{
  top: auto; bottom: -22px;
}

/* Responsive */
@media (max-width: 1080px){
  .na-article{ grid-template-columns: 1fr; padding: 40px 28px 0; }
  .na-deck, .na-body, .na-endmark{ grid-column: 1; }
  .na-eyebrow, .na-hed, .na-byline, .na-hero, .na-pullquote, .na-stats, .na-inline-fig, .na-aside, .na-colophon{ grid-column: 1; }
  .na-stats{ grid-template-columns: repeat(2, 1fr); }
  .na-inline-fig{ grid-template-columns: 1fr; }
  .na-aside{ grid-template-columns: 1fr; }
  .na-colophon{ grid-template-columns: 1fr; }
}
`;
