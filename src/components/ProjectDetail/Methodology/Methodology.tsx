"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import styles from "./Methodology.module.css";
import { STAGES, type Stage } from "./stages";

const VIEWBOX = 720;
const CX = VIEWBOX / 2;
const CY = VIEWBOX / 2;
const NODE_R = 220;
const KNOB_R = 100;
const LABEL_OFFSET = 12;
const DOT_RINGS: ReadonlyArray<readonly [number, number]> = [
  [120, 32],
  [160, 56],
  [200, 80],
];

const SEG_COUNT = 2;
const INK_LIGHT = 0.22;
const INK_DARK = 0.82;

function r3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function shortestAngle(delta: number): number {
  return Math.atan2(Math.sin(delta), Math.cos(delta));
}

function shortestStep(from: number, to: number, n: number): number {
  let d = (((to - from) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

function dotFill(angle: number, peak: number, bandHalf: number): string {
  const diff = Math.abs(shortestAngle(angle - peak));
  if (diff >= bandHalf) {
    return `rgba(26, 24, 21, ${INK_LIGHT.toFixed(3)})`;
  }
  const t = 1 - diff / bandHalf;
  const alpha = INK_LIGHT + (INK_DARK - INK_LIGHT) * t;
  return `rgba(26, 24, 21, ${alpha.toFixed(3)})`;
}

function labelAlign(angleRad: number): keyof typeof ALIGN_CLASS {
  const deg = ((angleRad * 180) / Math.PI + 360) % 360;
  if (Math.abs(deg - 270) < 1) return "top";
  if (Math.abs(deg - 90) < 1) return "bottom";
  if (deg < 22.5 || deg >= 337.5) return "right";
  if (deg < 90) return "bottomRight";
  if (deg < 157.5) return "bottomLeft";
  if (deg < 202.5) return "left";
  if (deg < 270) return "topLeft";
  return "topRight";
}

const ALIGN_CLASS = {
  top: "alignTop",
  topRight: "alignTopRight",
  topLeft: "alignTopLeft",
  right: "alignRight",
  left: "alignLeft",
  bottom: "alignBottom",
  bottomRight: "alignBottomRight",
  bottomLeft: "alignBottomLeft",
} as const;

type StageLayout = Stage & {
  idx: number;
  angle: number;
  x: number;
  y: number;
  align: keyof typeof ALIGN_CLASS;
  labelLeft: string;
  labelTop: string;
};

const STAGE_LAYOUTS: ReadonlyArray<StageLayout> = STAGES.map((s, i) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / STAGES.length;
  const labelX = CX + Math.cos(angle) * (NODE_R + LABEL_OFFSET);
  const labelY = CY + Math.sin(angle) * (NODE_R + LABEL_OFFSET);
  return {
    ...s,
    idx: i,
    angle,
    x: r3(CX + Math.cos(angle) * NODE_R),
    y: r3(CY + Math.sin(angle) * NODE_R),
    align: labelAlign(angle),
    labelLeft: `${r3((labelX / VIEWBOX) * 100)}%`,
    labelTop: `${r3((labelY / VIEWBOX) * 100)}%`,
  };
});

const N = STAGES.length;
const CIRC = 2 * Math.PI * NODE_R;
const SEG = CIRC / N;
const ARC_SPAN = SEG_COUNT * SEG;
const SEG_DEG = 360 / N;
const PEAK = -Math.PI / 2;
const BAND_HALF = (2 * Math.PI) / N;

type Dot = { x: number; y: number; fill: string };
const DOTS: ReadonlyArray<Dot> = DOT_RINGS.flatMap(([radius, count]) => {
  const out: Dot[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * 2 * Math.PI;
    out.push({
      x: r3(CX + Math.cos(a) * radius),
      y: r3(CY + Math.sin(a) * radius),
      fill: dotFill(a, PEAK, BAND_HALF),
    });
  }
  return out;
});

const ARC_SPAN_R = r3(ARC_SPAN);
const ARC_GAP_R = r3(CIRC - ARC_SPAN);

export default function Methodology() {
  const [activeIdx, setActiveIdx] = useState(0);
  const stepCountRef = useRef(0);
  const prevIdxRef = useRef(0);

  const activate = useCallback((idx: number) => {
    setActiveIdx((current) => {
      if (idx === current) return current;
      const delta = shortestStep(prevIdxRef.current, idx, N);
      stepCountRef.current += delta;
      prevIdxRef.current = idx;
      return idx;
    });
  }, []);

  const active = STAGE_LAYOUTS[activeIdx];
  const dotsGroupRef = useRef<SVGGElement | null>(null);
  const arcActiveRef = useRef<SVGCircleElement | null>(null);
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const dots = dotsGroupRef.current;
    const arc = arcActiveRef.current;
    const step = stepCountRef.current;
    if (dots) {
      dots.setAttribute("transform", `rotate(${(step * 360) / N} ${CX} ${CY})`);
    }
    if (arc) {
      arc.setAttribute("stroke-dashoffset", String(r3(-step * SEG)));
    }
  }, [activeIdx]);

  const onLabelKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>, idx: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate(idx);
        return;
      }
      const delta =
        e.key === "ArrowRight" || e.key === "ArrowDown"
          ? 1
          : e.key === "ArrowLeft" || e.key === "ArrowUp"
            ? -1
            : 0;
      if (!delta) return;
      e.preventDefault();
      const nextIdx = (idx + delta + N) % N;
      activate(nextIdx);
      labelRefs.current[nextIdx]?.focus();
    },
    [activate],
  );

  const [openId, setOpenId] = useState<string | null>(STAGES[0].id);
  const toggleAccordion = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const arcRotation = -90 - (SEG_COUNT * SEG_DEG) / 2;

  return (
    <section className={styles.root}>
      <div className={styles.grid}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            How I approached the problem,
            <br />
            <span className={styles.headingMuted}>and the people around it.</span>
          </h2>
        </div>

        <div className={styles.stage}>
          <div
            className={styles.diagram}
            role="group"
            aria-label="Process diagram, 5 stages around a circle"
          >
            <svg className={styles.diagramSvg} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} aria-hidden="true">
              <circle cx={CX} cy={CY} r={220} className={styles.dotsBackdrop} />
              <g ref={dotsGroupRef} className={styles.dotsGroup}>
                {DOTS.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r={1.3} fill={d.fill} />
                ))}
              </g>

              <circle cx={CX} cy={CY} r={KNOB_R} fill="var(--paper-deep)" stroke="var(--ink-22)" strokeWidth={0.5} />
              <circle cx={CX} cy={CY} r={NODE_R} className={styles.ring} />
              <circle cx={CX} cy={CY} r={NODE_R} className={styles.arcTrack} />
              <circle
                ref={arcActiveRef}
                cx={CX}
                cy={CY}
                r={NODE_R}
                className={styles.arcActive}
                strokeDasharray={`${ARC_SPAN_R} ${ARC_GAP_R}`}
                strokeDashoffset={0}
                transform={`rotate(${arcRotation} ${CX} ${CY})`}
              />

              <g>
                {STAGE_LAYOUTS.map((s) => {
                  const isActive = s.idx === activeIdx;
                  return (
                    <g
                      key={s.id}
                      className={styles.nodeGroup + (isActive ? " " + styles.isActive : "")}
                      onClick={() => activate(s.idx)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx={s.x} cy={s.y} r={32} className={styles.nodeHit} />
                      <circle cx={s.x} cy={s.y} r={20} className={styles.nodeRing} />
                      <circle cx={s.x} cy={s.y} r={10} className={styles.nodeDot} />
                    </g>
                  );
                })}
              </g>
            </svg>

            <div
              className={styles.labelLayer}
              role="group"
              aria-label="Methodology stages — use arrow keys to navigate, Enter to activate"
            >
              {STAGE_LAYOUTS.map((s) => {
                const isActive = s.idx === activeIdx;
                const labelStyle: CSSProperties = {
                  left: s.labelLeft,
                  top: s.labelTop,
                };
                return (
                  <div
                    key={s.id}
                    ref={(el) => {
                      labelRefs.current[s.idx] = el;
                    }}
                    className={
                      styles.label +
                      " " +
                      styles[ALIGN_CLASS[s.align]] +
                      (isActive ? " " + styles.isActive : "")
                    }
                    style={labelStyle}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    aria-label={`${s.label}, stage ${s.idx + 1} of ${N}`}
                    onClick={() => activate(s.idx)}
                    onKeyDown={(e) => onLabelKey(e, s.idx)}
                  >
                    <span className={styles.labelName}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className={styles.panel} aria-live="polite">
            <div className={styles.panelReadout}>
              <span className={styles.panelReadoutDot} aria-hidden="true" />
              <span>{active.readout}</span>
            </div>
            <h3 className={styles.panelTitle}>{active.title}</h3>
            <p className={styles.panelBody}>{active.body}</p>
            <div className={styles.panelMeta}>
              <span className={styles.panelMetaLabel}>{active.metaLabel}</span>
              <span className={styles.panelMetaBody}>{active.metaBody}</span>
            </div>
            <a className={`btn btn-primary ${styles.readLink}`} href={active.href}>
              <span data-text="Read article">Read article</span>
              <span className="btn-arrow" aria-hidden>
                ↗
              </span>
            </a>
          </aside>
        </div>

        <div className={styles.list}>
          {STAGES.map((s, i) => {
            const isOpen = openId === s.id;
            const letter = ROMAN[i];
            return (
              <div key={s.id} className={styles.row + (isOpen ? " " + styles.isOpen : "")}>
                <button
                  type="button"
                  className={styles.summary}
                  aria-expanded={isOpen}
                  aria-controls={`method-body-${s.id}`}
                  onClick={() => toggleAccordion(s.id)}
                >
                  <span className={styles.rowLetter}>{letter}</span>
                  <span className={styles.rowTitle}>{s.label}</span>
                  <span className={styles.toggle} aria-hidden="true">
                    <svg viewBox="0 0 12 12" className={styles.toggleSvg}>
                      <line className={styles.toggleStroke} x1="2" y1="6" x2="10" y2="6" />
                      <line
                        className={styles.toggleStroke + " " + styles.toggleStrokeV}
                        x1="6"
                        y1="2"
                        x2="6"
                        y2="10"
                      />
                    </svg>
                  </span>
                </button>
                <div id={`method-body-${s.id}`} className={styles.bodyWrap + (isOpen ? " " + styles.isOpen : "")}>
                  <div className={styles.bodyInner}>
                    <div className={styles.body}>
                      <p>{s.body}</p>
                      <div className={styles.bodyMeta}>
                        <span className={styles.panelMetaLabel}>{s.metaLabel}</span>
                        <span className={styles.panelMetaBody}>{s.metaBody}</span>
                        <a className={`btn btn-primary ${styles.bodyReadLink}`} href={s.href}>
                          <span data-text="Read article">Read article</span>
                          <span className="btn-arrow" aria-hidden>
                            ↗
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const ROMAN = ["i", "ii", "iii", "iv", "v"] as const;
