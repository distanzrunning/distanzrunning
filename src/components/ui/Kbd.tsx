"use client";

import React, { forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

/** Kbd size options */
export type KbdSize = "default" | "small";

/** Props for the Kbd component */
export interface KbdProps {
  /** Keyboard key(s) to display */
  children?: React.ReactNode;
  /** Array of keys to render (alternative to children) */
  keys?: string[];
  /** Size of the kbd element */
  size?: KbdSize;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Style Maps
// ============================================================================

const sizeStyles: Record<KbdSize, React.CSSProperties> = {
  default: {
    minHeight: 26,
    minWidth: 26,
    padding: "0 6px",
    borderRadius: 6,
    fontSize: 14,
  },
  small: {
    minHeight: 20,
    minWidth: 20,
    padding: "0 4px",
    borderRadius: 4,
    fontSize: 12,
  },
};

// Modifier keys that should have consistent width
const MODIFIER_KEYS = new Set(["\u2318", "\u21E7", "\u2325", "\u2303"]);

// ============================================================================
// Kbd Component
// ============================================================================

/**
 * Keyboard input component for displaying keyboard shortcuts.
 *
 * @example
 * <Kbd>⌘</Kbd>
 * <Kbd keys={["⌘", "⇧"]} />
 * <Kbd size="small">/</Kbd>
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ children, keys, size = "default", className = "", style }, ref) => {
    const sizeStyle = sizeStyles[size];

    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 0 0 1px var(--ds-gray-alpha-400)",
      fontWeight: 500,
      color: "var(--ds-gray-900)",
      fontFamily: "inherit",
      background: "var(--ds-background-100)",
      lineHeight: "normal",
      ...sizeStyle,
      ...style,
    };

    const modifierSpanStyle: React.CSSProperties = {
      minWidth: "1em",
      display: "inline-block",
    };

    const renderKey = (key: string, index: number) => {
      const isModifier = MODIFIER_KEYS.has(key);
      return (
        <span key={index} style={isModifier ? modifierSpanStyle : undefined}>
          {key}
        </span>
      );
    };

    let content: React.ReactNode;

    if (keys && keys.length > 0) {
      content = keys.map((key, index) => renderKey(key, index));
    } else if (typeof children === "string") {
      content = <span>{children}</span>;
    } else {
      content = children;
    }

    return (
      <kbd ref={ref} className={className} style={baseStyle}>
        {content}
      </kbd>
    );
  },
);

Kbd.displayName = "Kbd";

export default Kbd;
