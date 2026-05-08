"use client";

/* ─────────────────────────────────────────────────────────────
   Portfolio Dial — Haz.
   Embedded as a section on the homepage (no longer fixed-viewport,
   no scroll-jack). Original utility/HUD aesthetic preserved: warm
   paper, dial with 4 projects orbiting near 3 o'clock, active item
   expanded as an inline accordion.

   Interactions (only when the section is at least 50% in view):
     ↑ ↓ ← →     rotate through projects (clamped at ends)
     Enter / ⎵   go to project detail page
     click ▲ ▼   step prev / next via the indicator-flanking arrows
     touch swipe rotate through projects (mobile only)
   ───────────────────────────────────────────────────────────── */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/ui/Button";
import { PROJECTS, type Project } from "./projects";
import "./PortfolioDial.css";

const DISC_EASE = [0.22, 1, 0.36, 1] as const;

const ACCENT = "#C2410C";

const CONFIG = {
  dialSize: 1200,
  hudOn: true,
  arcSpread: 110,
};

const TAU = Math.PI * 2;
const SLOT_ANGLE = (i: number, n = PROJECTS.length) => (i * TAU) / n;

/* ─── Hook: useTransitionAngle ──────────────────────────────────
   Each time activeIdx changes by `delta`, items effectively jump by
   `delta * step` in angular space. We animate that jump back to 0 so
   they glide into place instead of snapping. */
function useTransitionAngle(activeIdx: number, step: number) {
  const [residual, setResidual] = useState(0);
  const prevIdxRef = useRef(activeIdx);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const delta = activeIdx - prevIdxRef.current;
    prevIdxRef.current = activeIdx;
    if (delta === 0) return;
    setResidual((r) => r + delta * step);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const tick = () => {
      setResidual((r) => {
        if (Math.abs(r) < 0.0008) return 0;
        rafRef.current = requestAnimationFrame(tick);
        return r * 0.9;
      });
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [activeIdx, step]);

  return residual;
}

/* ─── Tick ring (SVG) ──────────────────────────────────────── */
function TickRing({
  size,
  accent,
  hudOn,
}: {
  size: number;
  accent: string;
  hudOn: boolean;
}) {
  const r = size / 2;
  const inner = r - 4;
  const outer = r;
  const ticks = 60;
  const lines: ReactNode[] = [];
  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * TAU;
    const major = i % 5 === 0;
    const len = major ? 8 : 3;
    const x1 = inner * Math.cos(a);
    const y1 = inner * Math.sin(a);
    const x2 = (inner - len) * Math.cos(a);
    const y2 = (inner - len) * Math.sin(a);
    lines.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={major ? "rgba(26, 24, 21, 0.62)" : "rgba(26, 24, 21, 0.22)"}
        strokeWidth={major ? 1 : 0.6}
      />,
    );
  }
  const cardinals = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <svg
      width={size}
      height={size}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g transform={`translate(${r} ${r})`}>
        <circle
          r={outer - 1}
          fill="none"
          stroke="rgba(26, 24, 21, 0.22)"
          strokeWidth="0.5"
        />
        <circle
          r={inner - 10}
          fill="none"
          stroke="rgba(26, 24, 21, 0.12)"
          strokeWidth="0.5"
        />
        {lines}
      </g>
      {/* fixed indicator at 3 o'clock */}
      <g transform={`translate(${r} ${r})`}>
        <line
          x1={inner - 16}
          y1={0}
          x2={outer + 6}
          y2={0}
          stroke={accent}
          strokeWidth="1.2"
        />
        <circle cx={outer + 6} cy={0} r="3" fill={accent} />
        <circle
          cx={outer + 6}
          cy={0}
          r="6"
          fill="none"
          stroke={accent}
          strokeWidth="0.5"
          opacity={0.6}
        />
      </g>
      {hudOn && (
        <g
          transform={`translate(${r} ${r})`}
          style={{
            font: '500 8px/1 var(--font-sans)',
            letterSpacing: ".08em",
            fill: "var(--ink-42)",
          }}
        >
          {cardinals.map((deg) => {
            const a = (deg * Math.PI) / 180;
            const lr = outer + 18;
            const x = lr * Math.cos(a);
            const y = lr * Math.sin(a);
            const label = String(deg).padStart(3, "0") + "°";
            return (
              <text
                key={deg}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {label}
              </text>
            );
          })}
        </g>
      )}
    </svg>
  );
}

