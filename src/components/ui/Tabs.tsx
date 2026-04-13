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
    overflowX: "auto",
    ...(variant === "default"
      ? { borderBottom: "1px solid var(--ds-gray-400)" }
      : {}),
  };

  return (
    <div
      role="tablist"
      style={containerStyle}
      className={className}
    >
      {tabs.map((tab) => {
        const isSelected = selectedValue === tab.value;
        const isDisabled = disabled || tab.disabled;

        const buttonStyle: React.CSSProperties = {
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 12px",
          fontSize: "14px",
          fontWeight: isSelected ? 500 : 400,
          color: isSelected
            ? "var(--ds-gray-1000)"
            : "var(--ds-gray-900)",
          background: "none",
          border: "none",
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.5 : 1,
          pointerEvents: isDisabled ? "none" : "auto",
          transition: "color 150ms ease",
          whiteSpace: "nowrap",
          position: "relative",
          ...(variant === "default"
            ? {
                marginBottom: "-1px",
                borderBottom: isSelected
                  ? "2px solid var(--ds-gray-1000)"
                  : "2px solid transparent",
              }
            : {
                borderRadius: "6px",
                background: isSelected
                  ? "var(--ds-gray-100)"
                  : "none",
              }),
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
