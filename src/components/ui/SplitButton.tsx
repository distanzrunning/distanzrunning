"use client";

import React, { useState, useRef, useEffect } from "react";

// ============================================================================
// Types
// ============================================================================

interface SplitButtonMenuItem {
  label: string;
  onClick: () => void;
}

interface SplitButtonProps {
  /** Primary button label */
  children: React.ReactNode;
  /** Primary button click handler */
  onClick?: () => void;
  /** Button variant */
  variant?: "default" | "secondary";
  /** Button size */
  size?: "small" | "medium" | "large";
  /** Dropdown menu items */
  menuItems: SplitButtonMenuItem[];
  /** Menu alignment */
  menuAlign?: "start" | "end";
  /** Dropdown trigger aria-label */
  menuLabel?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Size / Variant Helpers
// ============================================================================

const sizeStyles: Record<
  "small" | "medium" | "large",
  { height: number; fontSize: number; padding: number; radius: number }
> = {
  small: { height: 32, fontSize: 14, padding: 6, radius: 6 },
  medium: { height: 40, fontSize: 14, padding: 10, radius: 6 },
  large: { height: 48, fontSize: 16, padding: 14, radius: 8 },
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
        d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
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
  menuAlign = "end",
  menuLabel = "Toggle menu",
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
    transition: "border-color 0.15s ease, background 0.15s ease, color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease",
    outline: "none",
    lineHeight: "20px",
    userSelect: "none",
    position: "relative",
    zIndex: 1,
  };

  // Variant-specific colors
  const bgColor = isDefault
    ? "var(--ds-gray-1000)"
    : "var(--ds-background-100)";
  const textColor = isDefault
    ? "var(--ds-background-100)"
    : "var(--ds-gray-1000)";
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

  const dividerColor = isDefault
    ? "var(--ds-gray-alpha-900)"
    : "var(--ds-gray-300)";

  // Divider styles
  const dividerStyle: React.CSSProperties = {
    width: "1px",
    alignSelf: "stretch",
    backgroundColor: dividerColor,
  };

  // Menu styles
  const menuStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 4px)",
    ...(menuAlign === "end" ? { right: 0 } : { left: 0 }),
    minWidth: "160px",
    background: "var(--ds-background-100)",
    border: "1px solid var(--ds-gray-alpha-400)",
    borderRadius: 6,
    boxShadow: "var(--ds-shadow-menu)",
    padding: "4px",
    zIndex: 50,
  };

  // Menu item styles
  const menuItemStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "8px 12px",
    fontSize: "14px",
    lineHeight: "20px",
    color: "var(--ds-gray-1000)",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "var(--ds-radius-xsmall)",
    cursor: "pointer",
    transition:
      "background var(--ds-transition-duration) var(--ds-transition-timing)",
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
        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 6px" }}>
          {children}
        </span>
      </button>

      {/* Divider */}
      <div style={dividerStyle} />

      {/* Dropdown trigger button */}
      <button
        type="button"
        style={triggerStyle}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={menuLabel}
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
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 16, padding: "0 6px" }}>
          <ChevronDownIcon />
        </span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div style={menuStyle}>
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              style={menuItemStyle}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--ds-gray-100)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SplitButton;