/* ─── Dot field background ─────────────────────────────────── */
function DotField({ size, angle }: { size: number; angle: number }) {
  const r = size / 2;
  const ringSpecs = [
    { radius: r * 0.78, count: 36, dot: 1.8, op: 0.85, isActive: true },
    { radius: r * 0.84, count: 60, dot: 1.4, op: 0.5 },
    { radius: r * 0.9, count: 84, dot: 1.2, op: 0.4 },
  ];
  const rings: ReactNode[] = [];
  ringSpecs.forEach((spec, ri) => {
    for (let i = 0; i < spec.count; i++) {
      const a = (i / spec.count) * TAU;
      const x = spec.radius * Math.cos(a);
      const y = spec.radius * Math.sin(a);
      const fill = spec.isActive
        ? "rgba(26, 24, 21, 0.82)"
        : `rgba(26, 24, 21, ${spec.op})`;
      rings.push(
        <circle key={`${ri}-${i}`} cx={x} cy={y} r={spec.dot} fill={fill} />,
      );
    }
  });

  return (
    <svg
      width={size}
      height={size}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g
        transform={`translate(${r} ${r}) rotate(${(angle * 180) / Math.PI})`}
      >
        {rings}
      </g>
    </svg>
  );
}

/* ─── Center disc ───────────────────────────────────────────
   Shows the active project's image (cross-fading on change) and
   falls back to the solid paper-deep surface when no image is set
   on the project. The decorative 1-6-1 halo is preserved. */
