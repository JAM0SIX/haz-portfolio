import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonArrow = "→" | "↗" | "↘";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variant?: ButtonVariant;
  /** Trailing arrow glyph. Pass `false` (default) for no arrow. */
  arrow?: ButtonArrow | false;
  /** The visible label. Used as both the rendered text and the data-text
      ghost-width reservation. */
  children: string;
};

/**
 * Canonical text button per DESIGN-SYSTEM.md §2.1.
 *
 * Auto-handles the `data-text` ghost-width reservation so the button
 * doesn't resize when text shifts from weight 500 → 600 on hover.
 *
 * Three tiers — primary (accent), secondary (ink), tertiary (accent
 * border). Optional trailing arrow that slides 3px right on hover.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    arrow = false,
    className,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      <span data-text={children}>{children}</span>
      {arrow && (
        <span className="btn-arrow" aria-hidden>
          {arrow}
        </span>
      )}
    </button>
  );
});

export default Button;
export type { ButtonProps, ButtonVariant, ButtonArrow };

/* ─────────────────────────────────────────────────────────────
   Icon-only button — accent border, accent icon, paper interior.
   Pass an SVG (or any ReactNode) as children.
   ───────────────────────────────────────────────────────────── */

type IconButtonSize = "sm" | "md" | "lg";

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  size?: IconButtonSize;
  /** Required for accessibility — describes the icon's action. */
  "aria-label": string;
  children: ReactNode;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { size = "md", className, children, type = "button", ...rest },
    ref,
  ) {
    const classes = ["btn-icon", `btn-icon-${size}`, className]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} type={type} className={classes} {...rest}>
        {children}
      </button>
    );
  },
);

export type { IconButtonProps, IconButtonSize };
