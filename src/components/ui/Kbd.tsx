"use client";

import React, { forwardRef, useEffect, useState } from "react";

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
   * the canonical render order and the platform-aware swap.
   */
  keys?: string[];
  /** Size of the kbd element */
  size?: KbdSize;
  /** Render the Command glyph (⌘ on Mac, "Ctrl" on Windows/Linux). */
  meta?: boolean;
  /** Render the Shift glyph (⇧ on Mac, "Shift" on Windows/Linux). */
  shift?: boolean;
  /** Render the Option / Alt glyph (⌥ on Mac, "Alt" on Windows/Linux). */
  alt?: boolean;
  /** Render the Control glyph (⌃ on Mac, "Ctrl" on Windows/Linux). */
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

const MAC_MODIFIER_GLYPHS = {
  meta: "⌘",
  shift: "⇧",
  alt: "⌥",
  ctrl: "⌃",
} as const;

const NON_MAC_MODIFIER_GLYPHS = {
  meta: "Ctrl",
  shift: "Shift",
  alt: "Alt",
  ctrl: "Ctrl",
} as const;

// Set of modifier glyphs — kept for the legacy `keys` prop so each
// modifier glyph in the array still gets the fixed-width treatment.
const MODIFIER_GLYPH_SET = new Set<string>([
  ...Object.values(MAC_MODIFIER_GLYPHS),
  ...Object.values(NON_MAC_MODIFIER_GLYPHS),
]);

// ============================================================================
// Platform detection
// ============================================================================

function detectIsMac(): boolean {
  if (typeof navigator === "undefined") return true; // SSR — default to Mac glyphs
  const ua = navigator.userAgent || "";
  // Treat iPad/iPhone/iPod as Mac (same glyph conventions).
  if (/Mac|iPad|iPhone|iPod/.test(ua)) return true;
  return false;
}

/**
 * Returns true on Mac/iOS, false on Windows/Linux. SSR-safe — defaults to
 * Mac on the server so initial HTML matches; useEffect swaps after mount.
 */
function useIsMac(): boolean {
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    setIsMac(detectIsMac());
  }, []);
  return isMac;
}

// ============================================================================
// Kbd Component
// ============================================================================

/**
 * Keyboard input component for displaying keyboard shortcuts.
 *
 * Modifier props render platform-aware glyphs: ⌘ ⇧ ⌥ ⌃ on Mac, and
 * "Ctrl" / "Shift" / "Alt" text on Windows and Linux. Platform is
 * detected client-side after mount; SSR output uses Mac glyphs so the
 * initial HTML matches, then a one-time swap occurs on hydration.
 *
 * @example
 * <Kbd meta>K</Kbd>            // ⌘K on Mac, "Ctrl K" on Windows
 * <Kbd meta shift>K</Kbd>      // ⇧⌘K on Mac, "Shift Ctrl K" on Windows
 * <Kbd meta shift />           // Modifier combo, no key
 * <Kbd>Enter</Kbd>             // Named key (no platform swap)
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
    const isMac = useIsMac();
    const MODIFIER_GLYPHS = isMac
      ? MAC_MODIFIER_GLYPHS
      : NON_MAC_MODIFIER_GLYPHS;

    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 0 0 1px var(--ds-gray-alpha-400)",
      fontWeight: 500,
      color: "hsl(var(--color-textSubtle))",
      fontFamily: "inherit",
      background: "hsl(var(--color-surface))",
      lineHeight: "normal",
      ...sizeStyle,
      ...style,
    };

    const modifierSpanStyle: React.CSSProperties = isMac
      ? { minWidth: "1em", display: "inline-block" }
      : { display: "inline-block", marginRight: "0.2em" };

    type ModifierKey = keyof typeof MAC_MODIFIER_GLYPHS;
    const renderModifier = (kind: ModifierKey) => (
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
