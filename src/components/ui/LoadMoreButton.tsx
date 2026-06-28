"use client";

import React from "react";
import { Button } from "./Button";

// ============================================================================
// Load More Button — Geist's full-width pagination button
// ============================================================================
// A full-width secondary Button for appending more items to a paginated list.
// `loading` swaps the label for a spinner + "Loading…" and busies the button;
// `gap` toggles the top margin that separates it from the list above; `rounded`
// can be turned off for a flush, square-cornered button inside a bordered card.

export interface LoadMoreButtonProps {
  /** Busy state — shows a spinner + "Loading..." and disables interaction. */
  loading?: boolean;
  /** Top margin separating the button from the list above (default true). */
  gap?: boolean;
  /** Rounded corners (default true). Off → square corners (rounded-none). */
  rounded?: boolean;
  /** Button label (default "Load More"). */
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

export function LoadMoreButton({
  loading = false,
  gap = true,
  rounded = true,
  children = "Load More",
  onClick,
  disabled,
  className,
}: LoadMoreButtonProps) {
  return (
    <Button
      variant="secondary"
      size="medium"
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      className={`w-full ${gap ? "mt-4" : "mt-0"}${
        rounded ? "" : " !rounded-none"
      }${className ? ` ${className}` : ""}`}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
}

export default LoadMoreButton;
