"use client";

import React, { forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  /** Whether the textarea is in an error state */
  error?: boolean;
  /** Error message to display below the textarea */
  errorMessage?: string;
  /** Minimum height of the textarea (default 100px) */
  minHeight?: number;
  /** Additional class name */
  className?: string;
}

// ============================================================================
// Error Icon (Geist octagon warning)
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
// Textarea Component
// ============================================================================

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      error = false,
      errorMessage,
      minHeight = 100,
      disabled,
      className,
      placeholder,
      ...props
    },
    ref,
  ) {
    return (
      <label
        className={`ds-textarea-wrapper${className ? ` ${className}` : ""}`}
        style={{
          display: "block",
          width: "100%",
        }}
      >
        <div
          className={`ds-textarea-container${error ? " ds-textarea--error" : ""}${disabled ? " ds-textarea--disabled" : ""}`}
          style={{
            borderRadius: 6,
            background: "var(--ds-background-100)",
            transition: "box-shadow 0.15s ease",
            overflow: "hidden",
            ...(disabled ? { cursor: "not-allowed", opacity: 0.5 } : {}),
          }}
        >
          <textarea
            ref={ref}
            disabled={disabled}
            placeholder={placeholder}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="ds-textarea-field"
            style={{
              display: "block",
              width: "100%",
              minHeight,
              border: "none",
              outline: "none",
              background: disabled
                ? "var(--ds-gray-100)"
                : "var(--ds-background-100)",
              fontSize: 14,
              lineHeight: "20px",
              color: disabled ? "var(--ds-gray-700)" : "var(--ds-gray-1000)",
              fontFamily: "inherit",
              padding: 12,
              resize: "vertical",
              borderRadius: 0,
              ...(disabled ? { cursor: "not-allowed" } : {}),
            }}
            {...props}
          />
        </div>

        {/* Error message */}
        {error && errorMessage && (
          <div
            className="ds-textarea-error"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
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
      </label>
    );
  },
);
