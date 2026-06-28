"use client";

import { type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export interface ErrorCardProps {
  /** Primary error line, Title Case (e.g. "No Credits Left"). */
  title: string;
  /** Optional supporting message under the title. */
  message?: ReactNode;
  /** Extra classes on the card container. */
  className?: string;
}

// ============================================================================
// Icon — Geist's warning diamond (shared with Error / Note), 16px currentColor
// ============================================================================

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      height="16"
      width="16"
      aria-hidden="true"
      style={{ color: "currentcolor" }}
    >
      <path
        fill="currentColor"
        d="M10.9 0a1 1 0 0 1 .7.3l4.1 4.1.07.07a1 1 0 0 1 .23.63v5.8a1 1 0 0 1-.3.7l-4.1 4.1a1 1 0 0 1-.7.3H5a1 1 0 0 1-.53-.23l-.08-.06-4.1-4.1A1 1 0 0 1 0 10.9V5.1a1 1 0 0 1 .3-.7L4.4.3A1 1 0 0 1 5 0h5.9M1.5 5.3v5.4l3.8 3.8h5.4l3.8-3.8V5.3l-3.8-3.8H5.3zM8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2m.75-1.25h-1.5v-5h1.5z"
      />
    </svg>
  );
}

// ============================================================================
// ErrorCard
// ============================================================================
//
// Geist's Error Card: a card surface tinted for error state — red-200 fill,
// red-400 hairline, red-900 ink, no shadow, rounded (8px), p-4. Centered
// column of warning glyph + title (+ optional message).
//
// Geist renders this as a plain div (no role). Wrap the card in an
// `aria-live="polite"` region when it appears asynchronously (after a
// failed fetch) so screen readers announce it — mirroring the Error page's
// accessibility guidance — rather than baking a role in that would
// over-announce statically-rendered cards.

export function ErrorCard({ title, message, className = "" }: ErrorCardProps) {
  return (
    <div
      className={`flex flex-col rounded border p-4 ${className}`}
      style={{
        backgroundColor: "var(--ds-red-200)",
        borderColor: "var(--ds-red-400)",
        color: "var(--ds-red-900)",
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <ErrorIcon />
        <h3 className="text-copy-16 text-center" style={{ color: "inherit" }}>
          {title}
        </h3>
        {message && (
          <p
            className="text-copy-14 text-center"
            style={{ color: "inherit", margin: 0 }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ErrorCard;
