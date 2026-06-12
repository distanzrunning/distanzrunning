"use client";

import React, { forwardRef, useId } from "react";

// ============================================================================
// Types
// ============================================================================

export type InputSize = "xSmall" | "small" | "default" | "large";

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
  /** Pill shape — fully-rounded container (Geist's rounded prefix/suffix). */
  rounded?: boolean;
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
  xSmall: { height: 24, fontSize: 12, iconSize: 12, paddingX: 8, borderRadius: 6 },
  small: { height: 32, fontSize: 14, iconSize: 16, paddingX: 12, borderRadius: 6 },
  default: { height: 40, fontSize: 14, iconSize: 16, paddingX: 12, borderRadius: 6 },
  large: { height: 48, fontSize: 16, iconSize: 24, paddingX: 12, borderRadius: 8 },
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
        fill="currentColor"
        d="M10.9 0a1 1 0 0 1 .7.3l4.1 4.1.07.07a1 1 0 0 1 .23.63v5.8a1 1 0 0 1-.3.7l-4.1 4.1a1 1 0 0 1-.7.3H5a1 1 0 0 1-.53-.23l-.08-.06-4.1-4.1A1 1 0 0 1 0 10.9V5.1a1 1 0 0 1 .3-.7L4.4.3A1 1 0 0 1 5 0h5.9M1.5 5.3v5.4l3.8 3.8h5.4l3.8-3.8V5.3l-3.8-3.8H5.3zM8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2m.75-1.25h-1.5v-5h1.5z"
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
    rounded = false,
    disabled,
    className,
    id: idProp,
    "aria-describedby": ariaDescribedByProp,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = idProp || generatedId;
  const config = sizeConfigs[size];
  const hasPrefix = prefix !== undefined;
  const hasSuffix = suffix !== undefined;
  const errorMessageId =
    error && errorMessage ? `${inputId}-error` : undefined;
  const ariaDescribedBy =
    [ariaDescribedByProp, errorMessageId].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="ds-input-wrapper">
      {label && (
        <label
          htmlFor={inputId}
          className="ds-input-label"
          style={{
            display: "block",
            fontSize: 13,
            maxWidth: "100%",
            color: "hsl(var(--color-textSubtle))",
            textTransform: "capitalize",
            marginBottom: 8,
            cursor: "text",
          }}
        >
          {label}
        </label>
      )}
      <div
        className={`ds-input-container${error ? " ds-input--error" : ""}${disabled ? " ds-input--disabled" : ""}${className ? ` ${className}` : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          height: config.height,
          maxWidth: "100%",
          borderRadius: rounded ? 9999 : config.borderRadius,
          background: "hsl(var(--color-surface))",
          transition: "box-shadow 0.15s ease",
          overflow: "hidden",
          fontSize: config.fontSize,
          ...(disabled ? { cursor: "not-allowed" } : {}),
        }}
      >
        {/* Prefix */}
        {hasPrefix && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: `0 ${config.paddingX}px`,
              height: "100%",
              color: "var(--ds-gray-700)",
              fontSize: config.fontSize,
              lineHeight: "20px",
              whiteSpace: "nowrap",
              flexShrink: 0,
              order: 0,
              position: "relative",
              cursor: "default",
              transition: "color 0.15s ease",
              ...(prefixStyling
                ? { background: "hsl(var(--color-canvas))" }
                : { marginRight: -config.paddingX, ...(disabled ? { background: "var(--ds-gray-100)" } : {}) }),
              ...(disabled ? { cursor: "not-allowed", color: "hsl(var(--color-textSubtler))" } : {}),
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
          aria-invalid={error || undefined}
          aria-describedby={ariaDescribedBy}
          className="ds-input-field"
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            background: disabled ? "var(--ds-gray-100)" : "hsl(var(--color-surface))",
            fontSize: config.fontSize,
            lineHeight: "20px",
            color: disabled ? "hsl(var(--color-textSubtler))" : "hsl(var(--color-textDefault))",
            fontFamily: "inherit",
            paddingLeft: config.paddingX,
            paddingRight: config.paddingX,
            minWidth: 0,
            order: 1,
            borderRadius: 0,
            ...(hasPrefix && prefixStyling
              ? { borderLeft: "1px solid var(--ds-gray-alpha-400)" }
              : {}),
            ...(hasSuffix && suffixStyling
              ? { borderRight: "1px solid var(--ds-gray-alpha-400)" }
              : {}),
          }}
          {...props}
        />

        {/* Suffix */}
        {hasSuffix && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: `0 ${config.paddingX}px`,
              height: "100%",
              color: "var(--ds-gray-700)",
              fontSize: config.fontSize,
              lineHeight: "20px",
              whiteSpace: "nowrap",
              flexShrink: 0,
              order: 2,
              position: "relative",
              cursor: "default",
              transition: "color 0.15s ease",
              ...(suffixStyling
                ? { background: "hsl(var(--color-canvas))" }
                : { marginLeft: -config.paddingX, ...(disabled ? { background: "var(--ds-gray-100)" } : {}) }),
              ...(disabled ? { cursor: "not-allowed", color: "hsl(var(--color-textSubtler))" } : {}),
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && errorMessage && (
        <div
          id={errorMessageId}
          className="ds-input-error"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
            fontSize: size === "large" ? 16 : 13,
            lineHeight: size === "large" ? "24px" : "20px",
            color: "var(--ds-red-900)",
          }}
        >
          <ErrorIcon />
          <span>{errorMessage}</span>
        </div>
      )}

    </div>
  );
});
