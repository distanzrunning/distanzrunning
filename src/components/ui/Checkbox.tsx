"use client";

import { forwardRef, useEffect, useRef, InputHTMLAttributes } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "color"> {
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Label text displayed next to the checkbox */
  label?: string;
  /** Custom color for checked state (default: --ds-gray-1000) */
  color?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      onChange,
      disabled,
      label,
      color,
      className = "",
      id,
      ...props
    },
    forwardedRef,
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);

    // Sync indeterminate property (not available as HTML attribute)
    useEffect(() => {
      const input = innerRef.current;
      if (input) {
        input.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Merge forwarded ref with inner ref
    useEffect(() => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") {
        forwardedRef(innerRef.current);
      } else {
        forwardedRef.current = innerRef.current;
      }
    }, [forwardedRef]);

    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Only checked gets the dark active background
    const isActive = checked && !indeterminate;
    // Disabled indeterminate: light box with muted dash
    const isDisabledIndeterminate = disabled && indeterminate && !checked;

    // Box background/border
    const getBoxStyles = (): React.CSSProperties | undefined => {
      if (color && isActive) {
        return { backgroundColor: color, borderColor: color };
      }
      return undefined;
    };

    const getBoxClasses = () => {
      if (disabled && checked) {
        // Geist disabled+checked fill is gray-600 (not the gray-500 disabled tone)
        return "bg-[var(--ds-gray-600)] border-[var(--ds-gray-600)]";
      }
      if (disabled) {
        return "bg-[var(--ds-gray-100)] border-textDisabled";
      }
      if (isActive && !color) {
        return "bg-textDefault border-textDefault";
      }
      if (isActive && color) {
        return "";
      }
      return "bg-surface border-textSubtler";
    };

    return (
      <label
        htmlFor={checkboxId}
        className={`
          group/checkbox
          inline-flex items-start
          text-copy-13 select-none
          ${disabled ? "cursor-not-allowed text-textDisabled" : "cursor-pointer text-textDefault"}
          ${className}
        `}
      >
        {/* p-0.5 -m-0.5 pads the box to the text line-height so it top-aligns
            cleanly with multi-line labels (Geist's items-start structure). */}
        <span className="relative flex items-center justify-center p-0.5 -m-0.5">
          <input
            ref={innerRef}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <span
            aria-hidden="true"
            className={`
              checkbox-icon
              relative flex items-center justify-center
              w-4 h-4 rounded-[4px] border border-solid
              ${getBoxClasses()}
              ${!disabled && !isActive ? "group-hover/checkbox:bg-[var(--ds-gray-200)] peer-focus-visible:bg-[var(--ds-gray-200)]" : ""}
              ${disabled ? "" : "peer-focus-visible:shadow-[0_0_0_2px_var(--ds-background-100),0_0_0_4px_var(--ds-focus-color)]"}
            `}
            style={{
              transition:
                "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
              ...getBoxStyles(),
            }}
          >
            <svg
              fill="none"
              viewBox="0 0 20 20"
              className="absolute inset-0 w-full h-full"
            >
              {/* Checkmark - visible when checked and not indeterminate */}
              {checked && !indeterminate && (
                <path
                  d="M14 7L8.5 12.5L6 10"
                  stroke="var(--ds-background-100)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              )}
              {/* Indeterminate dash - visible only when indeterminate */}
              {indeterminate && (
                <line
                  x1="5"
                  x2="15"
                  y1="10"
                  y2="10"
                  stroke={
                    isDisabledIndeterminate
                      ? "hsl(var(--color-textDisabled))"
                      : "hsl(var(--color-textSubtler))"
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              )}
            </svg>
          </span>
        </span>
        {label && <span className="ml-2">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
