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
   * [Legacy] Array of pre-resolved glyphs to render. Prefer the boolean
   * modifier props below for platform-aware shortcuts — passing
   * hard-coded glyphs here ships Mac symbols to Windows/Linux users.
   */
  keys?: string[];
  /** Size of the kbd element */
  size?: KbdSize;
  /**
   * Render the Command / Ctrl glyph before children. Resolves to `⌘`
   * on Mac and `Ctrl` on Windows / Linux.
   */
  meta?: boolean;
  /** Render the Shift glyph (`⇧` on Mac, `Shift` elsewhere) before children. */
  shift?: boolean;
  /** Render the Option / Alt glyph (`⌥` on Mac, `Alt` elsewhere) before children. */
  alt?: boolean;
  /** Render the Control glyph (`⌃` on Mac, `Ctrl` elsewhere) before children. */
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

const MAC_GLYPHS = {
  meta: "⌘",
  shift: "⇧",
  alt: "⌥",
  ctrl: "⌃",
} as const;

const OTHER_LABELS = {
  meta: "Ctrl",
  shift: "Shift",
  alt: "Alt",
  ctrl: "Ctrl",
} as const;

// Set of Mac modifier glyphs — kept for the legacy `keys` prop so each
// modifier glyph in the array still gets the fixed-width treatment.
const MODIFIER_GLYPHS = new Set<string>(Object.values(MAC_GLYPHS));

// ============================================================================
// Platform detection
// ============================================================================

/**
 * Synchronously returns true on Mac/iOS. Reads the `data-platform`
 * attribute set by the bootstrap script in <head> (see layout.tsx),
 * so it produces the right answer on first render with no flash and
 * no hydration mismatch. Falls back to true (Mac default) on SSR or
 * if the script hasn't run yet.
 *
 * Exported so non-Kbd consumers (custom shortcut badges, animated kbd
 * compositions) can share the same logic.
 */
export function useIsMac(): boolean {
  if (typeof document === "undefined") return true;
  return document.documentElement.dataset.platform !== "other";
}

// ============================================================================
// Kbd Component
// ============================================================================

/**
 * Keyboard input component for displaying keyboard shortcuts.
 *
 * Renders BOTH the Mac glyph and the Windows/Linux label for each
 * modifier; CSS rules in globals.css hide whichever isn't active
 * based on the `data-platform` attribute set on <html> before paint.
 *
 * @example
 * <Kbd meta>K</Kbd>            // ⌘K on Mac, CtrlK on Windows/Linux
 * <Kbd meta shift>K</Kbd>      // ⇧⌘K on Mac, ShiftCtrlK on Windows/Linux
 * <Kbd>Enter</Kbd>             // Plain named key, platform-agnostic
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

    // Both glyphs sit in the DOM; CSS hides whichever doesn't match
    // the current platform. No JS state, no flicker.
    const renderModifier = (kind: keyof typeof MAC_GLYPHS) => (
      <React.Fragment key={`mod-${kind}`}>
        <span data-kbd-glyph="mac" style={modifierSpanStyle}>
          {MAC_GLYPHS[kind]}
        </span>
        <span data-kbd-glyph="other">{OTHER_LABELS[kind]}</span>
      </React.Fragment>
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
        const isModifier = MODIFIER_GLYPHS.has(key);
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
