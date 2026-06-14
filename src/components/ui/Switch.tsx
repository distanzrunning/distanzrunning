"use client";

import React, { useState, useId } from "react";
import { Tooltip } from "./Tooltip";

// ============================================================================
// Types
// ============================================================================

interface SwitchOption {
  value: string;
  /**
   * Visible label. Required for non-icon options. For icon-only
   * options, either `label` or `ariaLabel` must be set so screen
   * readers can announce the option — when both `icon` and `label`
   * are present the label renders visibly; when only `icon` is set
   * we render `ariaLabel` (or `label`) as an SR-only span.
   */
  label?: string;
  icon?: React.ReactNode;
  /**
   * Explicit accessible name for icon-only options. Falls back to
   * `label`, then `value`.
   */
  ariaLabel?: string;
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
    // Geist small: text-[14px] / p-[0_12px] (same type as default, shorter).
    height: 32,
    fontSize: 14,
    lineHeight: "20px",
    paddingX: 12,
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
    // Geist default icon control: p-[8px_8px] (square, not the 12px text pad).
    iconPaddingX: 8,
    iconPaddingY: 8,
  },
  large: {
    // Geist large: text-[16px] / p-[0_16px], checked pill rounded-[4px].
    height: 48,
    fontSize: 16,
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
    // Geist switch model: a raised surface container (bg-100) with a hairline
    // gray-alpha-400 ring; the SELECTED segment is the gray-100 pill (below).
    // This is the inverse of the recessed-track ThemeSwitcher, which diverges
    // deliberately.
    backgroundColor: "hsl(var(--color-surface))",
    boxShadow: "var(--ds-gray-alpha-400) 0px 0px 0px 1px",
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
              className="ds-switch-input"
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
                  ? "var(--ds-gray-800)"
                  : isSelected
                    ? "var(--ds-gray-1000)"
                    : "var(--ds-gray-900)",
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
                  aria-hidden="true"
                >
                  {option.icon}
                </span>
              )}
              {hasLabel && <span>{option.label}</span>}
              {isIconOnly && (
                <span
                  // Visually hidden text so screen readers announce
                  // the option name even when only the icon is shown.
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
                >
                  {option.ariaLabel || option.label || option.value}
                </span>
              )}
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
