"use client";

import React, { useState, useCallback } from "react";
import { Monitor, Sun, Moon } from "lucide-react";

type ThemeValue = "system" | "light" | "dark";

interface ThemeSwitcherProps {
  value?: ThemeValue;
  defaultValue?: ThemeValue;
  onChange?: (value: ThemeValue) => void;
  disabled?: boolean;
  /** Hide the system option, show only light/dark */
  showSystem?: boolean;
  className?: string;
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
  className,
}: ThemeSwitcherProps) {
  const [internalValue, setInternalValue] = useState<ThemeValue>(defaultValue);
  const selected = value !== undefined ? value : internalValue;

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
        padding: 2,
        borderRadius: 8,
        background: "var(--ds-gray-100)",
        border: "none",
        margin: 0,
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
        const id = `theme-switcher-${option.value}`;

        return (
          <span key={option.value}>
            <input
              type="radio"
              id={id}
              name="theme-switcher"
              value={option.value}
              checked={isSelected}
              disabled={disabled}
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
            <label
              htmlFor={id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 6,
                cursor: disabled ? "not-allowed" : "pointer",
                background: isSelected
                  ? "var(--ds-background-100)"
                  : "transparent",
                boxShadow: isSelected
                  ? "rgba(0,0,0,0.06) 0px 2px 4px, rgba(0,0,0,0.04) 0px 0px 0px 1px"
                  : "none",
                color: disabled
                  ? "var(--ds-gray-600)"
                  : isSelected
                    ? "var(--ds-gray-1000)"
                    : "var(--ds-gray-800)",
                transition: "background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease",
              }}
            >
              <Icon size={16} />
            </label>
          </span>
        );
      })}
    </fieldset>
  );
}
