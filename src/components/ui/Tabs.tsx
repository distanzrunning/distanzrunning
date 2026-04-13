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

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "baseline",
    overflowX: "auto",
    columnGap: 24,
    height: 48,
    paddingBottom: 1,
    scrollbarWidth: "none",
    ...(variant === "default"
      ? { boxShadow: "rgb(234, 234, 234) 0px -1px 0px 0px inset" }
      : {}),
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

        const buttonStyle: React.CSSProperties = {
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
          borderBottom: "2px solid transparent",
          cursor: isDisabled ? "not-allowed" : "pointer",
          pointerEvents: isDisabled ? "none" : "auto",
          whiteSpace: "nowrap",
          height: 48,
          marginBottom: -1,
          outline: "none",
          ...(variant === "default" && isSelected
            ? { borderBottomColor: "var(--ds-gray-1000)" }
            : {}),
          ...(variant === "secondary"
            ? {
                borderBottom: "none",
                borderRadius: 6,
                backgroundColor: isSelected
                  ? "var(--ds-gray-100)"
                  : "transparent",
                marginBottom: 0,
              }
            : {}),
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
