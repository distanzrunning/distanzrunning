"use client";

import {
  useCallback,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from "react";

// ============================================================================
// Glyphs — Geist's exact copy/check SVG paths (16×16, currentColor, block)
// ============================================================================

function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      height="16"
      width="16"
      className="block"
      style={{ color: "currentcolor" }}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="m15.56 4-.53.53-8.8 8.8c-.68.68-1.78.68-2.47 0l.53-.54-.53.53-2.79-2.79L.44 10 1.5 8.94l.53.53 2.8 2.8c.1.09.25.09.35 0l8.79-8.8.53-.53z"
      />
    </svg>
  );
}

function CopyGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      height="16"
      width="16"
      className="block"
      style={{ color: "currentcolor" }}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.25 2c.14 0 .25.11.25.25V3H10v-.75C10 1.28 9.22.5 8.25.5h-5.5C1.78.5 1 1.28 1 2.25v7.5c0 .97.78 1.75 1.75 1.75H4.5V10H2.75a.25.25 0 0 1-.25-.25v-7.5c0-.14.11-.25.25-.25zm5 4c.14 0 .25.11.25.25v7.5q-.02.23-.25.25h-5.5a.25.25 0 0 1-.25-.25v-7.5c0-.14.11-.25.25-.25zm0 9.5c.97 0 1.75-.78 1.75-1.75v-7.5c0-.97-.78-1.75-1.75-1.75h-5.5C6.78 4.5 6 5.28 6 6.25v7.5c0 .97.78 1.75 1.75 1.75z"
      />
    </svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "value"> {
  /** The string written to the clipboard when pressed */
  value: string;
  /** How long (ms) the copied (check) state shows before reverting. Default 2000. */
  feedbackDuration?: number;
  /** Fired after a successful copy */
  onCopy?: (value: string) => void;
}

// ============================================================================
// CopyButton
// ============================================================================

/**
 * A secondary, square (40×40) icon button that copies `value` to the
 * clipboard and crossfades from the copy glyph to a checkmark for
 * `feedbackDuration` ms. Class-for-class match of Geist's Copy Button.
 *
 * @example
 * <CopyButton value="npm i geist" />
 */
export function CopyButton({
  value,
  feedbackDuration = 2000,
  onCopy,
  "aria-label": ariaLabel = "Copy",
  className = "",
  disabled = false,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    onCopy?.(value);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), feedbackDuration);
  }, [value, feedbackDuration, onCopy]);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleCopy}
      className={[
        // Geist's data-geist-button base, square icon-only
        "relative m-0 flex max-w-full transform-gpu select-none items-center justify-center",
        "border-0 p-0 align-baseline font-medium no-underline outline-none",
        "h-[var(--ds-button-height-medium)] w-[var(--ds-button-height-medium)]",
        "cursor-pointer rounded-md text-[14px]",
        // secondary themed tokens: surface fill, gray-1000 ink, 1px gray-400 border
        "bg-surface text-textDefault shadow-[0_0_0_1px_var(--ds-gray-400)]",
        "transition-[border-color,background,color,transform,box-shadow] duration-150 ease-in-out",
        "hover:bg-[var(--ds-gray-100)] hover:text-textDefault dark:hover:bg-[var(--ds-gray-200)]",
        // Geist focus: 1px border + 2px bg gap + 4px focus colour, no transition
        "focus-visible:shadow-[0_0_0_1px_var(--ds-gray-400),0_0_0_2px_var(--ds-background-100),0_0_0_4px_var(--ds-focus-color)] focus-visible:transition-none",
        "[&_svg]:shrink-0",
        "disabled:cursor-not-allowed disabled:bg-[var(--ds-gray-100)] disabled:text-textSubtler",
        className,
      ].join(" ")}
      {...props}
    >
      {/* Geist inner markup verbatim: px-1.5 wrapper › relative 16px box ›
         two absolute glyphs crossfading (200ms ease-in-out, scale 50 → 100) */}
      <span className="inline-flex shrink-0 items-center justify-center px-1.5">
        <span className="relative block h-4 w-4">
          <span
            className={`absolute inset-0 transition-all duration-200 ease-in-out ${
              copied ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <CheckGlyph />
          </span>
          <span
            className={`absolute inset-0 transition-all duration-200 ease-in-out ${
              copied ? "opacity-0 scale-50" : "opacity-100 scale-100"
            }`}
          >
            <CopyGlyph />
          </span>
        </span>
      </span>
    </button>
  );
}

export default CopyButton;