function CenterImage({
  size,
  image,
  alt,
}: {
  size: number;
  image?: string;
  alt: string;
}) {
  return (
    <div
      aria-hidden={!image}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow:
          "0 0 0 1px var(--ink-22), 0 0 0 6px var(--paper), 0 0 0 7px var(--ink-12)",
        background: "var(--paper-deep)",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="sync">
        {image && (
          <motion.div
            key={image}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: DISC_EASE }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={image}
              alt={alt}
              fill
              // The disc renders up to ~864px on a 1200px dial. Hint a
              // generous size so Next picks the right variant on retina.
              sizes={`${Math.min(1200, Math.round(size * 1.5))}px`}
              priority={false}
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Up / Down arrows next to the 3 o'clock indicator ──── */
function NavArrows({
  dialSize,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  dialSize: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const baseLeft = dialSize + 18;
  const offsetY = 22;
  const posStyle = (top: string): CSSProperties => ({
    position: "absolute",
    left: baseLeft,
    pointerEvents: "auto",
    top,
  });
  return (
    <>
      <button
        type="button"
        aria-label="Previous project"
        onClick={() => canPrev && onPrev()}
        disabled={!canPrev}
        className="btn-icon btn-icon-sm"
        style={posStyle(`calc(50% - ${offsetY + 28}px)`)}
      >
        <svg width="11" height="7" viewBox="0 0 11 7" aria-hidden>
          <path
            d="M1 6 L5.5 1 L10 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next project"
        onClick={() => canNext && onNext()}
        disabled={!canNext}
        className="btn-icon btn-icon-sm"
        style={posStyle(`calc(50% + ${offsetY}px)`)}
      >
        <svg width="11" height="7" viewBox="0 0 11 7" aria-hidden>
          <path
            d="M1 1 L5.5 6 L10 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}

/* ─── CTA below the active heading ─────────────────────────── */
function ActiveCTA({ onOpen }: { onOpen: () => void }) {
  return (
    <Button variant="primary" arrow="→" onClick={onOpen}>
      View Project
    </Button>
  );
}

/* ─── Heading item — one slot in the orbiting list ───────── */
function HeadingItem({
  project,
  idx,
  x,
  y,
  isActive,
  opacity,
  hidden,
  accent,
  onSelect,
  onOpen,
}: {
  project: Project;
  idx: number;
  x: number;
  y: number;
  isActive: boolean;
  opacity: number;
  hidden: boolean;
  accent: string;
  onSelect: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform .85s cubic-bezier(.32,.72,.32,1)",
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      <div
        className="isClickable"
        onClick={() => {
          if (hidden) return;
          if (isActive) onOpen();
          else onSelect();
        }}
        style={{
          transform: "translateY(-50%)",
          opacity,
          transition:
            "opacity .55s cubic-bezier(.32,.72,.32,1), transform .85s cubic-bezier(.32,.72,.32,1)",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {/* connector tick row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingLeft: 22,
            font: '500 10px/1 var(--font-sans)',
            letterSpacing: ".22em",
            color: isActive ? accent : "var(--ink-62)",
            transition: "color .55s cubic-bezier(.32,.72,.32,1)",
          }}
        >
          <span
            style={{
              width: isActive ? 26 : 14,
              height: 1,
              background: "currentColor",
              opacity: 0.65,
              transition: "width .7s cubic-bezier(.32,.72,.32,1)",
            }}
          />
          <span>P/{String(idx + 1).padStart(2, "0")}</span>
        </div>

        <div
          style={{
            marginTop: 6,
            paddingLeft: 22,
            font: `${isActive ? 600 : 500} ${isActive ? 28 : 20}px/1 var(--font-sans)`,
            letterSpacing: ".04em",
            color: "var(--ink)",
            transition:
              "font-size .55s cubic-bezier(.32,.72,.32,1), font-weight .55s cubic-bezier(.32,.72,.32,1)",
          }}
        >
          {project.title}
        </div>

        <div
          style={{
            marginTop: 5,
            paddingLeft: 22,
            font: '500 10px/1.3 var(--font-sans)',
            letterSpacing: ".16em",
            color: "var(--ink-62)",
            textTransform: "none",
          }}
        >
          {project.year}, {project.role}
        </div>

        {/* Accordion body — always mounted so the cross-fade works on switch. */}
        <div
          aria-hidden={!isActive}
          style={{
            marginLeft: 22,
            marginTop: isActive ? 14 : 0,
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateY(0)" : "translateY(-6px)",
            maxHeight: isActive ? 240 : 0,
            overflow: "hidden",
            pointerEvents: isActive ? "auto" : "none",
            transition:
              "opacity .65s cubic-bezier(.32,.72,.32,1), " +
              "transform .65s cubic-bezier(.32,.72,.32,1), " +
              "max-height .65s cubic-bezier(.32,.72,.32,1), " +
              "margin-top .65s cubic-bezier(.32,.72,.32,1)",
          }}
        >
          <div
            style={{
              borderTop: "1px dashed var(--ink-22)",
              paddingTop: 12,
              marginBottom: 14,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              {project.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    background: "var(--ink-22)",
                    clipPath:
                      "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                    padding: "3px 9px",
                    font: '500 10px/1 var(--font-sans)',
                    letterSpacing: ".18em",
                    color: "var(--ink-62)",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 1,
                      background: "var(--paper)",
                      clipPath:
                        "polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)",
                      zIndex: 0,
                    }}
                  />
                  <span style={{ position: "relative", zIndex: 1 }}>{t}</span>
                </span>
              ))}
            </div>

          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 14,
              flexWrap: "nowrap",
            }}
          >
            <ActiveCTA onOpen={onOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Orbiting headings — desktop list ─────────────────────── */
function OrbitingHeadings({
  projects,
  activeIdx,
  radius,
  dialAngle,
  arcSpread,
  accent,
  onSelect,
  onOpen,
}: {
  projects: readonly Project[];
  activeIdx: number;
  radius: number;
  dialAngle: number;
  arcSpread: number;
  accent: string;
  onSelect: (i: number) => void;
  onOpen: (id: string) => void;
}) {
  const n = projects.length;
  const arcRad = (arcSpread * Math.PI) / 180;
  const step = n > 1 ? arcRad / (n - 1) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 0,
        height: 0,
        pointerEvents: "none",
      }}
    >
      {projects.map((p, i) => {
        const offset = i - activeIdx;
        const a = offset * step + dialAngle;
        const x = radius * Math.cos(a);
        const y = radius * Math.sin(a);
        const isActive = i === activeIdx;
        const dist = Math.abs(a);
        const hidden = Math.abs(offset) > 2;
        const opacity = hidden
          ? 0
          : isActive
            ? 1
            : Math.max(0.3, 0.7 - dist * 1.6);
        return (
          <HeadingItem
            key={p.id}
            project={p}
            idx={i}
            x={x}
            y={y}
            isActive={isActive}
            opacity={opacity}
            hidden={hidden}
            accent={accent}
            onSelect={() => onSelect(i)}
            onOpen={() => onOpen(p.id)}
          />
        );
      })}
    </div>
  );
}

/* ─── Mini map (HUD) ───────────────────────────────────────── */
function MiniMap({
  activeIdx,
  n,
  accent,
}: {
  activeIdx: number;
  n: number;
  accent: string;
}) {
  const size = 56;
  const r = size / 2 - 4;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        font: '500 10px/1.4 var(--font-sans)',
        letterSpacing: ".1em",
        color: "var(--ink-62)",
      }}
    >
      <svg width={size} height={size} style={{ display: "block" }}>
        <g transform={`translate(${size / 2} ${size / 2})`}>
          <circle
            r={r}
            fill="none"
            stroke="rgba(26, 24, 21, 0.22)"
            strokeWidth="0.5"
          />
          {Array.from({ length: n }).map((_, i) => {
            const a = SLOT_ANGLE(i, n);
            const cx = r * Math.cos(a);
            const cy = r * Math.sin(a);
            const active = i === activeIdx;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={active ? 3 : 1.6}
                fill={active ? accent : "rgba(26, 24, 21, 0.62)"}
              />
            );
          })}
          <line x1={r - 4} y1={0} x2={r + 6} y2={0} stroke={accent} strokeWidth="1" />
        </g>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div>
          NODE {String(activeIdx + 1).padStart(2, "0")} /{" "}
          {String(n).padStart(2, "0")}
        </div>
        <div style={{ opacity: 0.55 }}>RING · A</div>
      </div>
    </div>
  );
}

