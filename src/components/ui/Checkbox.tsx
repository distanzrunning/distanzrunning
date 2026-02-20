"use client";

import { forwardRef, useEffect, useRef, InputHTMLAttributes } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Label text displayed next to the checkbox */
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      onChange,
      disabled,
      label,
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

    const isActive = checked || indeterminate;

    return (
      <label
        htmlFor={checkboxId}
        className={`
          group/checkbox
          inline-flex items-center gap-3
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${disabled ? "opacity-50" : ""}
          ${className}
        `}
      >
        <span className="relative inline-flex items-center justify-center">
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
              ${
                isActive
                  ? "bg-[var(--ds-gray-1000)] border-[var(--ds-gray-1000)]"
                  : "bg-[var(--ds-background-100)] border-[var(--ds-gray-700)]"
              }
              ${!disabled && !isActive ? "group-hover/checkbox:bg-[var(--ds-gray-200)]" : ""}
              ${disabled ? "" : "peer-focus-visible:shadow-[0_0_0_2px_var(--ds-background-100),0_0_0_4px_var(--ds-focus-color)]"}
            `}
            style={{
              transition: "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <svg fill="none" height="16" viewBox="0 0 20 20" width="16">
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
                  stroke="var(--ds-background-100)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              )}
            </svg>
          </span>
        </span>
        {label && (
          <span className="text-sm text-[var(--ds-gray-1000)] select-none">
            {label}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
