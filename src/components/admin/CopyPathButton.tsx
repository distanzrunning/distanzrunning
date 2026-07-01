"use client";

import { useState } from "react";

import { Tooltip } from "@/components/ui/Tooltip";

// Shared chrome for a leaderboard-row action button (copy / filter) — mirrors
// Vercel's analytics action buttons class-for-class: 24px square, 6px radius,
// gray-800 glyph, gray-200 hover / gray-300 active interaction tones (the DS
// "interaction on a surface" steps). Exported so LeaderboardPanel's filter
// button shares the exact same chrome.
export const ROW_ACTION_BUTTON_CLASS =
  "inline-flex items-center justify-center w-6 h-6 rounded-[6px] cursor-pointer transition-colors text-[color:var(--ds-gray-800)] hover:bg-[var(--ds-gray-200)] active:bg-[var(--ds-gray-300)] active:text-[color:var(--ds-gray-900)]";

// Geist's exact clipboard + check glyphs (filled paths), matching Vercel's
// copy action. Inlined per the DS iconography rule for Geist-verbatim glyphs.
function CopyGlyph() {
  return (
    <svg
      height="16"
      width="16"
      viewBox="0 0 16 16"
      fill="none"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.625 6C13.5225 6 14.25 6.72754 14.25 7.625V12.625C14.25 13.5225 13.5225 14.25 12.625 14.25H8.625C7.72754 14.25 7 13.5225 7 12.625V7.625C7 6.72754 7.72754 6 8.625 6H12.625ZM8.625 7.25C8.41789 7.25 8.25 7.41789 8.25 7.625V12.625C8.25 12.8321 8.41789 13 8.625 13H12.625C12.8321 13 13 12.8321 13 12.625V7.625C13 7.41789 12.8321 7.25 12.625 7.25H8.625ZM8.69043 1.99121C9.58781 1.99121 10.3153 2.71886 10.3154 3.61621V4.70605H9.06543V3.61621C9.0653 3.40922 8.89746 3.24121 8.69043 3.24121H4.69043C4.48349 3.24131 4.31556 3.40928 4.31543 3.61621V9.61621C4.31543 9.82326 4.48341 9.99111 4.69043 9.99121H5.80176V11.2412H4.69043C3.79305 11.2411 3.06543 10.5136 3.06543 9.61621V3.61621C3.06556 2.71892 3.79313 1.99131 4.69043 1.99121H8.69043Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg
      height="16"
      width="16"
      viewBox="0 0 16 16"
      fill="none"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Hover-revealed copy chip for the page-path leaderboard. Floats against the
// row's right edge with a surface background so it masks the truncated path
// text underneath without colliding with the count column. Brief check-icon
// swap on click; no toast (the chip itself is the affordance).
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
        className={ROW_ACTION_BUTTON_CLASS}
      >
        {copied ? <CheckGlyph /> : <CopyGlyph />}
      </button>
    </Tooltip>
  );
}
