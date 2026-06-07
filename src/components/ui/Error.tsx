"use client";

import { type ReactNode, type HTMLAttributes } from "react";

// ============================================================================
// Types
// ============================================================================

export type ErrorSize = "small" | "medium" | "large";

export interface ErrorProps extends HTMLAttributes<HTMLDivElement> {
  /** The error message to display */
  children: ReactNode;
  /** Optional label displayed in bold before the message (e.g. "Email Error") */
  label?: string;
  /** Size variant (default: "medium") */
  size?: ErrorSize;
  /**
   * Screen-reader announcement urgency. Default `"polite"` lets the
   * current utterance finish before announcing. Pass `"assertive"`
   * only for true blocking errors that interrupt input — assertive
   * announcements cut off whatever a SR was reading.
   */
  live?: "polite" | "assertive";
}

// ============================================================================
// Error Icon (octagon with exclamation mark)
// ============================================================================

function ErrorIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ width: 16, height: 16, color: "var(--ds-red-900)" }}
    >
      <path
        fill="currentColor"
        d="M10.9 0a1 1 0 0 1 .7.3l4.1 4.1.07.07a1 1 0 0 1 .23.63v5.8a1 1 0 0 1-.3.7l-4.1 4.1a1 1 0 0 1-.7.3H5a1 1 0 0 1-.53-.23l-.08-.06-4.1-4.1A1 1 0 0 1 0 10.9V5.1a1 1 0 0 1 .3-.7L4.4.3A1 1 0 0 1 5 0h5.9M1.5 5.3v5.4l3.8 3.8h5.4l3.8-3.8V5.3l-3.8-3.8H5.3zM8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2m.75-1.25h-1.5v-5h1.5z"
      />
    </svg>
  );
}

// ============================================================================
// Size config
// ============================================================================

const sizeStyles: Record<ErrorSize, { fontSize: number; lineHeight: string }> = {
  small: { fontSize: 13, lineHeight: "20px" },
  medium: { fontSize: 14, lineHeight: "20px" },
  large: { fontSize: 16, lineHeight: "24px" },
};

// ============================================================================
// Error Component
// ============================================================================

function Error({
  children,
  label,
  size = "medium",
  live = "polite",
  className = "",
  ...rest
}: ErrorProps) {
  const { fontSize, lineHeight } = sizeStyles[size];

  return (
    <div
      className={`flex flex-row items-stretch ${className}`}
      role={live === "assertive" ? "alert" : "status"}
      aria-live={live}
      aria-atomic="true"
      {...rest}
    >
      <div
        aria-hidden="true"
        className="flex items-center flex-shrink-0"
        style={{ marginRight: 8, marginTop: size === "large" ? 4 : 2 }}
      >
        <ErrorIcon />
      </div>
      <div
        style={{
          fontSize,
          lineHeight,
          color: "var(--ds-red-900)",
        }}
      >
        {label && (
          <b style={{ fontWeight: 600 }}>
            {label}:{" "}
          </b>
        )}
        {children}
      </div>
    </div>
  );
}

Error.displayName = "Error";

export { Error };
export default Error;
