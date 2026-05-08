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

import Image from "next/image";
import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from "react";

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
      <span className="hc-type__text">{text}</span>
      <span className="hc-type__cursor" aria-hidden="true" />
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
// Signature — vectorised inline signature. Hover reveals a portrait above.
// The path data below is the actual traced signature; replace with your
// own vector if you want a different mark.
// ─────────────────────────────────────────────────────────────────────────
const SIGNATURE_PATH = "M 718.500 24.850 C 708.571 30.948, 676.467 75.271, 634.008 141.500 C 615.616 170.187, 566 249.432, 556.995 264.500 C 554.037 269.450, 547.582 279.800, 542.651 287.500 C 537.720 295.200, 530.334 307.575, 526.238 315 C 522.142 322.425, 516.334 332.100, 513.331 336.500 C 491.804 368.043, 471.394 399.189, 444.197 442 C 400.950 510.077, 394.759 518.957, 360.889 561.500 C 341.890 585.364, 335.085 594.452, 318.984 617.468 C 306.564 635.222, 290.095 649.429, 286.316 645.649 C 285.991 645.324, 290.254 635.708, 295.791 624.279 C 317.814 578.814, 330.982 545.482, 368.993 438.981 C 411.525 319.814, 427.934 279.442, 455.561 226 C 497.249 145.359, 514.789 106.387, 517.333 88.752 C 518.272 82.239, 507.615 73, 499.162 73 C 485.635 73, 462.486 117.506, 436.965 192.582 C 421.030 239.456, 414.980 251.881, 399.378 269.778 C 395.409 274.331, 387.841 284.974, 382.560 293.429 C 355.950 336.035, 335.883 356.052, 301.783 374.004 C 289.879 380.271, 286.572 383.770, 287.315 389.313 C 289.343 404.435, 312.553 404.887, 332.172 390.186 C 339.040 385.040, 349.782 373.916, 364.219 357 C 370.556 349.575, 377.211 342.150, 379.009 340.500 L 382.277 337.500 381.701 340.565 C 381.186 343.302, 352.752 424.070, 337.190 467 C 320.026 514.351, 305.306 551.218, 288.479 589 C 281.497 604.675, 271.372 628.578, 265.978 642.117 C 242.691 700.567, 236.948 708.016, 175.500 759.468 C 63.132 853.556, -0 922.315, 0 950.609 C 0 964.942, 16.847 978.282, 35 978.321 C 95.739 978.454, 186.678 872.186, 253.493 723 C 258.182 712.529, 257.370 713.569, 278.873 690.500 C 354.001 609.902, 404.200 544.509, 442.769 477 C 452.239 460.425, 457.649 453.753, 458.588 457.494 C 460.049 463.314, 458.166 468.893, 446.750 492.572 C 418.537 551.092, 398.835 599.533, 369.300 683 C 359.986 709.320, 357.582 717.674, 346.989 760.500 C 304.280 933.183, 290.798 1027.501, 310.686 1014.470 C 315.204 1011.510, 318.279 999.213, 324.961 957.381 C 331.323 917.554, 335.112 895.514, 339.555 872.500 C 391.393 603.983, 513.510 338.354, 708.796 69.326 C 733.071 35.885, 732.553 36.767, 731.101 31.375 C 729.008 23.601, 724.410 21.220, 718.500 24.850 M 1006.479 413.212 C 1000.443 416.408, 990.213 428.985, 966.796 462 C 938.666 501.659, 928.452 513.403, 916.934 519.327 C 897.137 529.511, 893.308 518.555, 902.544 478.157 C 911.509 438.946, 911.562 437.977, 904.859 435.620 C 899.525 433.743, 897.073 435.523, 877.500 455.472 C 853.894 479.532, 839.879 490.858, 822.210 500.153 C 813.281 504.850, 807 502.992, 807 495.655 C 807 492.445, 802.921 481.293, 800.988 479.218 C 795.857 473.710, 788.575 477.556, 751.712 505.236 C 698.599 545.119, 685.470 548.759, 676.471 526.098 C 672.747 516.722, 671.714 515.460, 666.588 514.025 C 658.576 511.781, 654.381 515.053, 650.591 526.500 C 648.626 532.435, 647.627 533.810, 643 536.945 C 636.932 541.058, 632.961 545.322, 629.912 551 C 625.877 558.516, 594.091 597.087, 569.500 624.309 C 555.715 639.569, 540.420 647.390, 536.970 640.944 C 532.456 632.509, 540.868 611.651, 550.774 606.714 C 560.306 601.964, 565.749 590.596, 566.707 573.434 C 568.460 542.025, 541.828 542, 510.778 573.380 C 473.845 610.705, 447.123 665.145, 457.217 682.500 C 460.006 687.295, 467.493 692.570, 472.779 693.463 C 481.693 694.969, 490.490 689.672, 505.074 674.017 C 516.902 661.321, 515.601 661.739, 526.128 667.250 C 541.209 675.145, 553.841 672.412, 571.256 657.487 C 578.803 651.020, 592.146 636.193, 598.966 626.697 C 601.498 623.172, 602.987 622, 604.937 622 L 607.536 622 606.617 629.753 C 604.276 649.515, 611.538 657.866, 623.932 649.664 C 627.667 647.192, 635.662 630.294, 655.471 583 C 661.184 569.361, 665.494 560.990, 666.792 561.012 C 667.181 561.019, 669.429 562.127, 671.786 563.475 C 688.235 572.879, 703.532 567.615, 747 537.591 C 765.004 525.156, 764.896 529.205, 745.997 575.102 C 728.732 617.033, 725.931 629.068, 731.653 636.739 C 741.153 649.476, 759.963 618.204, 787.570 543.774 C 793.414 528.016, 792.467 528.790, 807.021 527.881 C 825.201 526.745, 835.771 522.494, 850.913 510.231 C 855.483 506.529, 861.034 502.038, 863.247 500.250 C 870.697 494.233, 872.051 495.620, 873.864 511.129 C 877.303 540.539, 893.005 555.813, 910.500 546.766 C 914.937 544.472, 934.953 536, 935.938 536 C 942.095 536, 935.089 555.243, 897.661 641.124 C 878.308 685.529, 868.916 708.247, 855.978 741.949 C 792.158 908.189, 670.648 1146.546, 581.690 1280 C 536.309 1348.080, 483.095 1412.209, 463.172 1422.828 C 448.492 1430.652, 430.040 1431.052, 422.183 1423.716 C 411.889 1414.104, 408.425 1360.571, 415.045 1313.415 C 424.048 1249.288, 455.303 1156.971, 486.790 1101.500 C 538.787 1009.897, 597.736 934.228, 636.303 909.579 C 642.920 905.350, 654.644 900.649, 656.652 901.420 C 662.484 903.658, 650.377 933.329, 627.035 974 C 612.100 1000.023, 605.905 1008.762, 569 1055.865 C 541.479 1090.990, 539.150 1095.004, 541.975 1102.435 C 551.393 1127.205, 661.110 975.708, 678.066 914.520 C 683.714 894.139, 677.140 883.477, 659.412 884.265 C 634.391 885.377, 600.702 914.632, 546.288 982.500 C 521.589 1013.307, 512.006 1028.781, 483.738 1083.500 C 455.080 1138.976, 450.154 1149.521, 447.829 1160.364 C 447.117 1163.683, 445.510 1166.915, 443.286 1169.500 C 427.257 1188.129, 399.840 1292.427, 395.062 1352.950 C 391.143 1402.596, 398.024 1431.886, 416.098 1442.478 C 456.920 1466.403, 509.536 1427.680, 573.685 1326.500 C 588.677 1302.853, 655.867 1194.279, 669.295 1172 C 693.932 1131.127, 716.409 1089.377, 748.326 1025.210 C 810.636 899.939, 842.880 829.217, 873.835 749.924 C 879.326 735.858, 892.896 703.715, 903.991 678.495 C 923.941 633.148, 937.854 600.818, 962.517 542.500 C 978.680 504.279, 982.808 495.292, 1001.556 457.500 C 1016.943 426.482, 1019.347 420.071, 1016.820 416.783 C 1014.690 414.011, 1008.806 411.980, 1006.479 413.212 M 521.117 588.413 C 506.765 599.003, 477.096 648.009, 477.021 661.250 C 476.991 666.673, 478.412 666.061, 487.474 656.750 C 509.060 634.572, 523.805 609.321, 525.723 591.250 C 526.354 585.304, 525.797 584.961, 521.117 588.413 M 212.490 755.447 C 206.909 757.815, 168.964 791.794, 118.502 839.611 C 46.321 908.011, 19.016 942.154, 27.811 953.015 C 30.743 956.636, 44.646 956.660, 53.500 953.060 C 91.010 937.807, 142.414 880.275, 190.705 799.500 C 197.281 788.500, 205.610 774.958, 209.214 769.407 C 218.231 755.516, 218.883 752.735, 212.490 755.447";

