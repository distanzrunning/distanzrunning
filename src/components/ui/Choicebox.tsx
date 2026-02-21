"use client";

import { createContext, useContext, useId, type ReactNode } from "react";
import Checkbox from "./Checkbox";

// ============================================================================
// Context
// ============================================================================

interface ChoiceboxContextValue {
  type: "single" | "multi";
  name: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  groupDisabled: boolean;
}

const ChoiceboxContext = createContext<ChoiceboxContextValue | null>(null);

function useChoiceboxContext() {
  const ctx = useContext(ChoiceboxContext);
  if (!ctx) {
    throw new Error("Choicebox must be used within a ChoiceboxGroup");
  }
  return ctx;
}

// ============================================================================
// RadioIndicator (internal)
// ============================================================================

function RadioIndicator({
  checked,
  disabled,
}: {
  checked: boolean;
  disabled: boolean;
}) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        border: `2px solid ${
          disabled
            ? "var(--ds-gray-500)"
            : checked
              ? "var(--ds-pink-700)"
              : "var(--ds-gray-600)"
        }`,
        transition: "border-color 0.15s ease",
      }}
    >
      {checked && (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: disabled ? "var(--ds-gray-500)" : "var(--ds-pink-700)",
            transition: "background-color 0.15s ease",
          }}
        />
      )}
    </span>
  );
}

// ============================================================================
// ChoiceboxGroup
// ============================================================================

export interface ChoiceboxGroupProps {
  /** Radio (single) or checkbox (multi) behavior */
  type: "single" | "multi";
  /** Form name for the input group */
  name: string;
  /** Currently selected value(s) */
  value: string | string[];
  /** Callback when selection changes */
  onChange: (value: string | string[]) => void;
  /** Disable all items in the group */
  disabled?: boolean;
  /** Accessible label for the group */
  label: string;
  children: ReactNode;
  className?: string;
}

export function ChoiceboxGroup({
  type,
  name,
  value,
  onChange,
  disabled = false,
  label,
  children,
  className = "",
}: ChoiceboxGroupProps) {
  return (
    <ChoiceboxContext.Provider
      value={{ type, name, value, onChange, groupDisabled: disabled }}
    >
      <div
        role={type === "single" ? "radiogroup" : "group"}
        aria-label={label}
        className={`flex gap-3 ${className}`}
      >
        {children}
      </div>
    </ChoiceboxContext.Provider>
  );
}

// ============================================================================
// Choicebox
// ============================================================================

export interface ChoiceboxProps {
  /** The value this option represents */
  value: string;
  /** Bold title text */
  title: string;
  /** Secondary description text */
  description: string;
  /** Disable this specific item */
  disabled?: boolean;
  /** Custom content shown when selected */
  children?: ReactNode;
  className?: string;
}

export function Choicebox({
  value,
  title,
  description,
  disabled = false,
  children,
  className = "",
}: ChoiceboxProps) {
  const ctx = useChoiceboxContext();
  const reactId = useId();
  const inputId = `choicebox-${value}-${reactId}`;

  const isDisabled = disabled || ctx.groupDisabled;
  const isSelected =
    ctx.type === "single"
      ? ctx.value === value
      : (ctx.value as string[]).includes(value);

  const handleChange = () => {
    if (isDisabled) return;
    if (ctx.type === "single") {
      ctx.onChange(value);
    } else {
      const current = ctx.value as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      ctx.onChange(next);
    }
  };

  return (
    <label
      htmlFor={inputId}
      aria-selected={isSelected}
      className={`
        flex flex-1 flex-col
        rounded-lg border border-solid
        ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${className}
      `}
      style={{
        borderColor: isSelected
          ? "var(--ds-pink-700)"
          : "var(--ds-gray-400)",
        background: "var(--ds-background-100)",
        transition: "border-color 0.2s ease",
      }}
    >
      <input
        type={ctx.type === "single" ? "radio" : "checkbox"}
        id={inputId}
        name={ctx.name}
        value={value}
        checked={isSelected}
        disabled={isDisabled}
        onChange={handleChange}
        className="sr-only peer"
      />

      {/* Option row */}
      <div className="flex items-center justify-between gap-6 px-4 py-3">
        {/* Text content */}
        <div className="flex flex-col gap-1">
          <span
            className={`text-sm font-medium ${
              isDisabled
                ? "text-[var(--ds-gray-500)]"
                : "text-[var(--ds-gray-1000)]"
            }`}
          >
            {title}
          </span>
          <span
            className={`text-sm ${
              isDisabled
                ? "text-[var(--ds-gray-500)]"
                : "text-[var(--ds-gray-900)]"
            }`}
          >
            {description}
          </span>
        </div>

        {/* Indicator */}
        {ctx.type === "single" ? (
          <RadioIndicator checked={isSelected} disabled={isDisabled} />
        ) : (
          <span style={{ pointerEvents: "none" }}>
            <Checkbox checked={isSelected} disabled={isDisabled} />
          </span>
        )}
      </div>

      {/* Custom content - shown when selected */}
      {isSelected && children && (
        <div
          className="px-4 pb-3"
          style={{
            borderTop: "1px solid var(--ds-gray-400)",
          }}
        >
          {children}
        </div>
      )}
    </label>
  );
}
