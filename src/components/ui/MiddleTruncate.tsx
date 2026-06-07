"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";

export interface MiddleTruncateProps extends HTMLAttributes<HTMLSpanElement> {
  /** The full string to display. */
  text: string;
}

const ELLIPSIS = "…";

/**
 * MiddleTruncate — truncates the *middle* of a string to fit its container,
 * keeping a balanced head and tail visible (e.g. long URLs / paths / IDs:
 * `feature/redesign-dash…bar-improvements`).
 *
 * Width-measured (Geist's algorithm): a hidden full-text copy reserves the
 * cell width (capped by the container), an off-layout span measures candidate
 * strings, and a binary search finds the most characters that fit with a
 * single ellipsis. Recomputes on container resize via ResizeObserver. The full
 * string is exposed to assistive tech + hover via `aria-label` / `title`.
 *
 * @example
 * <div className="max-w-[280px]">
 *   <MiddleTruncate text="apps/site/app/(dashboard)/[project]/settings/page.tsx" />
 * </div>
 */
export function MiddleTruncate({
  text,
  className = "",
  ...rest
}: MiddleTruncateProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;

    const fits = (candidate: string, available: number) => {
      measure.textContent = candidate;
      return measure.scrollWidth <= available;
    };

    const recompute = () => {
      const available = root.clientWidth;
      if (available === 0) return;

      if (fits(text, available)) {
        setDisplay(text);
        return;
      }

      // Largest n visible chars (head = ceil(n/2), tail = floor(n/2)) that
      // fits with a single ellipsis between them.
      let lo = 0;
      let hi = text.length - 1;
      let best = ELLIPSIS;
      while (lo <= hi) {
        const n = (lo + hi) >> 1;
        const head = Math.ceil(n / 2);
        const tail = n - head;
        const candidate =
          text.slice(0, head) +
          ELLIPSIS +
          (tail > 0 ? text.slice(text.length - tail) : "");
        if (fits(candidate, available)) {
          best = candidate;
          lo = n + 1;
        } else {
          hi = n - 1;
        }
      }
      setDisplay(best);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(root);
    return () => ro.disconnect();
  }, [text]);

  return (
    <span
      ref={rootRef}
      className={`relative inline-grid min-w-0 max-w-full overflow-hidden whitespace-nowrap ${className}`}
      title={text}
      aria-label={text}
      {...rest}
    >
      {/* Reserves the cell at the full-text width (capped by the container),
          so the cell stays stable as the visible copy changes. */}
      <span
        aria-hidden="true"
        className="invisible pointer-events-none select-none col-start-1 row-start-1 whitespace-nowrap"
      >
        {text}
      </span>
      {/* Visible, computed truncation overlaid in the same cell. */}
      <span
        aria-hidden="true"
        className="col-start-1 row-start-1 min-w-0 overflow-hidden"
      >
        {display}
      </span>
      {/* Off-layout measuring span (inherits font from the root). */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="absolute left-0 top-0 invisible pointer-events-none select-none whitespace-nowrap"
      />
    </span>
  );
}

export default MiddleTruncate;
