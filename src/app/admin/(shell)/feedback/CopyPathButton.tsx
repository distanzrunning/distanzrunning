"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Tooltip } from "@/components/ui/Tooltip";

// Hover-revealed copy chip for the page-path leaderboard. Floats
// against the row's right edge with a semi-transparent background so
// it masks the truncated path text underneath without colliding with
// the count column. Brief check-icon swap on click; no toast (the
// chip itself is the affordance).
export default function CopyPathButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Path is inside an <a>; stop the click from bubbling and
    // navigating away.
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <Tooltip content={copied ? "Copied" : "Copy path"}>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Copy path"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: 24,
          width: 24,
          borderRadius: 4,
          border: "none",
          background: "transparent",
          color: "var(--ds-gray-900)",
          cursor: "pointer",
        }}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </Tooltip>
  );
}
