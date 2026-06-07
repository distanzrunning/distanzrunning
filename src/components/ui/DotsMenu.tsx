"use client";

import { type CSSProperties, type ReactNode } from "react";
import { Menu, MenuButton, MenuItem, MenuSeparator } from "./Menu";

// ============================================================================
// Types
// ============================================================================

export type DotsMenuSize = "small" | "medium" | "large";

// Geist scales the three-dot glyph, not the (32px) button.
const ICON_PX: Record<DotsMenuSize, number> = {
  small: 10,
  medium: 12,
  large: 18,
};

export interface DotsMenuProps {
  /** Menu items (DotsMenu.Item / DotsMenu.Separator). */
  children: ReactNode;
  /** Size of the three-dot glyph. Defaults to `large` (18px), like Geist. */
  size?: DotsMenuSize;
  /** Disable the trigger. */
  disabled?: boolean;
  /** Accessible name for the trigger. Defaults to "Menu". */
  "aria-label"?: string;
  /** Fixed dropdown width in px. */
  width?: number;
}

// ============================================================================
// DotsMenu — a tertiary 32px square trigger that opens a Menu dropdown
// ============================================================================

function DotsGlyph() {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        style={{ color: "currentcolor" }}
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m5.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
        />
      </svg>
    </span>
  );
}

export function DotsMenu({
  children,
  size = "large",
  disabled = false,
  "aria-label": ariaLabel = "Menu",
  width,
}: DotsMenuProps) {
  return (
    <Menu width={width}>
      <MenuButton
        variant="tertiary"
        shape="square"
        size="small"
        aria-label={ariaLabel}
        disabled={disabled}
        className={
          disabled ? "shadow-none opacity-50 cursor-not-allowed" : undefined
        }
        // The glyph sizes via --ds-icon-size (the global `button svg` rule),
        // so the inline svg width/height alone wouldn't take. small/medium/
        // large => 10/12/18px.
        style={{ "--ds-icon-size": `${ICON_PX[size]}px` } as CSSProperties}
      >
        <DotsGlyph />
      </MenuButton>
      {children}
    </Menu>
  );
}

DotsMenu.Item = MenuItem;
DotsMenu.Separator = MenuSeparator;

export default DotsMenu;
