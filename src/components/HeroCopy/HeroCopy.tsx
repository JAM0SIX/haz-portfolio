"use client";

/**
 * HeroCopy — A self-contained portfolio hero with four inline interactions.
 *
 * Drop this file anywhere in a Next.js project and render <HeroCopy />.
 *
 * What's inside:
 *   - HoverPortrait → underlined name reveals a portrait above on hover
 *   - InkFillWord   → pill word with a radial fill from cursor entry
 *   - SlotWord      → click-cycles through alternate words
 *   - TerminalCard  → inline terminal pill that types phrases
 *
 * Requirements:
 *   1. Next.js 14+ (App Router). Older Next or plain React: replace
 *      `next/image` with a regular <img> tag in HoverPortrait.
 *   2. Place your photo at /public/images/harry.jpg (or change the
 *      `src` prop on <HoverPortrait> below).
 *   3. Load DM Sans + Spectral fonts in your root layout, e.g.:
 *
 *        import { DM_Sans, Spectral } from "next/font/google";
 *        const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-dm-sans" });
 *        const spectral = Spectral({ subsets: ["latin"], weight: ["400","500"], style: ["normal","italic"], variable: "--font-spectral" });
 *        // <html className={`${dmSans.variable} ${spectral.variable}`}>
 *
 *      Then in your global CSS (or here):
 *        --font-sans: var(--font-dm-sans), system-ui, sans-serif;
 *        --font-serif: var(--font-spectral), Georgia, serif;
 *
 * Theming:
 *   All colors, fonts, spacing, and motion live in the `tokens` <style>
 *   block at the bottom of this file. Override any CSS variable in your
 *   own stylesheet to retheme without touching this code.
 */

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from "react";

