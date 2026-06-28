"use client";

import React, { useState, useRef, useEffect } from "react";

// ============================================================================
// Types
// ============================================================================

interface SplitButtonMenuItem {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface SplitButtonProps {
  /** Primary button label */
  children: React.ReactNode;
  /** Primary button click handler */
  onClick?: () => void;
  /**
   * Primary button variant. Restricted to non-destructive variants
   * on purpose — hiding a delete inside a dropdown is a sharp edge.
   */
  variant?: "default" | "secondary";
  /** Button size */
  size?: "small" | "medium" | "large";
  /** Dropdown menu items */
  menuItems: SplitButtonMenuItem[];
  /**
   * Menu alignment relative to the trigger. Default `bottom-start`
   * places the menu under the primary button. Switch to `bottom-end`
   * only when the button sits flush with the right edge of its
   * container.
   */
  menuAlignment?: "bottom-start" | "bottom-end";
  /**
   * Accessible name for the dropdown trigger, e.g.
   * `More deploy options`. Becomes the `aria-label` on the chevron
   * button — the only label a screen reader hears for it.
   */
  menuButtonLabel?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Size / Variant Helpers
// ============================================================================

const sizeStyles: Record<
  "small" | "medium" | "large",
  {
    height: number;
    fontSize: number;
    lineHeight: string;
    padding: number;
    radius: number;
  }
> = {
  small: {
    height: 32,
    fontSize: 14,
    lineHeight: "20px",
    padding: 6,
    radius: 6,
  },
  medium: {
    height: 40,
    fontSize: 14,
    lineHeight: "20px",
    padding: 10,
    radius: 6,
  },
  large: {
    height: 48,
    fontSize: 16,
    lineHeight: "24px",
    padding: 14,
    radius: 8,
  },
};

// ============================================================================
// Chevron SVG
// ============================================================================

function ChevronDownIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m14.06 5.5-.53.53-4.82 4.82a1 1 0 0 1-1.42 0L2.47 6.03l-.53-.53L3 4.44l.53.53L8 9.44l4.47-4.47.53-.53z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// SplitButton Component
// ============================================================================

export function SplitButton({
  children,
  onClick,
  variant = "default",
  size = "medium",
  menuItems,
  menuAlignment = "bottom-start",
  menuButtonLabel = "Toggle menu",
  className = "",
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const s = sizeStyles[size];
  const isDefault = variant === "default";

  // Shared button base styles
  const baseButton: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: s.height,
    fontSize: s.fontSize,
    fontWeight: 500,
    cursor: "pointer",
    transition:
      "border-color 0.15s ease, background 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease",
    outline: "none",
    lineHeight: s.lineHeight,
    userSelect: "none",
    position: "relative",
    zIndex: 1,
  };

  // Variant-specific colors
  const bgColor = isDefault
    ? "hsl(var(--color-textDefault))"
    : "hsl(var(--color-surface))";
  const textColor = isDefault
    ? "hsl(var(--color-textInverted))"
    : "hsl(var(--color-textDefault))";
  // Geist: !border-gray-400 on both halves.
  const borderOuterColor = "var(--ds-gray-400)";

  // Primary button styles
  const primaryStyle: React.CSSProperties = {
    ...baseButton,
    paddingLeft: s.padding,
    paddingRight: s.padding,
    backgroundColor: bgColor,
    color: textColor,
    borderTopLeftRadius: s.radius,
    borderBottomLeftRadius: s.radius,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    border: `1px solid ${borderOuterColor}`,
    borderRight: "none",
    boxShadow: "none",
  };

  // Trigger button styles
  const triggerStyle: React.CSSProperties = {
    ...baseButton,
    paddingLeft: s.padding,
    paddingRight: s.padding,
    backgroundColor: bgColor,
    color: textColor,
    borderTopRightRadius: s.radius,
    borderBottomRightRadius: s.radius,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: `1px solid ${borderOuterColor}`,
    borderLeft: "none",
    boxShadow: "none",
  };

  // Divider colour is theme-aware for the filled default (#404040 light /
  // #cdcdcd dark) and gray-300 for secondary — see globals .ds-splitbtn-divider.
  const dividerClass = isDefault
    ? "ds-splitbtn-divider ds-splitbtn-divider--default"
    : "ds-splitbtn-divider ds-splitbtn-divider--secondary";

  // Menu styles
  const menuStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 4px)",
    ...(menuAlignment === "bottom-end" ? { right: 0 } : { left: 0 }),
    width: 264,
    background: "hsl(var(--color-surface))",
    borderRadius: 12,
    boxShadow:
      "var(--ds-shadow-menu), hsl(var(--color-canvas)) 0px 0px 0px 1px",
    padding: 8,
    zIndex: 2001,
    listStyle: "none",
    overflowY: "auto",
    overflowX: "hidden",
    fontSize: 14,
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", display: "inline-flex" }}
    >
      {/* Primary action button */}
      <button
        type="button"
        className="ds-splitbtn-btn"
        style={primaryStyle}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDefault
            ? "color-mix(in srgb, var(--ds-gray-1000), white 15%)"
            : "var(--ds-gray-100)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = bgColor;
        }}
      >
        <span
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: "0 6px",
          }}
        >
          {children}
        </span>
      </button>

      {/* Divider */}
      <div className={dividerClass} />

      {/* Dropdown trigger button */}
      <button
        type="button"
        className="ds-splitbtn-btn"
        style={triggerStyle}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={menuButtonLabel}
        aria-expanded={open}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDefault
            ? "color-mix(in srgb, var(--ds-gray-1000), white 15%)"
            : "var(--ds-gray-100)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = bgColor;
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 16,
            padding: "0 6px",
          }}
        >
          <ChevronDownIcon />
        </span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul role="menu" style={menuStyle}>
          {menuItems.map((item) => (
            <li
              key={item.label}
              role="menuitem"
              tabIndex={-1}
              style={{
                display: "flex",
                alignItems: "center",
                padding: 8,
                borderRadius: 6,
                cursor: "pointer",
                height: "fit-content",
                listStyle: "none",
              }}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              onMouseEnter={(e) => {
                // Theme-aware hover overlay: black 5% in light, white 5% in
                // dark (the raw rgba(0,0,0,0.05) stayed black in dark mode).
                e.currentTarget.style.backgroundColor =
                  "hsla(var(--ds-gray-1000-value), 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span className="flex flex-col gap-y-1">
                <span className="flex items-center gap-x-2">
                  {item.icon && (
                    <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                  )}
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "hsl(var(--color-textDefault))",
                    }}
                  >
                    {item.label}
                  </span>
                </span>
                {item.description && (
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: "20px",
                      fontWeight: 400,
                      color: "hsl(var(--color-textSubtle))",
                    }}
                  >
                    {item.description}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SplitButton;
