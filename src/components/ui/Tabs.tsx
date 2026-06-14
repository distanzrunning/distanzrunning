"use client";

import React, { useState, useCallback, useRef } from "react";
import { Tooltip } from "@/components/ui/Tooltip";

export interface TabItem {
  value: string;
  /**
   * Tab label. Title Case, 1–2 words, names the destination noun
   * (`Overview`, `Logs`, `Settings`). Verbs belong on buttons.
   */
  title: string;
  icon?: React.ReactNode;
  /**
   * Sentence case explanation of why the tab is disabled, e.g.
   * `Only visible to project owners.`. Rendered as a Tooltip on
   * disabled tabs.
   */
  tooltip?: string;
  /**
   * Optional badge node (count chip, status dot). Rendered after the
   * title — drop it at zero rather than showing a `0` chip.
   */
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: "default" | "secondary";
  disabled?: boolean;
  /**
   * Accessible name for the tablist when no visible heading sits
   * above it (`aria-label="Sections"`).
   */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
}

// Tab focus ring, hover, and the scroll/scrollbar behaviour live in globals.css
// (.ds-tabs-list / .ds-tabs-tab) — not runtime-injected, which served stale CSS.

export function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  variant = "default",
  disabled = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue || tabs[0]?.value || "",
  );
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedValue = value !== undefined ? value : internalValue;

  const handleTabClick = useCallback(
    (tabValue: string) => {
      if (value === undefined) {
        setInternalValue(tabValue);
      }
      onChange?.(tabValue);
    },
    [value, onChange],
  );

  // ARIA tabs keyboard pattern: Arrow keys move focus + activate
  // (automatic activation). Home/End jump to first/last. Disabled
  // tabs are skipped.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
      const isHorizontalNav = e.key === "ArrowLeft" || e.key === "ArrowRight";
      const isJump = e.key === "Home" || e.key === "End";
      if (!isHorizontalNav && !isJump) return;
      e.preventDefault();

      const enabledIndices = tabs
        .map((t, i) => ({ t, i }))
        .filter(({ t }) => !disabled && !t.disabled)
        .map(({ i }) => i);
      if (enabledIndices.length === 0) return;

      let nextIdx: number;
      if (e.key === "Home") {
        nextIdx = enabledIndices[0];
      } else if (e.key === "End") {
        nextIdx = enabledIndices[enabledIndices.length - 1];
      } else {
        const direction = e.key === "ArrowRight" ? 1 : -1;
        const currentPos = enabledIndices.indexOf(currentIdx);
        // Wrap around so arrow keys cycle through enabled tabs.
        const nextPos =
          (currentPos + direction + enabledIndices.length) %
          enabledIndices.length;
        nextIdx = enabledIndices[nextPos];
      }

      const nextTab = tabs[nextIdx];
      tabRefs.current[nextIdx]?.focus();
      handleTabClick(nextTab.value);
    },
    [tabs, disabled, handleTabClick],
  );

  const isSecondary = variant === "secondary";

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "nowrap",
    // Geist: items-center (not baseline) so icons + labels align.
    alignItems: "center",
    columnGap: isSecondary ? 8 : 24,
    height: isSecondary ? 24 : 48,
    paddingBottom: 1,
    // Primary track is the faint accents-2 baseline (our gray-200), with the
    // selected tab's gray-1000 underline riding over it; secondary has none.
    ...(!isSecondary
      ? { boxShadow: "var(--ds-gray-200) 0px -1px 0px 0px inset" }
      : { boxShadow: "none" }),
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      style={containerStyle}
      className={["ds-tabs-list", className].filter(Boolean).join(" ")}
    >
      {tabs.map((tab, idx) => {
        const isSelected = selectedValue === tab.value;
        const isDisabled = disabled || tab.disabled;

        const buttonStyle: React.CSSProperties = isSecondary
          ? {
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 6px",
              fontSize: 13,
              fontWeight: 400,
              border: "none",
              borderRadius: 6,
              height: 24,
              marginBottom: -1,
              whiteSpace: "nowrap",
              cursor: isDisabled ? "not-allowed" : "pointer",
              // Geist secondary disabled = gray-900 (not the gray-500 disabled tone).
              color: isDisabled
                ? "var(--ds-gray-900)"
                : isSelected
                  ? "hsl(var(--color-textInverted))"
                  : "hsl(var(--color-textDefault))",
              backgroundColor: isDisabled
                ? "var(--ds-gray-200)"
                : isSelected
                  ? "var(--ds-gray-1000)"
                  : "var(--ds-gray-alpha-200)",
            }
          : {
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "14px 2px",
              fontSize: 14,
              fontWeight: 400,
              // Disabled inherits the same color/hover as enabled
              // (default variant) — the only differences are the
              // not-allowed cursor and click being blocked.
              color: isSelected ? "var(--ds-gray-1000)" : "var(--ds-gray-900)",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: isSelected
                ? "2px solid var(--ds-gray-1000)"
                : "2px solid transparent",
              cursor: isDisabled ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              height: 48,
              marginBottom: -1,
              transition: "color 0.15s ease, border-color 0.15s ease",
            };

        const button = (
          <button
            key={tab.value}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            className="ds-tabs-tab"
            data-variant={variant}
            role="tab"
            type="button"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={isDisabled}
            onClick={() => handleTabClick(tab.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            style={buttonStyle}
          >
            {tab.icon && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {tab.icon}
              </span>
            )}
            {tab.title}
            {tab.badge && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginLeft: 4,
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );

        // Wrap disabled tabs in a Tooltip when a tooltip is provided
        // so screen-reader and sighted users see the constraint.
        if (tab.tooltip) {
          return (
            <Tooltip key={tab.value} content={tab.tooltip} side="top">
              {button}
            </Tooltip>
          );
        }

        return button;
      })}
    </div>
  );
}