// ─────────────────────────────────────────────────────────────────────────
// HoverPortrait
// ─────────────────────────────────────────────────────────────────────────
function HoverPortrait({
  children,
  src,
  alt,
  width = 180,
  height,
}: {
  children: ReactNode;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const finalHeight = height ?? Math.round(width * 1.25);

  return (
    <span
      className="hc-portrait"
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      onFocus={() => setRevealed(true)}
      onBlur={() => setRevealed(false)}
      onClick={() => setRevealed((r) => !r)}
      tabIndex={0}
    >
      <span className="hc-portrait__trigger">{children}</span>
      {revealed && (
        <span
          className="hc-portrait__bubble"
          style={{ width }}
          aria-hidden="true"
        >
          {imageFailed ? (
            <span
              className="hc-portrait__img hc-portrait__placeholder"
              style={{ width, height: finalHeight }}
              role="img"
              aria-label="Image missing — drop your file in /public/images/"
            >
              <span>
                image
                <br />
                missing
              </span>
            </span>
          ) : (
            <Image
              className="hc-portrait__img"
              src={src}
              alt={alt}
              width={width}
              height={finalHeight}
              priority
              onError={() => setImageFailed(true)}
            />
          )}
        </span>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// InkFillWord
// ─────────────────────────────────────────────────────────────────────────
function InkFillWord({
  children,
  href,
  accent,
  small,
  staggerIndex,
}: {
  children: ReactNode;
  href?: string;
  accent?: boolean;
  small?: boolean;
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

  const updateEntryPoint = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--enter-x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--enter-y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const handleTouch = (e: TouchEvent) => {
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
    "hc-ink-word",
    accent && "hc-ink-word--accent",
    small && "hc-ink-word--small",
  ]
    .filter(Boolean)
    .join(" ");

  const handlers = {
    className,
    onMouseEnter: updateEntryPoint,
    onMouseLeave: updateEntryPoint,
    onTouchStart: handleTouch,
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
// SlotWord
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

  const longest = useMemo(
    () => options.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [options]
  );
  const next = () => setIndex((i) => (i + 1) % options.length);

  return (
    <span
      className={`hc-fx-enter ${hasMounted ? "is-in" : ""} hc-slot-word`}
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
      <span className="hc-slot-word__viewport">
        <span className="hc-slot-word__ghost" aria-hidden="true">
          {longest}
        </span>
        <span
          className="hc-slot-word__track"
          style={{ transform: `translateY(-${index}em)` }}
        >
          {options.map((opt, i) => (
            <span className="hc-slot-word__item" key={i}>
              {opt}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TerminalCard
// ─────────────────────────────────────────────────────────────────────────
type TermPhase = "typing" | "holding" | "erasing";
type TermState = { text: string; phaseIndex: number; phase: TermPhase; tick: number };
type TermAction =
  | { type: "advance"; phrases: string[] }
  | { type: "skip"; phrases: string[] };

function termReducer(state: TermState, action: TermAction): TermState {
  const phrase = action.phrases[state.phaseIndex % action.phrases.length];
  if (action.type === "skip") {
    return {
      text: "",
      phaseIndex: (state.phaseIndex + 1) % action.phrases.length,
      phase: "typing",
      tick: state.tick + 1,
    };
  }
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

function TerminalCard({
  phrases,
  prompt = "›",
  typeSpeed = 60,
  holdDuration = 1700,
  eraseSpeed = 35,
  staggerIndex,
}: {
  phrases: string[];
  prompt?: string;
  typeSpeed?: number;
  holdDuration?: number;
  eraseSpeed?: number;
  staggerIndex?: number;
}) {
  const [state, dispatch] = useReducer(termReducer, {
    text: "",
    phaseIndex: 0,
    phase: "typing" as TermPhase,
    tick: 0,
  });
  const timerRef = useRef<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduceMotion.current ? 0 : 80 + (staggerIndex ?? 0) * 110;
    const t = window.setTimeout(() => setHasMounted(true), delay);
    return () => window.clearTimeout(t);
  }, [staggerIndex]);

  useEffect(() => {
    if (reduceMotion.current) return;
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

  const longest = phrases.reduce((a, b) => (a.length >= b.length ? a : b), "");
  const displayText = reduceMotion.current ? phrases[0] : state.text;

  return (
    <span
      className={`hc-fx-enter ${hasMounted ? "is-in" : ""} hc-term-card`}
      onClick={() => dispatch({ type: "skip", phrases })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dispatch({ type: "skip", phrases });
        }
      }}
      aria-label="Cycle terminal phrase"
    >
      {prompt && <span className="hc-term-card__prompt">{prompt}</span>}
      <span className="hc-term-card__slot">
        <span className="hc-term-card__ghost" aria-hidden="true">
          {longest}
        </span>
        <span className="hc-term-card__text">{displayText}</span>
      </span>
      <span className="hc-term-card__cursor" aria-hidden="true" />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// HeroCopy — the composition
// ─────────────────────────────────────────────────────────────────────────
export default function HeroCopy() {
  return (
    <>
      {/* Rendered as a <div> rather than the original <main> so this
          composition can be nested inside an existing <section>
          without producing multiple <main> landmarks on the page.
          The `.hc-root` styling is unchanged. */}
      <div className="hc-root">
        <p className="hc-greeting">
          Hello, I&rsquo;m{" "}
          <HoverPortrait src="/images/harry.jpg" alt="Harry, in a cowboy hat">
            Harry
          </HoverPortrait>
        </p>

        <h1 className="hc-headline">
          A designer who{" "}
          <InkFillWord accent staggerIndex={1}>
            builds
          </InkFillWord>{" "}
          <SlotWord
            options={["products", "systems", "ai interfaces", "tools"]}
            staggerIndex={2}
          />
        </h1>

        <p className="hc-body">
          Design used to stop at the handoff.{" "}
          <TerminalCard
            phrases={["Cursor", "Claude", "Vercel", "Figma", "Github"]}
            staggerIndex={3}
          />{" "}
          changed that for me. Now I prototype in real systems, bridging design
          and code.
        </p>
      </div>

      {/* All component styles live here so this file is self-contained.
          Override any CSS variable in your global stylesheet to retheme. */}
      <style jsx global>{`
        .hc-root {
          --hc-paper: #f5f3ee;
          --hc-ink-panel: #1a1815;
          --hc-ink: #1a1815;
          --hc-ink-12: rgba(26, 24, 21, 0.12);
          --hc-ink-42: rgba(26, 24, 21, 0.42);
          --hc-ink-62: rgba(26, 24, 21, 0.62);
          --hc-ink-82: rgba(26, 24, 21, 0.82);
          --hc-accent: #c2410c;
          --hc-font-sans: var(--font-sans, "DM Sans", system-ui, sans-serif);
          --hc-font-serif: var(--font-serif, "Spectral", Georgia, serif);
          --hc-chamfer: 8px;
          --hc-ease: cubic-bezier(0.32, 0.72, 0.32, 1);
          --hc-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
          --hc-dur: 250ms;

          max-width: 720px;
          margin: 0 auto;
          padding: 64px 36px;
          /* Transparent so a parent's background effect (e.g. the
             cursor-tracked dot field on the hero) reads through
             behind the copy. The page-level surface still owns
             the actual paper colour. */
          background: transparent;
          color: var(--hc-ink);
          font-family: var(--hc-font-sans);
        }

        .hc-greeting {
          font-family: var(--hc-font-sans);
          font-size: 20px;
          font-weight: 400;
          line-height: 1.15;
          color: var(--hc-ink-62);
          margin: 0 0 22px;
        }
        .hc-headline {
          font-family: var(--hc-font-serif);
          font-size: clamp(2.6rem, 6.5vw, 64px);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1;
          margin: 0 0 28px;
          color: var(--hc-ink);
        }
        .hc-body {
          font-family: var(--hc-font-sans);
          font-size: 16px;
          font-weight: 400;
          line-height: 1.6;
          color: var(--hc-ink-82);
          margin: 0;
          max-width: 38em;
        }

        .hc-fx-enter {
          opacity: 0;
          transform: translateY(4px);
          transition:
            opacity 500ms var(--hc-ease),
            transform 500ms var(--hc-ease);
        }
        .hc-fx-enter.is-in { opacity: 1; transform: translateY(0); }

        /* HoverPortrait */
        .hc-portrait { position: relative; display: inline-block; cursor: pointer; }
        .hc-portrait__trigger {
          font-family: var(--hc-font-serif);
          font-style: italic;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
          text-decoration-color: var(--hc-ink-42);
          transition: text-decoration-color var(--hc-dur) var(--hc-ease);
        }
        .hc-portrait:hover .hc-portrait__trigger,
        .hc-portrait:focus-visible .hc-portrait__trigger {
          text-decoration-color: var(--hc-ink);
        }
        .hc-portrait__bubble {
          position: absolute;
          left: 50%;
          bottom: calc(100% + 12px);
          transform: translateX(-50%);
          transform-origin: 50% 100%;
          pointer-events: none;
          z-index: 10;
        }
        .hc-portrait__img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 0;
          box-shadow: 0 8px 30px rgba(26, 24, 21, 0.18);
          transform-origin: 50% 100%;
          animation:
            hc-portrait-intro 550ms var(--hc-ease-out) both,
            hc-portrait-sway 3200ms ease-in-out 550ms infinite;
        }
        .hc-portrait__placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--hc-accent);
          color: var(--hc-paper);
          font-family: var(--hc-font-sans);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.3;
        }
        @keyframes hc-portrait-intro {
          0%   { opacity: 0; transform: rotate(-6deg) scale(0.9); }
          60%  { opacity: 1; transform: rotate(3deg) scale(1.02); }
          100% { opacity: 1; transform: rotate(0) scale(1); }
        }
        @keyframes hc-portrait-sway {
          0%, 50%, 100% { transform: rotate(0); }
          25% { transform: rotate(2.2deg); }
          75% { transform: rotate(-2.2deg); }
        }

        /* InkFillWord */
        .hc-ink-word {
          --enter-x: 50%;
          --enter-y: 50%;
          --fill-radius: 0%;
          --fill-color: var(--hc-ink);
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 4px 12px 2px;
          line-height: 1em;
          isolation: isolate;
          background: var(--hc-ink-12);
          color: inherit;
          cursor: pointer;
          border: none;
          font-family: inherit;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
          transition:
            color var(--hc-dur) var(--hc-ease),
            clip-path var(--hc-dur) var(--hc-ease),
            opacity 500ms var(--hc-ease),
            transform 500ms var(--hc-ease);
        }
        .hc-ink-word::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: var(--fill-color);
          clip-path: circle(var(--fill-radius) at var(--enter-x) var(--enter-y));
          pointer-events: none;
          transition: clip-path var(--hc-dur) var(--hc-ease);
        }
        .hc-ink-word:hover,
        .hc-ink-word.is-tapped {
          color: var(--hc-paper);
          clip-path: polygon(
            var(--hc-chamfer) 0,
            100% 0,
            100% calc(100% - var(--hc-chamfer)),
            calc(100% - var(--hc-chamfer)) 100%,
            0 100%,
            0 var(--hc-chamfer)
          );
        }
        .hc-ink-word:hover::before,
        .hc-ink-word.is-tapped::before { --fill-radius: 150%; }
        .hc-ink-word--accent { --fill-color: var(--hc-accent); }
        .hc-ink-word--small  { font-size: 0.9em; padding: 3px 10px 2px; }

        /* SlotWord */
        .hc-slot-word {
          display: inline-flex;
          align-items: center;
          vertical-align: 0.18em;
          padding: 0.22em 0.55em 0.16em;
          background: var(--hc-ink-panel);
          color: var(--hc-paper);
          cursor: pointer;
          user-select: none;
          overflow: hidden;
          font-family: var(--hc-font-sans);
          font-weight: 500;
          font-size: 0.42em;
          letter-spacing: 0;
          line-height: 1;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
          transition: clip-path var(--hc-dur) var(--hc-ease);
        }
        .hc-slot-word:hover {
          clip-path: polygon(
            var(--hc-chamfer) 0,
            100% 0,
            100% calc(100% - var(--hc-chamfer)),
            calc(100% - var(--hc-chamfer)) 100%,
            0 100%,
            0 var(--hc-chamfer)
          );
        }
        .hc-slot-word__viewport {
          position: relative;
          display: inline-block;
          height: 1em;
          line-height: 1;
          overflow: hidden;
        }
        .hc-slot-word__ghost {
          display: block;
          visibility: hidden;
          height: 1em;
          line-height: 1;
          white-space: nowrap;
          pointer-events: none;
        }
        .hc-slot-word__track {
          position: absolute;
          inset: 0;
          display: block;
          transition: transform 380ms var(--hc-ease);
          will-change: transform;
        }
        .hc-slot-word__item {
          display: block;
          height: 1em;
          line-height: 1;
          white-space: nowrap;
        }

        /* TerminalCard */
        .hc-term-card {
          display: inline-flex;
          align-items: center;
          position: relative;
          top: -0.15em;
          padding: 4px 9px;
          background: var(--hc-ink-panel);
          color: var(--hc-paper);
          font-family: var(--hc-font-sans);
          font-weight: 500;
          font-size: 0.78em;
          letter-spacing: 0.04em;
          line-height: 1.4;
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
          vertical-align: baseline;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
          transition: clip-path var(--hc-dur) var(--hc-ease);
        }
        .hc-term-card:hover {
          clip-path: polygon(
            var(--hc-chamfer) 0,
            100% 0,
            100% calc(100% - var(--hc-chamfer)),
            calc(100% - var(--hc-chamfer)) 100%,
            0 100%,
            0 var(--hc-chamfer)
          );
        }
        .hc-term-card__prompt {
          color: var(--hc-accent);
          font-weight: 500;
          margin-right: 0.5em;
        }
        .hc-term-card__slot { position: relative; display: inline-block; }
        .hc-term-card__ghost {
          visibility: hidden;
          display: inline-block;
          white-space: pre;
        }
        .hc-term-card__text {
          position: absolute;
          inset: 0;
          display: inline-block;
          white-space: pre;
        }
        .hc-term-card__cursor {
          display: inline-block;
          width: 1.5px;
          height: 1em;
          margin-left: 2px;
          background: var(--hc-paper);
          flex-shrink: 0;
          animation: hc-term-blink 1.1s step-end infinite;
        }
        @keyframes hc-term-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hc-fx-enter,
          .hc-ink-word,
          .hc-slot-word,
          .hc-slot-word__track,
          .hc-term-card { transition: none; }
          .hc-term-card__cursor,
          .hc-portrait__img { animation: none; }
        }
      `}</style>
    </>
  );
}
