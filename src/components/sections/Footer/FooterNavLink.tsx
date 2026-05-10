"use client";

/**
 * Accent dot + underline like Menu.tsx MenuRow — here the row translates
 * left on hover (−8px) so right-aligned footer links stay flush on the right;
 * Menu uses +8 for left-aligned items.
 */

import { useState } from "react";
import { motion } from "motion/react";
import styles from "./Footer.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;
const ACCENT_COLOR = "#C2410C";

export type FooterNavLinkProps = {
  href: string;
  label: string;
  external?: boolean;
};

export default function FooterNavLink({
  href,
  label,
  external = false,
}: FooterNavLinkProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hovered || focused;

  return (
    <motion.a
      className={styles.navLink}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      animate={{ x: active ? -8 : 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {/* Sliding indicator dot on the left (same as Menu) */}
      <motion.span
        aria-hidden
        animate={{
          opacity: active ? 1 : 0,
          x: active ? 0 : -6,
          scale: active ? 1 : 0.5,
        }}
        transition={{ duration: 0.3, ease: EASE }}
        className={styles.navLinkDot}
        style={{ background: ACCENT_COLOR }}
      />
      <span className={styles.navLinkLabel}>
        {label}
        <motion.span
          initial={false}
          animate={{
            scaleX: active ? 1 : 0,
            opacity: active ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          className={styles.navLinkUnderline}
          style={{ background: ACCENT_COLOR }}
        />
      </span>
    </motion.a>
  );
}
