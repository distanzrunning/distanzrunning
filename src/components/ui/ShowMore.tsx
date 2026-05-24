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
        d="M12.0607 6.74999L11.5303 7.28032L8.7071 10.1035C8.31657 10.4941 7.68341 10.4941 7.29288 10.1035L4.46966 7.28032L3.93933 6.74999L4.99999 5.68933L5.53032 6.21966L7.99999 8.68933L10.4697 6.21966L11 5.68933L12.0607 6.74999Z"
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
            marginTop: visible.length > 0 || expanded ? "16px" : 0,
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "var(--ds-gray-400)",
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
              background: "var(--ds-gray-400)",
            }}
            data-line=""
          />
        </div>
      )}
    </div>
  );
}

export default ShowMore;
