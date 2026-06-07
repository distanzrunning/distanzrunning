"use client";

import { useCallback, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "./Button";

// ============================================================================
// Types
// ============================================================================

export interface CopyButtonProps
  extends Omit<
    ButtonProps,
    "children" | "onClick" | "variant" | "shape" | "prefixIcon" | "suffixIcon"
  > {
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
 * A secondary, square icon button that copies `value` to the clipboard and
 * crossfades from the copy glyph to a checkmark for `feedbackDuration` ms.
 *
 * @example
 * <CopyButton value="npm i geist" />
 */
export function CopyButton({
  value,
  feedbackDuration = 2000,
  onCopy,
  size = "medium",
  "aria-label": ariaLabel = "Copy",
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
    <Button
      variant="secondary"
      shape="square"
      size={size}
      aria-label={ariaLabel}
      onClick={handleCopy}
      {...props}
    >
      {/* Geist's exact inner markup: a block 16px box with the two glyphs in
         absolute wrappers pinned to it, crossfading (200ms ease-in-out,
         scale 50 → 100). Block + pinned-absolute keeps them dead-centre. */}
      <span className="inline-flex shrink-0 items-center justify-center px-1.5">
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
      </span>
    </Button>
  );
}

export default CopyButton;
