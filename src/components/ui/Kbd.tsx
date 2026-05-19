"use client";

import React, { forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

/** Kbd size options */
export type KbdSize = "default" | "small";

/** Props for the Kbd component */
export interface KbdProps {
  /** Keyboard key(s) to display (a single key, digit, or named key like Enter / Esc) */
  children?: React.ReactNode;
  /**
   * [Legacy] Array of pre-resolved glyphs to render. Prefer the
   * boolean modifier props below — passing raw glyphs here defeats
   * the canonical render order.
   */
  keys?: string[];
  /** Size of the kbd element */
  size?: KbdSize;
  /** Render the Command glyph (⌘) before children. */
  meta?: boolean;
  /** Render the Shift glyph (⇧) before children. */
  shift?: boolean;
  /** Render the Option / Alt glyph (⌥) before children. */
  alt?: boolean;
  /** Render the Control glyph (⌃) before children. */
  ctrl?: boolean;
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

const MODIFIER_GLYPHS = {
  meta: "⌘",
  shift: "⇧",
  alt: "⌥",
  ctrl: "⌃",
} as const;

// Set of modifier glyphs — kept for the legacy `keys` prop so each
// modifier glyph in the array still gets the fixed-width treatment.
const MODIFIER_GLYPH_SET = new Set<string>(Object.values(MODIFIER_GLYPHS));

// ============================================================================
// Kbd Component
// ============================================================================

/**
 * Keyboard input component for displaying keyboard shortcuts.
 *
 * Modifier props render the canonical Mac glyphs (⌘ ⇧ ⌥ ⌃) on every
 * platform — they double as universally recognisable shortcut symbols
 * and keep the visual treatment consistent regardless of OS.
 *
 * @example
 * <Kbd meta>K</Kbd>            // ⌘K
 * <Kbd meta shift>K</Kbd>      // ⇧⌘K
 * <Kbd meta shift />           // ⇧⌘ (modifier combo, no key)
 * <Kbd>Enter</Kbd>             // Named key
 * <Kbd size="small">/</Kbd>    // Dense surfaces
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  (
    {
      children,
      keys,
      size = "default",
      meta,
      shift,
      alt,
      ctrl,
      className = "",
      style,
    },
    ref,
  ) => {
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

    const renderModifier = (kind: keyof typeof MODIFIER_GLYPHS) => (
      <span key={`mod-${kind}`} style={modifierSpanStyle}>
        {MODIFIER_GLYPHS[kind]}
      </span>
    );

    // Canonical order: ctrl → alt → shift → meta, then children.
    const modifiers: React.ReactNode[] = [];
    if (ctrl) modifiers.push(renderModifier("ctrl"));
    if (alt) modifiers.push(renderModifier("alt"));
    if (shift) modifiers.push(renderModifier("shift"));
    if (meta) modifiers.push(renderModifier("meta"));

    let content: React.ReactNode;

    if (modifiers.length > 0) {
      const keyContent =
        typeof children === "string" ? <span>{children}</span> : children;
      content = (
        <>
          {modifiers}
          {keyContent}
        </>
      );
    } else if (keys && keys.length > 0) {
      content = keys.map((key, index) => {
        const isModifier = MODIFIER_GLYPH_SET.has(key);
        return (
          <span key={index} style={isModifier ? modifierSpanStyle : undefined}>
            {key}
          </span>
        );
      });
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
