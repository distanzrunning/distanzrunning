"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Axis of the divider. */
  orientation?: "horizontal" | "vertical";
  /**
   * Purely visual (default) → `role="none"`, hidden from assistive tech.
   * Set `decorative={false}` for a meaningful section break → `role="separator"`
   * (a vertical semantic separator also announces `aria-orientation`).
   */
  decorative?: boolean;
}

// ============================================================================
// Separator
// ============================================================================

/**
 * A 1px divider between content, horizontal or vertical. A bare token-coloured
 * div (Geist's `data-slot="separator"`): `bg-gray-200`, `shrink-0`, and the
 * orientation's hairline size. `className` is merged with {@link cn} so callers
 * can override the colour or thickness (e.g. `bg-blue-500`, `h-2`).
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    { orientation = "horizontal", decorative = true, className, ...props },
    ref,
  ) {
    const isVertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        data-slot="separator"
        data-orientation={orientation}
        role={decorative ? "none" : "separator"}
        aria-orientation={!decorative && isVertical ? "vertical" : undefined}
        className={cn(
          "shrink-0 bg-[var(--ds-gray-200)]",
          isVertical ? "h-full w-px" : "h-px w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

export default Separator;
