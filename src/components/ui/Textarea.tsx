"use client";

import React, { forwardRef, useId } from "react";

// ============================================================================
// Types
// ============================================================================

export type TextareaSize = "xSmall" | "small" | "default" | "large";

// Geist's form sizes (shared with Input): font-size + horizontal padding +
// radius. Vertical padding is a constant 10px (py-2.5) across sizes.
const SIZE_CONFIG: Record<
  TextareaSize,
  { fontSize: number; paddingX: number; borderRadius: number }
> = {
  // Geist textareas keep a constant px-3 (12px) horizontal pad across sizes
  // (only Input narrows to px-2 at xSmall); font-size and radius vary.
  xSmall: { fontSize: 12, paddingX: 12, borderRadius: 6 },
  small: { fontSize: 14, paddingX: 12, borderRadius: 6 },
  default: { fontSize: 14, paddingX: 12, borderRadius: 6 },
  large: { fontSize: 16, paddingX: 12, borderRadius: 8 },
};

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  /** Form size — controls font-size and radius (Geist xs/sm/md/lg). */
  size?: TextareaSize;
  /**
   * Visible label rendered above the field. Short Title Case noun
   * (`Description`, `Release Notes`).
   */
  label?: string;
  /**
   * Helper text rendered as a sibling paragraph below the field and
   * linked via `aria-describedby`. Sentence case, one sentence,
   * with a period. Replaced by the error message on failure.
   */
  helperText?: string;
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
// Error Icon — Geist's warning diamond (shared with Error / Note)
// ============================================================================

function ErrorIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "var(--ds-red-900)", flexShrink: 0 }}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M10.9 0a1 1 0 0 1 .7.3l4.1 4.1.07.07a1 1 0 0 1 .23.63v5.8a1 1 0 0 1-.3.7l-4.1 4.1a1 1 0 0 1-.7.3H5a1 1 0 0 1-.53-.23l-.08-.06-4.1-4.1A1 1 0 0 1 0 10.9V5.1a1 1 0 0 1 .3-.7L4.4.3A1 1 0 0 1 5 0h5.9M1.5 5.3v5.4l3.8 3.8h5.4l3.8-3.8V5.3l-3.8-3.8H5.3zM8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2m.75-1.25h-1.5v-5h1.5z"
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
      label,
      helperText,
      error = false,
      errorMessage,
      minHeight = 100,
      size = "default",
      disabled,
      className,
      placeholder,
      "aria-describedby": ariaDescribedByProp,
      ...props
    },
    ref,
  ) {
    const uid = useId();
    const sizing = SIZE_CONFIG[size];
    const helperId = helperText ? `${uid}-helper` : undefined;
    const errorId = error && errorMessage ? `${uid}-error` : undefined;

    // Compose aria-describedby: error message takes priority over
    // helper text when both are present (the visible helper is
    // replaced by the error per the BP), but expose both ids so SRs
    // can read either.
    const describedBy =
      [ariaDescribedByProp, errorId, !errorId ? helperId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <label
        className={`ds-textarea-wrapper${className ? ` ${className}` : ""}`}
        style={{
          display: "block",
          width: "100%",
        }}
      >
        {label && (
          <div
            className="ds-textarea-label"
            style={{
              fontSize: 13,
              lineHeight: "20px",
              color: "hsl(var(--color-textSubtle))",
              marginBottom: 8,
            }}
          >
            {label}
          </div>
        )}

        <div
          className={`ds-textarea-container${error ? " ds-textarea--error" : ""}${disabled ? " ds-textarea--disabled" : ""}`}
          style={{
            borderRadius: sizing.borderRadius,
            background: "hsl(var(--color-surface))",
            transition: "box-shadow 0.15s ease",
            overflow: "hidden",
            // Geist disabled stays full-opacity (gray-100 fill + gray-700 text);
            // a container opacity here would fade the field the globals can't undo.
            ...(disabled ? { cursor: "not-allowed" } : {}),
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
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            className="ds-textarea-field"
            style={{
              display: "block",
              width: "100%",
              minHeight,
              border: "none",
              outline: "none",
              background: disabled
                ? "var(--ds-gray-100)"
                : "hsl(var(--color-surface))",
              fontSize: sizing.fontSize,
              lineHeight: "20px",
              color: disabled ? "hsl(var(--color-textSubtler))" : "hsl(var(--color-textDefault))",
              fontFamily: "inherit",
              // Geist: py-2.5 (10px) constant, px = size horizontal padding.
              padding: `10px ${sizing.paddingX}px`,
              resize: "none",
              borderRadius: 0,
              ...(disabled ? { cursor: "not-allowed" } : {}),
            }}
            {...props}
          />
        </div>

        {/* Error message — replaces helper text on failure. Geist sizes the
            message with the field: large is 16/24, the rest 13/20. Items align
            to the top so the icon sits with the first line. */}
        {error && errorMessage && (
          <div
            id={errorId}
            className="ds-textarea-error"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
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

        {/* Helper text — hidden when error is shown */}
        {helperText && !(error && errorMessage) && (
          <p
            id={helperId}
            className="ds-textarea-helper"
            style={{
              margin: 0,
              marginTop: 8,
              fontSize: 13,
              lineHeight: "20px",
              color: "hsl(var(--color-textSubtle))",
            }}
          >
            {helperText}
          </p>
        )}
      </label>
    );
  },
);
