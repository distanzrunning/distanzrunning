import React, { forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

/** Props for the LoadingDots component */
export interface LoadingDotsProps {
  /** Dot size in pixels (default: 3) */
  size?: number;
  /** Optional text to show before the dots (e.g. "Loading") */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_SIZE = 3;
const DOT_GAP = 2;
const DOT_DELAYS = [0, 160, 320];

// ============================================================================
// LoadingDots Component
// ============================================================================

/**
 * Animated loading dots component with staggered pulsing animation.
 *
 * Renders 3 dots that pulse with staggered timing, matching the Geist
 * design system pattern.
 *
 * @example
 * <LoadingDots />
 * <LoadingDots size={4}>Loading</LoadingDots>
 */
export const LoadingDots = forwardRef<HTMLSpanElement, LoadingDotsProps>(
  ({ size = DEFAULT_SIZE, children, className = "", style }, ref) => {
    const containerStyle: React.CSSProperties = {
      gap: children ? undefined : `${DOT_GAP}px`,
      color: "var(--ds-gray-1000)",
      ...style,
    };

    const dotStyle: React.CSSProperties = {
      width: size,
      height: size,
      marginLeft: children ? `${DOT_GAP}px` : undefined,
    };

    return (
      <span
        ref={ref}
        className={`loading-dots ${className}`.trim()}
        style={containerStyle}
        data-geist-loading-dots=""
      >
        {children && (
          <div className="loading-dots__spacer">
            <p
              style={{
                fontSize: 14,
                color: "var(--ds-gray-900)",
                margin: 0,
              }}
            >
              {children}
            </p>
          </div>
        )}
        {DOT_DELAYS.map((delay) => (
          <span
            key={delay}
            className="loading-dots__dot"
            style={{ ...dotStyle, animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
    );
  },
);

LoadingDots.displayName = "LoadingDots";

export default LoadingDots;