function Signature({
  tilt = -2,
  portraitSrc = "/images/harry.jpg",
  portraitAlt = "Harry, in a cowboy hat",
}: {
  tilt?: number;
  portraitSrc?: string;
  portraitAlt?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const portraitWidth = 180;
  const portraitHeight = Math.round(portraitWidth * 1.25);

  return (
    <span
      className="hc-sig"
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      onFocus={() => setRevealed(true)}
      onBlur={() => setRevealed(false)}
      onClick={() => setRevealed((r) => !r)}
      tabIndex={0}
      aria-label="Harry"
    >
      <svg
        className="hc-sig__svg"
        viewBox="0 0 1018 1552"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `rotate(${tilt}deg)`,
        }}
        aria-hidden="true"
      >
        <path fill="currentColor" d={SIGNATURE_PATH} />
      </svg>

      {revealed && (
        <span
          className="hc-sig__bubble"
          style={{ width: portraitWidth }}
          aria-hidden="true"
        >
          {portraitFailed ? (
            <span
              className="hc-sig__portrait hc-sig__placeholder"
              style={{ width: portraitWidth, height: portraitHeight }}
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
              className="hc-sig__portrait"
              src={portraitSrc}
              alt={portraitAlt}
              width={portraitWidth}
              height={portraitHeight}
              priority
              onError={() => setPortraitFailed(true)}
            />
          )}
        </span>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// HeroCopy — the composition.
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
          belongs to designers who build{" "}
          <span className="hc-headline__type-line">
            <AutoTypeSlot
              phrases={["what's next", "agents", "systems", "taste"]}
              staggerIndex={2}
            />
            .
          </span>
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

        <p className="hc-signoff">
          <Signature />
        </p>
      </div>

      {/* All component styles live here so this file is self-contained.
          Override any --hc-* CSS variable in a parent stylesheet to retheme. */}
      <style jsx global>{`
        .hc-root {
          --hc-paper: #f5f3ee;
          --hc-ink-panel: #1a1815;
          --hc-ink: #1a1815;
          --hc-ink-12: rgba(26, 24, 21, 0.12);
          --hc-ink-62: rgba(26, 24, 21, 0.62);
          --hc-ink-82: rgba(26, 24, 21, 0.82);
          --hc-accent: #c2410c;
          --hc-font-sans: var(--font-sans, "Sora", system-ui, sans-serif);
          --hc-font-serif: var(--font-heading, "Apple Garamond", "Garamond", serif);
          --hc-chamfer: 8px;
          --hc-ease: cubic-bezier(0.32, 0.72, 0.32, 1);
          --hc-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
          --hc-dur: 250ms;

          max-width: 760px;
          margin: 0 auto;
          padding: 64px 36px;
          color: var(--hc-ink);
          font-family: var(--hc-font-sans);
        }

        .hc-headline {
          font-family: var(--hc-font-serif);
          font-size: clamp(2.6rem, 6.5vw, 64px);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0 0 28px;
          color: var(--hc-ink);
        }
        .hc-headline__type-line {
          display: block;
          margin-top: 0.14em;
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
        .hc-signoff {
          margin: 36px 0 0;
          display: flex;
          align-items: baseline;
        }

        .hc-fx-enter {
          opacity: 0;
          transform: translateY(4px);
          transition:
            opacity 500ms var(--hc-ease),
            transform 500ms var(--hc-ease);
        }
        .hc-fx-enter.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        /* InkFillWord */
        .hc-ink {
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
        .hc-ink::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: var(--fill-color);
          clip-path: circle(var(--fill-radius) at var(--enter-x) var(--enter-y));
          pointer-events: none;
          transition: clip-path var(--hc-dur) var(--hc-ease);
        }
        .hc-ink:hover,
        .hc-ink.is-tapped {
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
        .hc-ink:hover::before,
        .hc-ink.is-tapped::before {
          --fill-radius: 150%;
        }
        .hc-ink--accent { --fill-color: var(--hc-accent); }
        .hc-ink--no-cursor { cursor: text; }

        /* AutoTypeSlot — dark chassis, orange chev, fits to current word */
        .hc-type {
          display: inline-flex;
          align-items: center;
          vertical-align: 0.06em;
          padding: 0.18em 0.5em 0.14em;
          background: var(--hc-ink-panel);
          color: var(--hc-paper);
          font-family: var(--hc-font-serif);
          font-style: inherit;
          font-weight: inherit;
          font-size: 0.78em;
          letter-spacing: -0.02em;
          line-height: 1;
          cursor: text;
          user-select: none;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
          transition: clip-path var(--hc-dur) var(--hc-ease);
        }
        .hc-type:hover {
          clip-path: polygon(
            var(--hc-chamfer) 0,
            100% 0,
            100% calc(100% - var(--hc-chamfer)),
            calc(100% - var(--hc-chamfer)) 100%,
            0 100%,
            0 var(--hc-chamfer)
          );
        }
        .hc-type__prompt {
          color: var(--hc-accent);
          font-family: var(--hc-font-sans);
          font-weight: 500;
          margin-right: 0.4em;
          font-size: 0.92em;
        }
        .hc-type__text { display: inline-block; white-space: pre; }
        .hc-type__cursor {
          display: inline-block;
          width: 2px;
          height: 0.85em;
          margin-left: 3px;
          background: var(--hc-paper);
          vertical-align: -0.05em;
          animation: hc-blink 1.05s step-end infinite;
        }
        @keyframes hc-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }

        /* SlotWord — click cycles, width-locked */
        .hc-slot {
          display: inline-flex;
          align-items: center;
          vertical-align: 0.1em;
          padding: 0.22em 0.55em 0.16em;
          background: var(--hc-ink-panel);
          color: var(--hc-paper);
          cursor: pointer;
          user-select: none;
          overflow: hidden;
          font-family: var(--hc-font-sans);
          font-weight: 500;
          font-size: 0.9em;
          letter-spacing: 0;
          line-height: 1;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%, 0 0);
          transition: clip-path var(--hc-dur) var(--hc-ease);
        }
        .hc-slot:hover {
          clip-path: polygon(
            var(--hc-chamfer) 0,
            100% 0,
            100% calc(100% - var(--hc-chamfer)),
            calc(100% - var(--hc-chamfer)) 100%,
            0 100%,
            0 var(--hc-chamfer)
          );
        }
        .hc-slot__vp {
          position: relative;
          display: inline-block;
          height: 1em;
          line-height: 1;
          overflow: hidden;
        }
        .hc-slot__ghost {
          display: block;
          visibility: hidden;
          height: 1em;
          line-height: 1;
          white-space: nowrap;
          pointer-events: none;
        }
        .hc-slot__track {
          position: absolute;
          inset: 0;
          display: block;
          transition: transform 380ms var(--hc-ease);
          will-change: transform;
        }
        .hc-slot__item {
          display: block;
          height: 1em;
          line-height: 1;
          white-space: nowrap;
        }

        /* Signature */
        .hc-sig {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 120px;
          cursor: pointer;
          vertical-align: baseline;
        }
        .hc-sig__svg {
          display: inline-block;
          width: 100%;
          height: fit-content;
          max-height: 100%;
          vertical-align: baseline;
          color: var(--hc-ink);
          user-select: none;
        }
        .hc-sig__bubble {
          position: absolute;
          left: 50%;
          bottom: calc(100% + 12px);
          transform: translateX(-50%);
          transform-origin: 50% 100%;
          pointer-events: none;
          z-index: 10;
        }
        .hc-sig__portrait {
          display: block;
          width: 100%;
          height: auto;
          box-shadow: 0 8px 30px rgba(26, 24, 21, 0.18);
          transform-origin: 50% 100%;
          animation:
            hc-portrait-intro 550ms var(--hc-ease-out) both,
            hc-portrait-sway 3200ms ease-in-out 550ms infinite;
        }
        .hc-sig__placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--hc-accent);
          color: var(--hc-paper);
          font-family: var(--hc-font-sans);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: none;
          text-align: center;
          line-height: 1.3;
        }
        @keyframes hc-portrait-intro {
          0% { opacity: 0; transform: rotate(-6deg) scale(0.9); }
          60% { opacity: 1; transform: rotate(3deg) scale(1.02); }
          100% { opacity: 1; transform: rotate(0) scale(1); }
        }
        @keyframes hc-portrait-sway {
          0%, 50%, 100% { transform: rotate(0); }
          25% { transform: rotate(2.2deg); }
          75% { transform: rotate(-2.2deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hc-fx-enter,
          .hc-ink,
          .hc-slot,
          .hc-slot__track,
          .hc-type { transition: none; }
          .hc-type__cursor,
          .hc-sig__portrait { animation: none; }
        }
      `}</style>
    </>
  );
}
