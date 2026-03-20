"use client";

import React, { forwardRef, useId } from "react";

// ============================================================================
// Types
// ============================================================================

export type InputSize = "small" | "default" | "large";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** Size variant */
  size?: InputSize;
  /** Content to render before the input */
  prefix?: React.ReactNode;
  /** Content to render after the input */
  suffix?: React.ReactNode;
  /** Whether to add a bordered section for the prefix (default true) */
  prefixStyling?: boolean;
  /** Whether to add a bordered section for the suffix (default true) */
  suffixStyling?: boolean;
  /** Whether the input is in an error state */
  error?: boolean;
  /** Error message to display below the input */
  errorMessage?: string;
  /** Label text above the input */
  label?: string;
}

// ============================================================================
// Size configs
// ============================================================================

interface SizeConfig {
  height: number;
  fontSize: number;
  iconSize: number;
  paddingX: number;
  borderRadius: number;
}

const sizeConfigs: Record<InputSize, SizeConfig> = {
  small: { height: 32, fontSize: 14, iconSize: 16, paddingX: 10, borderRadius: 6 },
  default: { height: 40, fontSize: 14, iconSize: 16, paddingX: 12, borderRadius: 6 },
  large: { height: 48, fontSize: 16, iconSize: 24, paddingX: 14, borderRadius: 6 },
};

// ============================================================================
// Error Icon
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
        d="M5.30761 1.5L1.5 5.30761V10.6924L5.30761 14.5H10.6924L14.5 10.6924V5.30761L10.6924 1.5H5.30761ZM4.60051 0L0 4.60051V11.3995L4.60051 16H11.3995L16 11.3995V4.60051L11.3995 0H4.60051ZM8.75 3.75V4.5V8V8.75H7.25V8V4.5V3.75H8.75ZM8 12C8.55228 12 9 11.5523 9 11C9 10.4477 8.55228 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ============================================================================
// Input Component
// ============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = "default",
    prefix,
    suffix,
    prefixStyling = true,
    suffixStyling = true,
    error = false,
    errorMessage,
    label,
    disabled,
    className,
    id: idProp,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = idProp || generatedId;
  const config = sizeConfigs[size];

  const hasPrefix = prefix !== undefined;
  const hasSuffix = suffix !== undefined;

  const containerClass = [
    "ds-input-container",
    `ds-input-container--${size}`,
    error ? "ds-input-container--error" : "",
    disabled ? "ds-input-container--disabled" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="ds-input-wrapper">
      {label && (
        <label
          htmlFor={inputId}
          className="ds-input-label"
          style={{
            display: "block",
            fontSize: 14,
            lineHeight: "20px",
            fontWeight: 500,
            color: "var(--ds-gray-1000)",
            marginBottom: 8,
          }}
        >
          {label}
        </label>
      )}
      <div
        className={containerClass}
        style={{
          display: "flex",
          alignItems: "center",
          height: config.height,
          borderRadius: config.borderRadius,
          background: "var(--ds-background-100)",
          transition: "box-shadow 0.15s ease, border-color 0.15s ease",
        }}
      >
        {/* Prefix */}
        {hasPrefix && prefixStyling && (
          <span
            className="ds-input-prefix"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: `0 ${config.paddingX}px`,
              height: "100%",
              color: "var(--ds-gray-900)",
              fontSize: config.fontSize,
              lineHeight: "20px",
              whiteSpace: "nowrap",
              borderRight: "1px solid var(--ds-gray-alpha-400)",
              flexShrink: 0,
            }}
          >
            {prefix}
          </span>
        )}
        {hasPrefix && !prefixStyling && (
          <span
            className="ds-input-prefix-nostyle"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: config.paddingX,
              color: "var(--ds-gray-900)",
              flexShrink: 0,
            }}
          >
            {prefix}
          </span>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className="ds-input-field"
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: config.fontSize,
            lineHeight: "20px",
            color: "var(--ds-gray-1000)",
            fontFamily: "inherit",
            paddingLeft: hasPrefix && !prefixStyling ? 8 : hasPrefix && prefixStyling ? config.paddingX : config.paddingX,
            paddingRight: hasSuffix && !suffixStyling ? 8 : hasSuffix && suffixStyling ? config.paddingX : config.paddingX,
            minWidth: 0,
          }}
          {...props}
        />

        {/* Suffix */}
        {hasSuffix && suffixStyling && (
          <span
            className="ds-input-suffix"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: `0 ${config.paddingX}px`,
              height: "100%",
              color: "var(--ds-gray-900)",
              fontSize: config.fontSize,
              lineHeight: "20px",
              whiteSpace: "nowrap",
              borderLeft: "1px solid var(--ds-gray-alpha-400)",
              flexShrink: 0,
            }}
          >
            {suffix}
          </span>
        )}
        {hasSuffix && !suffixStyling && (
          <span
            className="ds-input-suffix-nostyle"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingRight: config.paddingX,
              color: "var(--ds-gray-900)",
              flexShrink: 0,
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && errorMessage && (
        <div
          className="ds-input-error"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
            fontSize: 13,
            lineHeight: "20px",
            color: "var(--ds-red-900)",
          }}
        >
          <ErrorIcon />
          <span>{errorMessage}</span>
        </div>
      )}

      <style>{`
        .ds-input-container {
          box-shadow: 0 0 0 1px var(--ds-gray-alpha-400);
        }
        .ds-input-container:focus-within:not(.ds-input-container--error) {
          box-shadow: 0 0 0 1px var(--ds-gray-alpha-600), 0px 0px 0px 4px #00000029 !important;
        }
        .ds-input-container--error {
          box-shadow: 0 0 0 1px var(--ds-red-900) !important;
        }
        .ds-input-container--error:focus-within {
          box-shadow: 0 0 0 1px var(--ds-red-900), 0 0 0 4px var(--ds-red-200) !important;
        }
        .ds-input-container--disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
        .ds-input-field::placeholder {
          color: var(--ds-gray-700);
        }
        .ds-input-field:disabled {
          cursor: not-allowed;
          color: var(--ds-gray-700);
        }
      `}</style>
    </div>
  );
});
