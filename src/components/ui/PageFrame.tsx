import type { CSSProperties, ReactNode } from "react";

// ============================================================================
// PageFrame
// ============================================================================
//
// Inset framed surface that wraps the body of every public page. Sits
// flush below the navbar (margin-top: 0) and floats above the footer
// with 8px margins on the other three sides, giving the page chrome
// an inset card look — inspired by v0.app's page-layout container.
//
// Anatomy:
//   - --ds-background-200 inside the frame; --ds-background-100 sits
//     outside (set on the layout wrapper). Frame reads as a slightly
//     recessed body against the brighter chrome.
//   - 1px --ds-gray-400 border on all four sides
//   - 6px radius (radius-small)
//   - Subtle two-layer shadow for depth without dominating
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
      className={`relative ${className}`.trim()}
      style={{
        margin: "0 8px 8px",
        background: "var(--ds-background-200)",
        border: "1px solid var(--ds-gray-400)",
        borderRadius: 6,
        boxShadow:
          "0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 8px 8px -8px rgba(0, 0, 0, 0.04)",
        ...containerStyle,
      }}
    >
      {children}
    </div>
  );
}
