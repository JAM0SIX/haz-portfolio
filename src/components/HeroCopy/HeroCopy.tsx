"use client";

/**
 * HeroCopy — A self-contained portfolio hero with four inline interactions.
 *
 * Drop this single file anywhere in a Next.js 14+ App Router project and
 * render <HeroCopy />. All components, styles, and the vectorised
 * signature path are bundled inline so there are no other files to manage.
 *
 * What renders:
 *   1. Headline:  "The [future] belongs to designers who build [pill]."
 *      - "future"   → ink-fill word with burnt-orange radial fill on hover
 *      - "[pill]"   → auto-rotating type/erase slot with orange `›` chevron,
 *                     cycling through 4 phrases on a 2.5s hold, looping forever,
 *                     paused on hover only when the full word is visible
 *   2. Subhead:   business-literate one-liner with a click-to-cycle slot on
 *                 the adjective ("well-crafted" → variants)
 *   3. Sign-off:  the inline vectorised signature, hover reveals a portrait
 *                 with intro pop + infinite gentle sway
 *
 * Setup:
 *   1. Drop your portrait at /public/images/harry.jpg (or change `portraitSrc`
 *      below). While missing, a burnt-orange placeholder shows on hover.
 *   2. Load local Sora + Apple Garamond in your root layout with
 *      next/font/local and map them to --font-sans / --font-heading.
 *
 * Theming:
 *   Override any CSS variable in `--hc-*` to retheme without editing this file.
 */

import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import "./HeroCopy.css";

