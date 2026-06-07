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
      {/* Crossfade copy ↔ check (Geist: 200ms ease-in-out, scale 50 → 100) */}
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <Check
          size={16}
          className={`absolute transition-all duration-200 ease-in-out ${
            copied ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        />
        <Copy
          size={16}
          className={`absolute transition-all duration-200 ease-in-out ${
            copied ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
        />
      </span>
    </Button>
  );
}

export default CopyButton;
