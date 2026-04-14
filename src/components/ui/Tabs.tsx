"use client";

import React, { useState, useCallback } from "react";

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: "default" | "secondary";
  disabled?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  variant = "default",
  disabled = false,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue || tabs[0]?.value || ""
  );

  const selectedValue = value !== undefined ? value : internalValue;

  const handleTabClick = useCallback(
    (tabValue: string) => {
      if (value === undefined) {
        setInternalValue(tabValue);
      }
      onChange?.(tabValue);
    },
    [value, onChange]
  );

  const isSecondary = variant === "secondary";

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "baseline",
    overflowX: "auto",
    columnGap: isSecondary ? 8 : 24,
    height: isSecondary ? 24 : 48,
    paddingBottom: 1,
    scrollbarWidth: "none",
    ...(!isSecondary
      ? { boxShadow: "rgb(234, 234, 234) 0px -1px 0px 0px inset" }
      : { boxShadow: "none" }),
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      style={containerStyle}
      className={className}
    >
      {tabs.map((tab) => {
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
              outline: "none",
              whiteSpace: "nowrap",
              cursor: isDisabled ? "not-allowed" : "pointer",
              pointerEvents: isDisabled ? "none" : "auto",
              color: isDisabled
                ? "var(--ds-gray-900)"
                : isSelected
                  ? "var(--ds-contrast-fg)"
                  : "var(--ds-gray-1000)",
              backgroundColor: isDisabled
                ? "var(--ds-gray-200)"
                : isSelected
                  ? "var(--ds-gray-1000)"
                  : "rgba(0, 0, 0, 0.082)",
            }
          : {
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "14px 2px",
              fontSize: 14,
              fontWeight: 400,
              color: isDisabled
                ? "var(--ds-gray-600)"
                : isSelected
                  ? "var(--ds-gray-1000)"
                  : "var(--ds-gray-900)",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: isSelected
                ? "2px solid var(--ds-gray-1000)"
                : "2px solid transparent",
              cursor: isDisabled ? "not-allowed" : "pointer",
              pointerEvents: isDisabled ? "none" : "auto",
              whiteSpace: "nowrap",
              height: 48,
              marginBottom: -1,
              outline: "none",
            };

        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={isSelected}
            disabled={isDisabled}
            onClick={() => handleTabClick(tab.value)}
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
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
