"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ShowMoreProps {
  children: React.ReactNode;
  /** Initially expanded */
  defaultExpanded?: boolean;
  /** Custom "show more" label */
  moreLabel?: string;
  /** Custom "show less" label */
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
  defaultExpanded = false,
  moreLabel = "Show More",
  lessLabel = "Show Less",
  className = "",
}: ShowMoreProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={className}>
      {/* Toggle row */}
      <div style={{ display: "flex", alignItems: "center" }}>
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
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: 14, lineHeight: "20px" }}>
            {expanded ? lessLabel : moreLabel}
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

      {/* Collapsible content */}
      {expanded && <div style={{ marginTop: "16px" }}>{children}</div>}
    </div>
  );
}

export default ShowMore;
