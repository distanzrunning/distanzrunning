"use client";

import React, { useCallback, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";

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

export interface TextWithCopyButtonProps {
  /** The text shown next to the icon, and copied to the clipboard. */
  text: string;
  /**
   * Override the clipboard payload when it should differ from the
   * visible text (e.g. show a friendly label, copy the full digest).
   */
  copyValue?: string;
  /**
   * Optional toast fired on copy (e.g. `Copied to clipboard`). Needs a
   * `ToastContainer` mounted in the tree; without one it's a no-op.
   */
  toastMessage?: string;
  /** ms the check state shows before reverting to the copy glyph. Default 2000. */
  feedbackDuration?: number;
  /** Fired after a successful copy. */
  onCopy?: (value: string) => void;
  /** Accessible name for the button. Defaults to `Copy ${text}`. */
  "aria-label"?: string;
  className?: string;
}

// ============================================================================
// TextWithCopyButton
// ============================================================================

/**
 * A borderless label + animated copy icon. Clicking copies `copyValue`
 * (or `text`) to the clipboard, crossfades the copy glyph to a check for
 * `feedbackDuration` ms, and optionally fires a toast. Geist's Text With
 * Copy Button.
 *
 * @example
 * <TextWithCopyButton text="vercel.com" toastMessage="Copied to clipboard" />
 */
export function TextWithCopyButton({
  text,
  copyValue,
  toastMessage,
  feedbackDuration = 2000,
  onCopy,
  "aria-label": ariaLabel,
  className = "",
}: TextWithCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

  const handleCopy = useCallback(async () => {
    const payload = copyValue ?? text;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      return;
    }
    onCopy?.(payload);
    if (toastMessage) showToast(toastMessage);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), feedbackDuration);
  }, [copyValue, text, onCopy, toastMessage, showToast, feedbackDuration]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel ?? `Copy ${text}`}
      className={[
        // Borderless, full-width, label + icon. Colours (muted label/icon →
        // ink on hover) live in globals .ds-text-copy-button.
        "ds-text-copy-button flex w-full cursor-pointer items-center justify-start gap-1.5",
        "border-none bg-transparent p-0 outline-0 transition-colors duration-100 ease-in-out",
        className,
      ].join(" ")}
    >
      <p className="truncate whitespace-nowrap text-inherit">{text}</p>
      {/* 16px box with the two glyphs crossfading (200ms, scale 50 → 100). */}
      <span className="relative block h-4 w-4 shrink-0">
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
    </button>
  );
}

export default TextWithCopyButton;
