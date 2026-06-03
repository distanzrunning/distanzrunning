"use client";

import React, { useState, useCallback, useId } from "react";
import { Monitor, Sun, Moon } from "lucide-react";

type ThemeValue = "system" | "light" | "dark";

interface ThemeSwitcherProps {
  value?: ThemeValue;
  defaultValue?: ThemeValue;
  onChange?: (value: ThemeValue) => void;
  disabled?: boolean;
  /** Hide the system option, show only light/dark */
  showSystem?: boolean;
  /**
   * Size variant. `small` is for dense chrome (footers, dropdowns);
   * `default` gives the labels room to breathe (settings pages).
   */
  size?: "small" | "default";
  className?: string;
  style?: React.CSSProperties;
}

const allOptions: { value: ThemeValue; label: string; icon: typeof Monitor }[] = [
  { value: "system", label: "System theme", icon: Monitor },
  { value: "light", label: "Light theme", icon: Sun },
  { value: "dark", label: "Dark theme", icon: Moon },
];

export function ThemeSwitcher({
  value,
  defaultValue = "system",
  onChange,
  disabled = false,
  showSystem = true,
  size = "default",
  className,
  style: styleProp,
}: ThemeSwitcherProps) {
  const instanceId = useId();
  const [internalValue, setInternalValue] = useState<ThemeValue>(defaultValue);
  const selected = value !== undefined ? value : internalValue;

  const buttonSize = size === "small" ? 24 : 32;
  const iconSize = size === "small" ? 14 : 16;
  const containerPadding = size === "small" ? 1 : 2;
  const containerRadius = size === "small" ? 6 : 8;
  const optionRadius = size === "small" ? 4 : 6;

  const handleChange = useCallback(
    (newValue: ThemeValue) => {
      if (disabled) return;
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [disabled, value, onChange],
  );

  return (
    <fieldset
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "row",
        gap: 2,
        padding: containerPadding,
        borderRadius: containerRadius,
        // Track sits one grey step BELOW the selected thumb (gray-100 via
        // surfaceSubtle: #F2F2F2 light / #1A1A1A dark), so the container
        // reads on the page and the thumb can be defined by fill alone.
        // No ring/border — our switcher intentionally diverges from Geist
        // here (their bg-100/bg-200 are too close to differentiate by fill).
        background: "hsl(var(--color-surfaceSubtle))",
        border: "none",
        margin: 0,
        ...styleProp,
      }}
    >
      <legend
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
        Theme
      </legend>
      {allOptions.filter((o) => showSystem || o.value !== "system").map((option) => {
        const isSelected = selected === option.value;
        const Icon = option.icon;
        const id = `theme-switcher-${option.value}-${instanceId}`;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            id={id}
            aria-checked={isSelected}
            aria-label={option.label}
            disabled={disabled}
            onClick={() => handleChange(option.value)}
            className="ds-theme-option"
            data-disabled={disabled || undefined}
            data-selected={isSelected || undefined}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: buttonSize,
              height: buttonSize,
              padding: 0,
              border: "none",
              borderRadius: optionRadius,
              cursor: disabled ? "not-allowed" : "pointer",
              // Selected thumb is defined by BACKGROUND ALONE — one grey
              // step above the track: white in light, gray-300 (#292929) in
              // dark (via surfaceElevated2). No ring or shadow.
              background: isSelected
                ? "hsl(var(--color-surfaceElevated2))"
                : "transparent",
              boxShadow: "none",
              color: disabled
                ? "var(--ds-gray-600)"
                : isSelected
                  ? "hsl(var(--color-textDefault))"
                  : "var(--ds-gray-700)",
              transition:
                "background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease",
            }}
          >
            <Icon size={iconSize} />
          </button>
        );
      })}
    </fieldset>
  );
}
