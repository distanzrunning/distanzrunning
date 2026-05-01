"use client";

// src/components/ui/CollapsibleInput.tsx
//
// A search-shaped Input that collapses to a square (just the prefix
// icon visible) when not focused and the value is empty, and
// expands smoothly to its full width when focused or once the user
// has typed something.
//
// Built on the same .ds-input-container / .ds-input-field classes
// as the regular DS Input, so hover, focus-within ring, and theme
// flips come for free. The prefix is absolutely positioned at the
// left edge so it stays put across both states — only the wrapper
// width animates.

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

type Size = "small" | "default" | "large";

interface SizeConfig {
  height: number;
  fontSize: number;
  /** Reserved horizontal padding for the absolute prefix. */
  prefixGutter: number;
  /** Reserved horizontal padding for the absolute suffix. */
  suffixGutter: number;
}

const SIZE_CONFIG: Record<Size, SizeConfig> = {
  small: { height: 32, fontSize: 14, prefixGutter: 32, suffixGutter: 32 },
  default: { height: 40, fontSize: 14, prefixGutter: 36, suffixGutter: 36 },
  large: { height: 48, fontSize: 16, prefixGutter: 44, suffixGutter: 44 },
};

export interface CollapsibleInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** Icon rendered at the left edge in both states. */
  prefix: ReactNode;
  /** Element rendered in the right gutter only while expanded
   *  (e.g., a clear button when there's value). */
  expandedSuffix?: ReactNode;
  /** Width in pixels when the input is expanded. */
  expandedWidth?: number;
  size?: Size;
  /** aria-label used in the collapsed state where the placeholder
   *  isn't visible. Falls back to the regular aria-label if unset. */
  collapsedAriaLabel?: string;
}

export const CollapsibleInput = forwardRef<
  HTMLInputElement,
  CollapsibleInputProps
>(function CollapsibleInput(
  {
    prefix,
    expandedSuffix,
    expandedWidth = 260,
    size = "small",
    collapsedAriaLabel,
    value,
    onFocus,
    onBlur,
    placeholder,
    className,
    style,
    ...rest
  },
  forwardedRef,
) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => inputRef.current!, []);

  const hasValue = typeof value === "string" ? value.length > 0 : false;
  const expanded = focused || hasValue;
  const config = SIZE_CONFIG[size];

  const handleWrapperMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // While collapsed the only interactive target is the wrapper —
    // the input itself is squeezed off-screen by the prefix gutter.
    // Steal the mouse-down so the cursor doesn't try to land in
    // the invisible input area, then route focus manually.
    if (!expanded) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  const ariaLabel =
    !expanded
      ? (collapsedAriaLabel ?? (rest["aria-label"] as string | undefined))
      : (rest["aria-label"] as string | undefined);

  return (
    <div
      className={`ds-input-container relative inline-flex items-center overflow-hidden rounded-sm transition-[width] duration-200 ease-out ${
        expanded ? "" : "cursor-pointer"
      } ${className ?? ""}`}
      style={{
        width: expanded ? expandedWidth : config.height,
        height: config.height,
        background: "var(--ds-background-100)",
        ...style,
      }}
      onMouseDown={handleWrapperMouseDown}
    >
      <span
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center text-[color:var(--ds-gray-900)]"
        style={{ width: config.prefixGutter }}
        aria-hidden="true"
      >
        {prefix}
      </span>

      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={expanded ? placeholder : ""}
        aria-label={ariaLabel}
        className="ds-input-field w-full bg-transparent outline-none"
        style={{
          height: config.height,
          paddingLeft: config.prefixGutter,
          paddingRight: expanded && expandedSuffix ? config.suffixGutter : 12,
          fontSize: config.fontSize,
          lineHeight: "20px",
          color: "var(--ds-gray-1000)",
          border: "none",
          minWidth: 0,
          fontFamily: "inherit",
        }}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />

      {expanded && expandedSuffix && (
        <span className="absolute inset-y-0 right-1 flex items-center">
          {expandedSuffix}
        </span>
      )}
    </div>
  );
});

export default CollapsibleInput;