// ─────────────────────────────────────────────────────────────────────────
// InkFillWord — pill word with radial ink fill on hover.
// ─────────────────────────────────────────────────────────────────────────
function InkFillWord({
  children,
  href,
  accent,
  noCursor,
  staggerIndex,
}: {
  children: ReactNode;
  href?: string;
  accent?: boolean;
  noCursor?: boolean;
  staggerIndex?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduce ? 0 : 80 + (staggerIndex ?? 0) * 110;
    const t = window.setTimeout(() => setHasMounted(true), delay);
    return () => window.clearTimeout(t);
  }, [staggerIndex]);

  const updateEntry = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--enter-x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--enter-y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const onTouch = (e: TouchEvent) => {
    const el = ref.current;
    if (!el) return;
    const t = e.touches[0];
    const r = el.getBoundingClientRect();
    el.style.setProperty("--enter-x", `${((t.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--enter-y", `${((t.clientY - r.top) / r.height) * 100}%`);
    el.classList.toggle("is-tapped");
  };

  const className = [
    "hc-fx-enter",
    hasMounted && "is-in",
    "hc-ink",
    accent && "hc-ink--accent",
    noCursor && "hc-ink--no-cursor",
  ]
    .filter(Boolean)
    .join(" ");

  const handlers = {
    className,
    onMouseEnter: updateEntry,
    onMouseLeave: updateEntry,
    onTouchStart: onTouch,
  };

  if (href) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} {...handlers}>
        {children}
      </a>
    );
  }
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} {...handlers}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// AutoTypeSlot — dark-chassis pill that auto-types phrases, looping.
// Pauses on hover only when fully typed (current word is on screen).
// Width fits the currently visible text — pill grows/shrinks with typing.
// ─────────────────────────────────────────────────────────────────────────
type Phase = "typing" | "holding" | "erasing";
type State = { text: string; phaseIndex: number; phase: Phase; tick: number };
type Action = { type: "advance"; phrases: string[] };

function reducer(state: State, action: Action): State {
  const phrase = action.phrases[state.phaseIndex % action.phrases.length];
  if (state.phase === "typing") {
    if (state.text.length < phrase.length) {
      return { ...state, text: phrase.slice(0, state.text.length + 1), tick: state.tick + 1 };
    }
    return { ...state, phase: "holding", tick: state.tick + 1 };
  }
  if (state.phase === "holding") return { ...state, phase: "erasing", tick: state.tick + 1 };
  if (state.text.length > 0) {
    return { ...state, text: state.text.slice(0, -1), tick: state.tick + 1 };
  }
  return {
    text: "",
    phaseIndex: (state.phaseIndex + 1) % action.phrases.length,
    phase: "typing",
    tick: state.tick + 1,
  };
}

function AutoTypeSlot({
  phrases,
  typeSpeed = 60,
  holdDuration = 2500,
  eraseSpeed = 35,
  staggerIndex,
}: {
  phrases: string[];
  typeSpeed?: number;
  holdDuration?: number;
  eraseSpeed?: number;
  staggerIndex?: number;
}) {
  const [state, dispatch] = useReducer(reducer, {
    text: "",
    phaseIndex: 0,
    phase: "typing" as Phase,
    tick: 0,
  });
  const timerRef = useRef<number | null>(null);
  const hoveredRef = useRef(false);
  const [hasMounted, setHasMounted] = useState(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduce.current ? 0 : 80 + (staggerIndex ?? 0) * 110;
    const t = window.setTimeout(() => setHasMounted(true), delay);
    return () => window.clearTimeout(t);
  }, [staggerIndex]);

  useEffect(() => {
    if (reduce.current) return;
    // Pause only when fully typed AND hovered.
    if (state.phase === "holding" && hoveredRef.current) return;
    const delay =
      state.phase === "holding"
        ? holdDuration
        : state.phase === "erasing"
          ? eraseSpeed
          : typeSpeed;
    timerRef.current = window.setTimeout(
      () => dispatch({ type: "advance", phrases }),
      delay
    );
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [state.tick, state.phase, phrases, typeSpeed, holdDuration, eraseSpeed]);

  const text = reduce.current ? phrases[0] : state.text;
  // Width-lock the pill to the longest phrase so it never reflows mid-cycle.
  // Without this, each new phrase changes the chassis width and can push
  // the trailing punctuation onto a new line.
  const longest = phrases.reduce((a, b) => (a.length >= b.length ? a : b), "");

  return (
    <span
      className={`hc-fx-enter ${hasMounted ? "is-in" : ""} hc-type`}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        // Re-kick the loop on resume:
        dispatch({ type: "advance", phrases });
      }}
      aria-label={`Cycling through: ${phrases.join(", ")}`}
    >
      <span className="hc-type__prompt" aria-hidden="true">
        ›
      </span>
      <span className="hc-type__vp">
        <span className="hc-type__ghost" aria-hidden="true">
          {longest}
        </span>
        <span className="hc-type__overlay">
          <span className="hc-type__text">{text}</span>
          <span className="hc-type__cursor" aria-hidden="true" />
        </span>
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SlotWord — click-cycles through alternate words. Width-locked to longest.
// ─────────────────────────────────────────────────────────────────────────
function SlotWord({
  options,
  staggerIndex,
}: {
  options: string[];
  staggerIndex?: number;
}) {
  const [index, setIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduce ? 0 : 80 + (staggerIndex ?? 0) * 110;
    const t = window.setTimeout(() => setHasMounted(true), delay);
    return () => window.clearTimeout(t);
  }, [staggerIndex]);

  const longest = options.reduce((a, b) => (a.length >= b.length ? a : b), "");
  const next = () => setIndex((i) => (i + 1) % options.length);

  return (
    <span
      className={`hc-fx-enter ${hasMounted ? "is-in" : ""} hc-slot`}
      onClick={next}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          next();
        }
      }}
      aria-label={`Cycle word, currently ${options[index]}`}
    >
      <span className="hc-slot__vp">
        <span className="hc-slot__ghost" aria-hidden="true">
          {longest}
        </span>
        <span
          className="hc-slot__track"
          style={{ transform: `translateY(-${index}em)` }}
        >
          {options.map((opt, i) => (
            <span className="hc-slot__item" key={i}>
              {opt}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// HeroCopy — the composition.
//
// The vectorised inline signature + hover-reveal portrait that used to
// sit beneath the sub-headline has been moved to ./HeroSignoff.tsx.
// To bring it back, import HeroSignoff and render <HeroSignoff /> after
// the `<p className="hc-body">` paragraph below.
// ─────────────────────────────────────────────────────────────────────────
export default function HeroCopy() {
  return (
    <>
      {/* Rendered as a <div> rather than the original <main> so this
          component can be embedded inside the <section id="top"> in Hero
          without producing multiple <main> landmarks on the page. */}
      <div className="hc-root">
        <h1 className="hc-headline">
          The{" "}
          <InkFillWord accent noCursor staggerIndex={1}>
            future
          </InkFillWord>{" "}
          belongs to
          <br />
          designers who build{" "}
          <AutoTypeSlot
            phrases={["what's next", "agents", "systems", "taste"]}
            staggerIndex={2}
          />
          .
        </h1>

        <p className="hc-body">
          I work in transforming markets, where AI is changing what software
          is for, and where{" "}
          <SlotWord
            options={["well-crafted", "well-built", "well-designed", "well-shipped"]}
            staggerIndex={3}
          />{" "}
          experience moves the metrics.
        </p>
      </div>
    </>
  );
}
