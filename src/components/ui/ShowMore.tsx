"use client";

import { Children, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

interface ShowMoreProps {
  /**
   * The list of children to disclose. Optional — when omitted, the
   * trigger row renders as a standalone affordance (useful for
   * documentation / preview surfaces).
   */
  children?: React.ReactNode;
  /**
   * How many of the first children to render before the rest is
   * hidden behind the Show More toggle. Defaults to 5. Set to 0 to
   * hide everything until expanded (rare — usually pick a number that
   * conveys the shape of the list).
   */
  initiallyVisible?: number;
  /** Initially expanded */
  defaultExpanded?: boolean;
  /**
   * Custom "show more" label. When omitted, the label is built from
   * the hidden count (e.g. `Show 12 More`).
   */
  moreLabel?: string;
  /** Custom "show less" label. Defaults to `Show Less`. */
  lessLabel?: string;
  /**
   * Hide the flanking divider lines (render them at `opacity-0`) so the
   * trigger floats on its own — Geist's "No border" variant.
   */
  noBorder?: boolean;
  /** Additional CSS classes */
  className?: string;
}

function ChevronDownIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m12.06 6.75-.53.53-2.82 2.82a1 1 0 0 1-1.42 0L4.47 7.28l-.53-.53L5 5.69l.53.53L8 8.69l2.47-2.47.53-.53z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ShowMore({
  children,
  initiallyVisible = 5,
  defaultExpanded = false,
  moreLabel,
  lessLabel = "Show Less",
  noBorder = false,
  className = "",
}: ShowMoreProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hiddenListId = useId();
  const firstHiddenRef = useRef<HTMLDivElement>(null);

  const childrenArray = Children.toArray(children);
  const visible = childrenArray.slice(0, initiallyVisible);
  const hidden = childrenArray.slice(initiallyVisible);
  const hasHidden = hidden.length > 0;
  // Render the trigger affordance even with no children — supports
  // visual-only previews on documentation surfaces.
  const showTrigger = hasHidden || childrenArray.length === 0;

  // Auto-build the "Show {n} More" label when caller didn't override.
  // Falls back to plain "Show More" when there's no count to show.
  const computedMoreLabel =
    moreLabel ?? (hidden.length > 0 ? `Show ${hidden.length} More` : "Show More");

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      // After the newly revealed list renders, move focus there so
      // keyboard / SR users land in the new content.
      requestAnimationFrame(() => firstHiddenRef.current?.focus());
    }
  };

  return (
    <div className={className}>
      {visible.length > 0 && <div>{visible}</div>}

      {hasHidden && expanded && (
        <div
          id={hiddenListId}
          ref={firstHiddenRef}
          tabIndex={-1}
          style={{
            outline: "none",
            marginTop: visible.length > 0 ? "16px" : 0,
          }}
        >
          {hidden}
        </div>
      )}

      {showTrigger && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop:
              visible.length > 0 || (expanded && hasHidden) ? "16px" : 0,
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "var(--ds-gray-alpha-400)",
              opacity: noBorder ? 0 : 1,
            }}
            data-line=""
          />
          <Button
            variant="secondary"
            shape="rounded"
            size="small"
            onClick={handleToggle}
            aria-expanded={expanded}
            aria-controls={hiddenListId}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: 14,
                lineHeight: "20px",
              }}
            >
              {expanded ? lessLabel : computedMoreLabel}
              <span
                style={{
                  display: "inline-flex",
                  transition: "transform 200ms ease",
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <ChevronDownIcon />
              </span>
            </span>
          </Button>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "var(--ds-gray-alpha-400)",
              opacity: noBorder ? 0 : 1,
            }}
            data-line=""
          />
        </div>
      )}
    </div>
  );
}

export default ShowMore;
