"use client";

import React, { forwardRef, useId } from "react";

// ============================================================================
// Types
// ============================================================================

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "prefix"> {
  /** Size variant */
  size?: "xsmall" | "small" | "medium" | "large";
  /** Prefix icon/element */
  prefix?: React.ReactNode;
  /** Custom suffix icon/element (replaces default chevron) */
  suffix?: React.ReactNode;
  /** Error state */
  error?: boolean;
  /** Error message text */
  errorMessage?: string;
  /** Label text above the select */
  label?: string;
}

// ============================================================================
// Size configs — Geist-verbatim. Our Tailwind remaps text-xs/sm/base, so the
// font sizes are written as explicit px arbitraries to land on Geist's
// 12 / 14 / 16. Heights map to --geist-space-{small,medium,large} (32/40/48);
// xsmall is a fixed 24. Radius: xsmall 4, small/medium --geist-radius (6),
// large rounded-lg (8). max-sm bumps the font to 16px to stop iOS zoom.
// ============================================================================

interface SizeConfig {
  /** classes on the <select> */
  field: string;
  /** padding-left when a prefix is present */
  prefixField: string;
  /** chevron / suffix glyph box size */
  glyph: string;
  /** absolute position of the prefix span */
  prefixLeft: string;
  /** absolute position of the suffix span */
  suffixRight: string;
}

const sizeConfigs: Record<NonNullable<SelectProps["size"]>, SizeConfig> = {
  xsmall: {
    field:
      "h-6 text-[12px] leading-none pl-[6px] pr-7 rounded-[4px] max-sm:text-[12px]",
    prefixField: "h-6 text-[12px] leading-none pl-[26px] pr-7 rounded-[4px]",
    glyph: "h-3 w-3",
    prefixLeft: "left-[7px]",
    suffixRight: "right-[5px]",
  },
  small: {
    field: "h-8 text-[14px] px-3 pr-9 rounded-[6px] max-sm:text-[16px]",
    prefixField: "h-8 text-[14px] pl-[36px] pr-9 rounded-[6px] max-sm:text-[16px]",
    glyph: "h-4 w-4",
    prefixLeft: "left-3",
    suffixRight: "right-3",
  },
  medium: {
    field:
      "h-10 text-[14px] leading-[20px] px-3 pr-9 rounded-[6px] max-sm:text-[16px]",
    prefixField:
      "h-10 text-[14px] leading-[20px] pl-[36px] pr-9 rounded-[6px] max-sm:text-[16px]",
    glyph: "h-4 w-4",
    prefixLeft: "left-3",
    suffixRight: "right-3",
  },
  large: {
    field: "h-12 text-[16px] leading-[24px] px-3 pr-9 rounded-lg",
    prefixField: "h-12 text-[16px] leading-[24px] pl-[36px] pr-9 rounded-lg",
    glyph: "h-4 w-4",
    prefixLeft: "left-3",
    suffixRight: "right-3",
  },
};

// ============================================================================
// Error Icon (Geist's rounded-octagon "alert" glyph)
// ============================================================================

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      height="16"
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
// Chevron Down Icon (Geist v4 compact glyph)
// ============================================================================

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      height="16"
      width="16"
      className={className}
      style={{ color: "currentcolor" }}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m14.06 5.5-.53.53-4.82 4.82a1 1 0 0 1-1.42 0L2.47 6.03l-.53-.53L3 4.44l.53.53L8 9.44l4.47-4.47.53-.53z"
        clipRule="evenodd"
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
      suffix,
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
    const errorId = `${selectId}-error`;
    const isLarge = size === "large";

    return (
      <label
        htmlFor={selectId}
        className={className || "w-full"}
        style={{ display: "block" }}
      >
        {/* Label — Geist: 13px, gray-900, capitalize, mb-2, cursor-text */}
        {label && (
          <div className="mb-2 block max-w-full cursor-text text-[13px] capitalize text-[color:var(--ds-gray-900)]">
            {label}
          </div>
        )}

        {/* Select container (group drives the prefix/suffix hover colour) */}
        <div
          className={`group relative flex items-center ${
            disabled
              ? "cursor-not-allowed rounded-[6px] bg-[var(--ds-gray-100)] text-[var(--ds-gray-700)]"
              : ""
          }`}
        >
          {/* Prefix */}
          {hasPrefix && (
            <span
              className={`pointer-events-none absolute z-10 inline-flex items-center text-[var(--ds-gray-900)] transition-colors duration-150 ease-in group-hover:text-[var(--ds-gray-1000)] ${config.prefixLeft}`}
            >
              {prefix}
            </span>
          )}

          {/* Native select */}
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={error && errorMessage ? errorId : undefined}
            className={[
              "ds-select peer w-full cursor-pointer appearance-none truncate border-none",
              "bg-surface text-[var(--ds-gray-1000)]",
              "transition-[box-shadow,color] duration-200",
              hasPrefix ? config.prefixField : config.field,
              disabled ? "cursor-not-allowed" : "cursor-pointer",
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          >
            {children}
          </select>

          {/* Suffix (chevron) */}
          <span
            className={`pointer-events-none absolute inline-flex items-center text-[var(--ds-gray-900)] transition-colors duration-150 ease-in group-hover:text-[var(--ds-gray-1000)] ${config.suffixRight}`}
          >
            {suffix || <ChevronDownIcon className={config.glyph} />}
          </span>
        </div>

        {/* Error message — Geist: red-900, items-start, 13px (16px for large) */}
        {error && errorMessage && (
          <div
            id={errorId}
            role="alert"
            aria-atomic="true"
            className={`mt-2 flex items-start text-[var(--ds-red-900)] ${
              isLarge ? "text-[16px] leading-6" : "text-[13px] leading-5"
            }`}
          >
            <span
              aria-hidden="true"
              className={`mr-2 flex items-center ${isLarge ? "mt-1" : "mt-0.5"}`}
            >
              <ErrorIcon />
            </span>
            <span className="break-words">{errorMessage}</span>
          </div>
        )}
      </label>
    );
  },
);

export default Select;
