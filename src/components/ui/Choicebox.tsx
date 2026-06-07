"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
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
  focusRing,
}: {
  checked: boolean;
  disabled: boolean;
  focusRing: boolean;
}) {
  const borderColor = disabled
    ? "hsl(var(--color-textDisabled))"
    : checked
      ? "var(--ds-blue-900)"
      : "var(--ds-gray-500)";

  const dotColor = disabled
    ? "hsl(var(--color-textDisabled))"
    : "var(--ds-blue-900)";

  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `1px solid ${borderColor}`,
        background: "hsl(var(--color-surface))",
        transition: "border-color 0.2s ease, background 0.2s ease",
        position: "relative",
        boxShadow: focusRing ? "var(--ds-focus-ring)" : undefined,
      }}
    >
      {checked && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: dotColor,
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
  /** Bold title text. Optional when `icon` + `aria-label` carry the label. */
  title?: string;
  /** Secondary description text. Optional. */
  description?: string;
  /**
   * Decorative icon shown on the left of the title block. Decorative
   * when paired with a title; if the icon is the only label, pair it
   * with `aria-label` so screen readers announce the choice.
   */
  icon?: ReactNode;
  /**
   * Accessible label for the tile — applied as `aria-label` on the
   * underlying input. Required when there's no visible `title`.
   */
  "aria-label"?: string;
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
  icon,
  "aria-label": ariaLabel,
  disabled = false,
  children,
  className = "",
}: ChoiceboxProps) {
  const ctx = useChoiceboxContext();
  const reactId = useId();
  const inputId = `choicebox-${value}-${reactId}`;

  const [isHovered, setIsHovered] = useState(false);
  // Keyboard-focus state: the focus ring shows on the radio/checkbox
  // control (like Geist's peer-focus-visible), not on the tile, and only
  // for keyboard focus — clicking selects without a ring.
  const [focusVisible, setFocusVisible] = useState(false);

  const isDisabled = disabled || ctx.groupDisabled;
  const isSelected =
    ctx.type === "single"
      ? ctx.value === value
      : (ctx.value as string[]).includes(value);

  const showHover = isHovered && !isSelected && !isDisabled;

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
        rounded-md border border-solid
        ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor:
          isSelected && !isDisabled
            ? "var(--ds-blue-600)"
            : showHover
              ? "hsl(var(--color-borderDefaultHover))"
              : "hsl(var(--color-borderDefault))",
        background: showHover
          ? "var(--ds-gray-100)"
          : "hsl(var(--color-surface))",
        transition:
          "background 0.15s ease, border 0.15s ease, box-shadow 0.15s ease",
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
        onFocus={(e) => setFocusVisible(e.target.matches(":focus-visible"))}
        onBlur={() => setFocusVisible(false)}
        aria-label={ariaLabel}
        className="sr-only peer"
      />

      {/* Option row */}
      <div
        className={`flex items-center justify-between gap-6 p-3 ${
          isSelected && children ? "rounded-t-md" : "rounded-md"
        }`}
        style={{
          background:
            isSelected && !isDisabled
              ? isHovered
                ? "var(--ds-blue-200)"
                : "var(--ds-blue-100)"
              : "transparent",
          transition: "background 0.15s ease, border 0.15s ease",
        }}
      >
        {/* Icon + text content */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {icon && (
            <span
              aria-hidden="true"
              className="flex items-center justify-center flex-shrink-0"
              style={{
                color: isDisabled
                  ? "hsl(var(--color-textDisabled))"
                  : isSelected
                    ? "var(--ds-blue-900)"
                    : "hsl(var(--color-textDefault))",
              }}
            >
              {icon}
            </span>
          )}
          {(title || description) && (
            <div className="flex flex-col gap-1 min-w-0">
              {title && (
                <span
                  className="text-copy-14 font-medium"
                  style={{
                    color: isDisabled
                      ? "hsl(var(--color-textDisabled))"
                      : isSelected
                        ? "var(--ds-blue-900)"
                        : "hsl(var(--color-textDefault))",
                  }}
                >
                  {title}
                </span>
              )}
              {description && (
                <span
                  className="text-copy-14"
                  style={{
                    color: isDisabled
                      ? "hsl(var(--color-textDisabled))"
                      : isSelected
                        ? "var(--ds-blue-900)"
                        : "hsl(var(--color-textSubtle))",
                  }}
                >
                  {description}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Indicator */}
        {ctx.type === "single" ? (
          <RadioIndicator
            checked={isSelected}
            disabled={isDisabled}
            focusRing={focusVisible}
          />
        ) : (
          <span
            style={{
              pointerEvents: "none",
              borderRadius: 4,
              boxShadow: focusVisible ? "var(--ds-focus-ring)" : undefined,
            }}
          >
            <Checkbox
              checked={isSelected}
              disabled={isDisabled}
              color={
                isSelected && !isDisabled ? "var(--ds-blue-900)" : undefined
              }
            />
          </span>
        )}
      </div>

      {/* Custom content - shown when selected */}
      {isSelected && children && (
        <div
          className="flex items-center justify-center px-3 pb-3 pt-3 rounded-b-md overflow-hidden transition-colors hover:bg-[var(--ds-gray-100)]"
          style={{
            borderTop: `1px solid ${!isDisabled ? "var(--ds-blue-600)" : "hsl(var(--color-borderDefault))"}`,
          }}
        >
          {children}
        </div>
      )}
    </label>
  );
}
