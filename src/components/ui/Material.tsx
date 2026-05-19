"use client";

import React, { forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

/** Material elevation types */
export type MaterialType =
  | "base"
  | "small"
  | "medium"
  | "large"
  | "tooltip"
  | "menu"
  | "modal"
  | "fullscreen";

/** Props for the Material component */
export interface MaterialProps {
  /** Shadow elevation type */
  type?: MaterialType;
  /** Content to render inside the material surface */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Shadow + Radius maps (per the foundations page)
// ============================================================================

const shadowMap: Record<MaterialType, string> = {
  base: "var(--ds-shadow-border-base)",
  small: "var(--ds-shadow-border-base), var(--ds-shadow-small)",
  medium: "var(--ds-shadow-border-base), var(--ds-shadow-medium)",
  large: "var(--ds-shadow-border-base), var(--ds-shadow-large)",
  tooltip: "var(--ds-shadow-tooltip)",
  menu: "var(--ds-shadow-menu)",
  modal: "var(--ds-shadow-modal)",
  fullscreen: "var(--ds-shadow-fullscreen)",
};

// Radii follow the Materials foundations table — see CLAUDE.md.
// 6px for everyday surfaces and tooltips, 12px for raised surfaces,
// menus and modals, 16px for fullscreen overlays.
const radiusMap: Record<MaterialType, number> = {
  base: 6,
  small: 6,
  medium: 12,
  large: 12,
  tooltip: 6,
  menu: 12,
  modal: 12,
  fullscreen: 16,
};

// ============================================================================
// Material Component
// ============================================================================

/**
 * Material surface component with shadow elevation levels.
 *
 * @example
 * <Material type="medium">
 *   <div>Card content</div>
 * </Material>
 */
export const Material = forwardRef<HTMLDivElement, MaterialProps>(
  ({ type = "base", children, className = "", style }, ref) => {
    const baseStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      background: "var(--ds-background-100)",
      borderRadius: radiusMap[type],
      overflow: "hidden",
      boxShadow: shadowMap[type],
      ...style,
    };

    return (
      <div ref={ref} className={className} style={baseStyle}>
        {children}
      </div>
    );
  },
);

Material.displayName = "Material";

export default Material;
