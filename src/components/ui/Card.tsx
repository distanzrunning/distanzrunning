"use client";

import { forwardRef } from "react";

// ============================================================================
// Card — a container that groups related content and actions on a surface.
//
// Geist-faithful: the base is `rounded-lg` (12px, = Geist's `rounded-lg`) +
// `p-4` on a surface, with the hairline supplied by the `--ds-shadow-border`
// token (no `border` — the ring lives inside the shadow, like our materials).
//
// `--ds-shadow-border` is the token we share with Geist. The extra resting
// `0 4px 6px` lift and the `0 6px 14px` hover lift are Geist's literal
// elevation one-offs (raw rgba in Geist too, not tokens), mirrored verbatim.
// ============================================================================

export type CardVariant = "default" | "hover" | "border" | "secondary";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * - `default` — flat hairline (`shadow-border`).
   * - `hover` — flat at rest, lifts on hover.
   * - `border` — raised at rest (`+0 4px 6px`), lifts further on hover.
   * - `secondary` — same as `border` but on the recessed canvas tone.
   */
  variant?: CardVariant;
  /** Draw hairline dividers between direct children (`gray-alpha-400`). */
  borderBetween?: boolean;
  /** Lay children in a row — dividers become vertical. Default is a column. */
  row?: boolean;
  children: React.ReactNode;
}

// secondary sits on the recessed canvas (bg-200); the rest raise off bg-100.
const FILL: Record<CardVariant, string> = {
  default: "bg-surface",
  hover: "bg-surface",
  border: "bg-surface",
  secondary: "bg-canvas",
};

const SHADOW: Record<CardVariant, string> = {
  default: "shadow-[var(--ds-shadow-border)]",
  hover:
    "shadow-[var(--ds-shadow-border)] transition-shadow duration-150 ease-in-out hover:shadow-[var(--ds-shadow-border),0_6px_14px_rgba(0,0,0,0.08)]",
  border:
    "shadow-[var(--ds-shadow-border),0_4px_6px_rgba(0,0,0,0.04)] transition-shadow duration-150 ease-in-out hover:shadow-[var(--ds-shadow-border),0_6px_14px_rgba(0,0,0,0.08)]",
  secondary:
    "shadow-[var(--ds-shadow-border),0_4px_6px_rgba(0,0,0,0.04)] transition-shadow duration-150 ease-in-out hover:shadow-[var(--ds-shadow-border),0_6px_14px_rgba(0,0,0,0.08)]",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      borderBetween = false,
      row = false,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const divide = borderBetween
      ? row
        ? "divide-x divide-[var(--ds-gray-alpha-400)]"
        : "divide-y divide-[var(--ds-gray-alpha-400)]"
      : "";

    return (
      <div
        ref={ref}
        className={`flex ${row ? "flex-row" : "flex-col"} rounded-lg p-4 ${FILL[variant]} ${SHADOW[variant]} ${divide} ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