/* ─── HUD footer (mini-map + All Projects) ───────────────── */
function HudFooter({
  accent,
  activeIdx,
  n,
  onAllProjects,
}: {
  accent: string;
  activeIdx: number;
  n: number;
  onAllProjects: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 18,
        left: 22,
        right: 22,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 16,
        font: '500 10px/1.4 var(--font-sans)',
        letterSpacing: ".16em",
        color: "var(--ink-62)",
        pointerEvents: "none",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <MiniMap activeIdx={activeIdx} n={n} accent={accent} />
      <Button
        variant="secondary"
        arrow="→"
        onClick={onAllProjects}
        style={{ pointerEvents: "auto" }}
      >
        All Projects
      </Button>
    </div>
  );
}

/* ─── Mobile: horizontal ◀ / ▶ navigation arrows ─────────── */
function MobileNavArrows({
  activeIdx,
  n,
  onPrev,
  onNext,
}: {
  activeIdx: number;
  n: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const canPrev = activeIdx > 0;
  const canNext = activeIdx < n - 1;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <button
        type="button"
        aria-label="Previous project"
        onClick={() => canPrev && onPrev()}
        disabled={!canPrev}
        className="btn-icon btn-icon-md"
      >
        <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden>
          <path
            d="M7.5 1 L2 5.5 L7.5 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <span
        style={{
          font: '500 10px/1 var(--font-sans)',
          letterSpacing: ".22em",
          color: "var(--ink-62)",
          textTransform: "uppercase",
          minWidth: 56,
          textAlign: "center",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(activeIdx + 1).padStart(2, "0")} /{" "}
        {String(n).padStart(2, "0")}
      </span>
      <button
        type="button"
        aria-label="Next project"
        onClick={() => canNext && onNext()}
        disabled={!canNext}
        className="btn-icon btn-icon-md"
      >
        <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden>
          <path
            d="M1.5 1 L7 5.5 L1.5 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

/* ─── Mobile: single active card under the dial ───────── */
function MobileActiveCard({
  project,
  idx,
  accent,
  direction,
  onOpen,
}: {
  project: Project;
  idx: number;
  accent: string;
  direction: number;
  onOpen: (id: string) => void;
}) {
  const slideFrom = direction >= 0 ? 28 : -28;
  const cardStyle = {
    margin: "0 16px",
    padding: "20px 22px",
    background: "rgba(245, 243, 238, 0.6)",
    border: "none",
    "--card-slide-from": `${slideFrom}px`,
    animation: "mobCardSlide .45s cubic-bezier(.32,.72,.32,1) both",
  } as CSSProperties;

  return (
    <div key={project.id} style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          font: '500 10px/1 var(--font-sans)',
          letterSpacing: ".22em",
          color: accent,
          marginBottom: 10,
        }}
      >
        <span>P/{String(idx + 1).padStart(2, "0")}</span>
      </div>

      <div
        style={{
          font: '600 24px/1.05 var(--font-sans)',
          letterSpacing: ".04em",
          color: "var(--ink)",
        }}
      >
        {project.title}
      </div>

      <div
        style={{
          marginTop: 6,
          font: '500 10px/1.3 var(--font-sans)',
          letterSpacing: ".16em",
          color: "var(--ink-62)",
          textTransform: "uppercase",
        }}
      >
        {project.year}, {project.role}
      </div>

      <div
        style={{
          marginTop: 14,
          borderTop: "1px dashed var(--ink-22)",
          paddingTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {project.tags.map((t) => (
            <span
              key={t}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                background: "var(--ink-22)",
                clipPath:
                  "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                padding: "3px 9px",
                font: '500 10px/1 var(--font-sans)',
                letterSpacing: ".18em",
                color: "var(--ink-62)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 1,
                  background: "var(--paper)",
                  clipPath:
                    "polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)",
                  zIndex: 0,
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>{t}</span>
            </span>
          ))}
        </div>

      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "nowrap",
        }}
      >
        <Button
          variant="primary"
          arrow="→"
          onClick={() => onOpen(project.id)}
        >
          View Project
        </Button>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────── */
const ORBIT_PAD = 96;
const ACTIVE_PANEL_W = 460;
const HUD_V = 90;
const SAFE_MARGIN = 20;

export default function PortfolioDial() {
  const [activeIdx, setActiveIdx] = useState(0);
  const n = PROJECTS.length;
  const accent = ACCENT;

  const router = useRouter();

  // Track which way the user moved most recently — drives mobile card slide.
  const [direction, setDirection] = useState(0);
  const prevActiveRef = useRef(activeIdx);
  useEffect(() => {
    const delta = activeIdx - prevActiveRef.current;
    if (delta !== 0) setDirection(delta > 0 ? 1 : -1);
    prevActiveRef.current = activeIdx;
  }, [activeIdx]);

  // Viewport state — SSR-safe (starts at 0/0, populates on mount).
  // The `mounted` flag gates the dial geometry: SSR renders an empty
  // .dial-stage and the client populates it post-hydration. This sidesteps
  // hydration mismatches from sub-ULP differences in Math.cos / Math.sin
  // between Node (server) and the browser engine.
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const onResize = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    setMounted(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const arcRad = (CONFIG.arcSpread * Math.PI) / 180;
  const slotStep = n > 1 ? arcRad / (n - 1) : 0;
  const dialAngle = useTransitionAngle(activeIdx, slotStep);
  const visualAngle = dialAngle;

  // Container ref + IntersectionObserver to scope keyboard input.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation — only when in view (so arrow keys scroll the page
  // when the dial is off-screen).
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, n - 1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        router.push(`/projects/${PROJECTS[activeIdx].id}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, activeIdx, n, router]);

  const isMobile = vp.w > 0 && vp.w <= 720;
  const dialShift = isMobile ? 0 : ACTIVE_PANEL_W * 0.6;

  let dialSize: number;
  if (vp.w === 0) {
    dialSize = 220;
  } else if (isMobile) {
    const byW = vp.w * 0.7;
    const byH = vp.h * 0.45;
    dialSize = Math.max(220, Math.min(320, byW, byH));
  } else {
    const halfW = vp.w / 2;
    const rByLeft = halfW - dialShift - SAFE_MARGIN;
    const rByRight =
      halfW + dialShift - SAFE_MARGIN - ORBIT_PAD - ACTIVE_PANEL_W;
    const rByH = (vp.h - 2 * HUD_V) / 2;
    const maxRadius = Math.max(180, Math.min(rByLeft, rByRight, rByH));
    const maxDiameter = maxRadius * 2;
    dialSize = Math.min(CONFIG.dialSize, maxDiameter);
  }

  const active = PROJECTS[activeIdx];

  // Touch swipe (mobile): horizontal drag → prev/next.
  const touchRef = useRef<{ x: number; y: number; fired: boolean } | null>(
    null,
  );
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, fired: false };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current || touchRef.current.fired) return;
    const t = e.touches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      touchRef.current.fired = true;
      if (dx < 0) setActiveIdx((i) => Math.min(i + 1, n - 1));
      else setActiveIdx((i) => Math.max(i - 1, 0));
    }
  };
  const onTouchEnd = () => {
    touchRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
      className="dial-stage"
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {mounted && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.35,
              background:
                "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(26, 24, 21, 0.06))",
            }}
          />

          {isMobile ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 28,
                paddingBottom: 90,
                gap: 32,
                width: "100%",
                minHeight: "100%",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: dialSize,
                  height: dialSize,
                  flexShrink: 0,
                }}
              >
                <DotField size={dialSize} angle={visualAngle} />
                <TickRing
                  size={dialSize}
                  accent={accent}
                  hudOn={CONFIG.hudOn}
                />
                <CenterImage
                  size={Math.round(dialSize * 0.76)}
                  image={active.image}
                  alt={active.title}
                />
              </div>

              <MobileNavArrows
                activeIdx={activeIdx}
                n={n}
                onPrev={() => setActiveIdx((i) => Math.max(0, i - 1))}
                onNext={() => setActiveIdx((i) => Math.min(n - 1, i + 1))}
              />

              <div style={{ width: "100%" }}>
                <MobileActiveCard
                  project={active}
                  idx={activeIdx}
                  accent={accent}
                  direction={direction}
                  onOpen={(id) => router.push(`/projects/${id}`)}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% - ${dialShift}px), -50%)`,
                width: dialSize,
                height: dialSize,
              }}
            >
              <DotField size={dialSize} angle={visualAngle} />
              <TickRing size={dialSize} accent={accent} hudOn={CONFIG.hudOn} />
              <CenterImage
                size={Math.round(dialSize * 0.72)}
                image={active.image}
                alt={active.title}
              />

              <OrbitingHeadings
                projects={PROJECTS}
                activeIdx={activeIdx}
                radius={dialSize / 2 + ORBIT_PAD}
                dialAngle={dialAngle}
                arcSpread={CONFIG.arcSpread}
                accent={accent}
                onSelect={setActiveIdx}
                onOpen={(id) => router.push(`/projects/${id}`)}
              />

              <NavArrows
                dialSize={dialSize}
                canPrev={activeIdx > 0}
                canNext={activeIdx < n - 1}
                onPrev={() => setActiveIdx((i) => Math.max(0, i - 1))}
                onNext={() => setActiveIdx((i) => Math.min(n - 1, i + 1))}
              />
            </div>
          )}

          {CONFIG.hudOn && (
            <HudFooter
              accent={accent}
              activeIdx={activeIdx}
              n={n}
              onAllProjects={() => {
                router.push("/projects");
              }}
            />
          )}
        </>
      )}

    </div>
  );
}
