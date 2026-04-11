"use client";

import React, { forwardRef, useId } from "react";

// ============================================================================
// Types
// ============================================================================

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Size variant */
  size?: "xsmall" | "small" | "medium" | "large";
  /** Prefix icon/element */
  prefix?: React.ReactNode;
  /** Error state */
  error?: boolean;
  /** Error message text */
  errorMessage?: string;
  /** Label text above the select */
  label?: string;
}

// ============================================================================
// Size configs
// ============================================================================

interface SizeConfig {
  height: string;
  fontSize: string;
  paddingX: string;
  paddingRight: string;
  prefixPaddingLeft: string;
}

const sizeConfigs: Record<NonNullable<SelectProps["size"]>, SizeConfig> = {
  xsmall: {
    height: "h-7",
    fontSize: "text-xs",
    paddingX: "px-2",
    paddingRight: "pr-7",
    prefixPaddingLeft: "pl-7",
  },
  small: {
    height: "h-8",
    fontSize: "text-sm",
    paddingX: "px-2.5",
    paddingRight: "pr-8",
    prefixPaddingLeft: "pl-8",
  },
  medium: {
    height: "h-10",
    fontSize: "text-sm",
    paddingX: "px-3",
    paddingRight: "pr-9",
    prefixPaddingLeft: "pl-9",
  },
  large: {
    height: "h-12",
    fontSize: "text-base",
    paddingX: "px-3.5",
    paddingRight: "pr-10",
    prefixPaddingLeft: "pl-10",
  },
};

// ============================================================================
// Error Icon (Geist octagon with exclamation)
// ============================================================================

function ErrorIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "var(--ds-red-900)", flexShrink: 0 }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.30761 1.5L1.5 5.30761L1.5 10.6924L5.30761 14.5H10.6924L14.5 10.6924V5.30761L10.6924 1.5H5.30761ZM5.10051 0C4.83529 0 4.58094 0.105357 4.3934 0.292893L0.292893 4.3934C0.105357 4.58094 0 4.83529 0 5.10051V10.8995C0 11.1647 0.105357 11.4191 0.292894 11.6066L4.3934 15.7071C4.58094 15.8946 4.83529 16 5.10051 16H10.8995C11.1647 16 11.4191 15.8946 11.6066 15.7071L15.7071 11.6066C15.8946 11.4191 16 11.1647 16 10.8995V5.10051C16 4.83529 15.8946 4.58093 15.7071 4.3934L11.6066 0.292893C11.4191 0.105357 11.1647 0 10.8995 0H5.10051ZM8.75 3.75V4.5V8L8.75 8.75H7.25V8V4.5V3.75H8.75ZM8 12C8.55229 12 9 11.5523 9 11C9 10.4477 8.55229 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Chevron Down Icon
// ============================================================================

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      className={className}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Select Component
// ============================================================================

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      size = "medium",
      prefix,
      error = false,
      errorMessage,
      label,
      disabled,
      className,
      id: idProp,
      children,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = idProp || generatedId;
    const config = sizeConfigs[size];
    const hasPrefix = prefix !== undefined;

    return (
      <div className={`w-full ${className || ""}`}>
        {/* Label */}
        {label && (
          <div
            className="text-sm font-medium capitalize mb-2"
            style={{ color: "var(--ds-gray-900)" }}
          >
            <label htmlFor={selectId}>{label}</label>
          </div>
        )}

        {/* Select container */}
        <div
          className={`relative flex items-center rounded-md transition-colors ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: error
              ? "var(--ds-red-700)"
              : "var(--ds-gray-alpha-400)",
            background: "var(--ds-background-100)",
            transition: "border-color 150ms ease",
          }}
        >
          {/* Prefix */}
          {hasPrefix && (
            <span
              className="absolute left-0 flex items-center justify-center pointer-events-none"
              style={{
                left: size === "xsmall" ? "8px" : size === "small" ? "10px" : size === "large" ? "14px" : "12px",
                color: "var(--ds-gray-900)",
              }}
            >
              {prefix}
            </span>
          )}

          {/* Native select */}
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={[
              "appearance-none w-full bg-transparent outline-none",
              config.height,
              config.fontSize,
              hasPrefix ? config.prefixPaddingLeft : config.paddingX,
              config.paddingRight,
              disabled ? "cursor-not-allowed" : "cursor-pointer",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              color: "var(--ds-gray-1000)",
            }}
            onFocus={(e) => {
              const container = e.currentTarget.parentElement;
              if (container) {
                container.style.outline = "2px solid var(--ds-focus-color)";
                container.style.outlineOffset = "-1px";
              }
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              const container = e.currentTarget.parentElement;
              if (container) {
                container.style.outline = "none";
              }
              props.onBlur?.(e);
            }}
            {...props}
          >
            {children}
          </select>

          {/* Chevron suffix */}
          <span
            className="absolute right-0 flex items-center justify-center pointer-events-none"
            style={{
              right: size === "xsmall" ? "8px" : size === "small" ? "10px" : size === "large" ? "14px" : "12px",
              color: "var(--ds-gray-900)",
            }}
          >
            <ChevronDownIcon />
          </span>
        </div>

        {/* Error message */}
        {error && errorMessage && (
          <div
            className="flex items-center gap-1.5 mt-2"
            style={{ color: "var(--ds-red-900)" }}
          >
            <ErrorIcon />
            <span className="text-[13px] leading-[20px]">{errorMessage}</span>
          </div>
        )}
      </div>
    );
  },
);

export default Select;
