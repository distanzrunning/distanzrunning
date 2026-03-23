import React, { forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

/** Props for the LoadingDots component */
export interface LoadingDotsProps {
  /** Dot size in pixels (default: 2) */
  size?: number;
  /** Optional text to show before the dots (e.g. "Loading") */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

// ============================================================================
// LoadingDots Component
// ============================================================================

export const LoadingDots = forwardRef<HTMLSpanElement, LoadingDotsProps>(
  ({ size = 2, children, className = "", style }, ref) => {
    const hasText = children !== undefined;

    const dotStyle: React.CSSProperties = {
      display: "block",
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: "var(--ds-gray-800)",
      margin: "0 1px",
      animationName: "loading-dot",
      animationDuration: "1.4s",
      animationFillMode: "both",
      animationIterationCount: "infinite",
    };

    return (
      <span
        ref={ref}
        className={`loading-dots ${className}`.trim()}
        style={{
          display: hasText ? "inline-flex" : "flex",
          alignItems: "center",
          ...style,
        }}
        data-geist-loading-dots=""
      >
        {hasText && (
          <div style={{ marginRight: 12 }}>
            <p
              style={{
                fontSize: 14,
                lineHeight: "20px",
                color: "var(--ds-gray-900)",
                margin: 0,
              }}
            >
              {children}
            </p>
          </div>
        )}
        <span style={{ ...dotStyle, animationDelay: "0s" }} />
        <span style={{ ...dotStyle, animationDelay: "0.2s" }} />
        <span style={{ ...dotStyle, animationDelay: "0.4s" }} />
      </span>
    );
  },
);

LoadingDots.displayName = "LoadingDots";

export default LoadingDots;
