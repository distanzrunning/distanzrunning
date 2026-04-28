import type { CSSProperties, ReactNode } from "react";

// ============================================================================
// PageFrame
// ============================================================================
//
// Inset framed surface that wraps the body of every public page.
// Sits flush below the header (margin-top: 0) and floats above the
// footer with 8 px margins on the other three sides — same anatomy
// as v0.app's main element (m-2 mt-0). The flush top removes the
// gap below the header so the header content reads centred in its
// own row.
//
// Anatomy:
//   - Background flips with the theme so each mode keeps the
//     "canvas outside, elevated surface inside" relationship:
//       light → bg-200 (secondary surface)
//       dark  → bg-100 (elevated surface)
//     The outer layout wrapper holds the canvas (bg-100 light,
//     bg-200 dark).
//   - 1 px --ds-gray-400 border on all four sides
//   - 6 px radius (radius-small)
//   - No shadow — the border is the only edge treatment
//   - container-type: inline-size so descendants can use @container
//     queries against the frame's width, independent of viewport
//
// Usage: wrap whatever content should live inside the framed area
// (typically <main>{children}</main>). Header and footer go *outside*
// the frame.

export interface PageFrameProps {
  children: ReactNode;
  /** Extra classes (e.g. flex-1 + flex-col when used inside a column flex parent that needs the frame to fill available height). */
  className?: string;
  /** Override the default container-name (defaults to "page-frame") if you need a different name for @container queries. */
  containerName?: string;
}

export default function PageFrame({
  children,
  className = "",
  containerName = "page-frame",
}: PageFrameProps) {
  // container-type / container-name aren't in React's CSSProperties yet
  // (as of @types/react 19), so cast through unknown.
  const containerStyle = {
    containerType: "inline-size",
    containerName,
  } as unknown as CSSProperties;

  return (
    <div
      className={`relative bg-[var(--ds-background-200)] dark:bg-[var(--ds-background-100)] ${className}`.trim()}
      style={{
        margin: "0 8px 8px",
        border: "1px solid var(--ds-gray-400)",
        borderRadius: 6,
        ...containerStyle,
      }}
    >
      {children}
    </div>
  );
}
