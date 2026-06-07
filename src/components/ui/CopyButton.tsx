"use client";

import {
  useCallback,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from "react";
import { Check, Copy } from "lucide-react";

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
 * `feedbackDuration` ms. Standalone (not wrapped in <Button>) so the box
 * matches Geist's copy button verbatim.
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
        // Geist's box: 40×40 square, no padding, rounded-md, centred content
        "inline-flex h-[var(--ds-button-height-medium)] w-[var(--ds-button-height-medium)] items-center justify-center p-0",
        "cursor-pointer select-none rounded-[var(--ds-radius-small)] outline-none",
        // Secondary tokens (= our Button `secondary`): hairline border, surface
        // fill, gray-1000 ink, gray-100/200 hover
        "bg-surface text-textDefault shadow-[0_0_0_1px_var(--ds-gray-400)]",
        "transition-[background,box-shadow,color] duration-150 ease-in-out",
        "hover:bg-[var(--ds-gray-100)] dark:hover:bg-[var(--ds-gray-200)]",
        // Blue keyboard focus ring (matches our other actionable controls)
        "focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-background-100)]",
        "disabled:cursor-not-allowed disabled:bg-[var(--ds-gray-100)] disabled:text-textSubtler",
        className,
      ].join(" ")}
      {...props}
    >
      {/* Crossfade copy ↔ check (Geist: 200ms ease-in-out, scale 50 → 100).
         A 16px block box with each glyph filling it via inset-0 + flex. */}
      <span className="relative block h-4 w-4">
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out ${
            copied ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <Check size={16} className="block" />
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out ${
            copied ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
        >
          <Copy size={16} className="block" />
        </span>
      </span>
    </button>
  );
}

export default CopyButton;
