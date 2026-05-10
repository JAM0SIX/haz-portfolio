"use client";

/**
 * SpinningLogo — Haz site mark.
 *
 * Four black squares + an orange circle in the upper-right. The name
 * is historical (the old mark was a Three.js spinning model); the
 * component now renders a static SVG. On hover, the four squares
 * stagger-rotate 45° while the orange circle drifts up-and-to-the-right.
 * Styles live in ./SpinningLogo.module.css.
 */

import type { CSSProperties } from "react";
import styles from "./SpinningLogo.module.css";

export interface SpinningLogoProps {
  /** CSS size in px (number) or any CSS string. Default: 72 */
  size?: number | string;
  /** Optional extra class name appended to the root <svg>. */
  className?: string;
  /** Optional inline styles forwarded to the root <svg>. */
  style?: CSSProperties;
  /** Accessibility label. Default: "Haz logo" */
  ariaLabel?: string;
}

export default function SpinningLogo({
  size = 72,
  className,
  style,
  ariaLabel = "Haz logo",
}: SpinningLogoProps) {
  const cls = [styles.logo, className].filter(Boolean).join(" ");

  return (
    <svg
      className={cls}
      width={size}
      height={size}
      viewBox="0 0 783 782"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      role="img"
      aria-label={ariaLabel}
      style={style}
    >
      <path
        className={styles["sq-tl"]}
        d="M 0 0 L 261 0 L 261 261 L 0 261 Z"
      />
      <path
        className={styles["sq-mid"]}
        d="M 261 261 L 522 261 L 522 522 L 261 522 Z"
      />
      <path
        className={styles["sq-bl"]}
        d="M 0 521 L 261 521 L 261 782 L 0 782 Z"
      />
      <path
        className={styles["sq-br"]}
        d="M 522 521 L 783 521 L 783 782 L 522 782 Z"
      />
      <path
        className={styles.circle}
        d="M 522 130.5 C 522 58.427 580.427 0 652.5 0 C 724.573 0 783 58.427 783 130.5 C 783 202.573 724.573 261 652.5 261 C 580.427 261 522 202.573 522 130.5 Z"
      />
    </svg>
  );
}
