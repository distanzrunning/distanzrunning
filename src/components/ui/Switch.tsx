"use client";

import React, { useState, useId } from "react";
import { Tooltip } from "./Tooltip";

// ============================================================================
// Types
// ============================================================================

interface SwitchOption {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
}

interface SwitchProps {
  /** Available options */
  options: SwitchOption[];
  /** Currently selected value */
  value?: string;
  /** Default selected value (uncontrolled) */
  defaultValue?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Size variant */
  size?: "small" | "default" | "large";
  /** Whether to stretch to full width */
  fullWidth?: boolean;
  /** Disable the entire switch */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Name attribute for the radio group */
  name?: string;
}

// ============================================================================
// Size Config
// ============================================================================

const sizeConfig: Record<
  "small" | "default" | "large",
  {
    height: number;
    fontSize: number;
    lineHeight: string;
    paddingX: number;
    containerPadding: number;
    borderRadius: number;
    innerRadius: number;
    iconSize: number;
    iconPaddingX: number;
    iconPaddingY: number;
  }
> = {
  small: {
    height: 32,
    fontSize: 12,
    lineHeight: "16px",
    paddingX: 8,
    containerPadding: 4,
    borderRadius: 6,
    innerRadius: 2,
    iconSize: 16,
    iconPaddingX: 8,
    iconPaddingY: 4,
  },
  default: {
    height: 40,
    fontSize: 14,
    lineHeight: "20px",
    paddingX: 12,
    containerPadding: 4,
    borderRadius: 6,
    innerRadius: 2,
    iconSize: 16,
    iconPaddingX: 12,
    iconPaddingY: 8,
  },
  large: {
    height: 48,
    fontSize: 14,
    lineHeight: "20px",
    paddingX: 16,
    containerPadding: 4,
    borderRadius: 8,
    innerRadius: 4,
    iconSize: 20,
    iconPaddingX: 12,
    iconPaddingY: 12,
  },
};

// ============================================================================
// Switch Component
// ============================================================================

export function Switch({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  size = "default",
  fullWidth = false,
  disabled = false,
  className = "",
  name,
}: SwitchProps) {
  const generatedId = useId();
  const groupName = name || `switch-${generatedId}`;
  const [internalValue, setInternalValue] = useState(
    defaultValue || options[0]?.value || "",
  );

  const selectedValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (newValue: string) => {
    if (disabled) return;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const config = sizeConfig[size];

  const containerStyle: React.CSSProperties = {
    display: fullWidth ? "flex" : "inline-flex",
    alignItems: "stretch",
    padding: config.containerPadding,
    borderRadius: config.borderRadius,
    backgroundColor: "var(--ds-background-100)",
    boxShadow: "rgba(var(--ds-gray-1000-rgb), 0.1) 0px 0px 0px 1px",
    position: "relative",
    width: fullWidth ? "100%" : undefined,
    gap: 0,
  };

  return (
    <div
      className={className}
      style={containerStyle}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        const isDisabled = disabled || option.disabled;
        const hasLabel = !!option.label;
        const hasIcon = !!option.icon;
        const isIconOnly = hasIcon && !hasLabel;

        const labelElement = (
          <label
            key={option.value}
            style={{
              display: "flex",
              flex: "1 1 0%",
              alignSelf: "stretch",
              cursor: isDisabled ? "not-allowed" : "default",
            }}
          >
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={isSelected}
              disabled={isDisabled}
              onChange={() => handleChange(option.value)}
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                borderWidth: 0,
              }}
            />
            <div
              className="ds-switch-control"
              data-disabled={isDisabled || undefined}
              data-selected={isSelected || undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "1 1 0%",
                height: config.height - config.containerPadding * 2,
                paddingLeft: isIconOnly ? config.iconPaddingX : config.paddingX,
                paddingRight: isIconOnly ? config.iconPaddingX : config.paddingX,
                paddingTop: isIconOnly ? config.iconPaddingY : 0,
                paddingBottom: isIconOnly ? config.iconPaddingY : 0,
                fontSize: config.fontSize,
                lineHeight: config.lineHeight,
                fontWeight: 500,
                borderRadius: config.innerRadius,
                cursor: isDisabled ? "not-allowed" : "pointer",
                pointerEvents: isDisabled ? "none" : undefined,
                position: "relative",
                userSelect: "none",
                transition: "color 0.15s ease",
                backgroundColor: isSelected
                  ? "var(--ds-gray-100)"
                  : "transparent",
                color: isDisabled
                  ? "var(--ds-gray-600)"
                  : isSelected
                    ? "var(--ds-gray-1000)"
                    : "var(--ds-gray-800)",
                gap: isIconOnly ? 0 : 6,
                minWidth: isIconOnly ? config.height - config.containerPadding * 2 : undefined,
              }}
            >
              {hasIcon && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: config.iconSize,
                    height: config.iconSize,
                    flexShrink: 0,
                  }}
                >
                  {option.icon}
                </span>
              )}
              {hasLabel && <span>{option.label}</span>}
            </div>
          </label>
        );

        if (option.tooltip) {
          return (
            <Tooltip key={option.value} content={option.tooltip} side="top">
              {labelElement}
            </Tooltip>
          );
        }

        return labelElement;
      })}
    </div>
  );
}

export default Switch;
