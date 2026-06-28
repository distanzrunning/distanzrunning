"use client";

import { forwardRef, useState, useCallback } from "react";
import { MiddleTruncate } from "./MiddleTruncate";

// ============================================================================
// Types
// ============================================================================

/** Forces the chrome theme regardless of the page theme. Omit to follow it. */
export type BrowserVariant = "light" | "dark";

/** Props for the Browser component */
export interface BrowserProps {
  /** Content to display inside the browser frame */
  children?: React.ReactNode;
  /** URL to display in the address bar */
  url?: string;
  /** Whether to show navigation buttons (back, forward, refresh) */
  showNavigation?: boolean;
  /** Whether to show the copy button in the address bar */
  showCopyButton?: boolean;
  /** Force light/dark chrome. Omit to follow the surrounding page theme. */
  variant?: BrowserVariant;
  /** Additional CSS classes */
  className?: string;
}

/** Props for the BrowserHeader component */
export interface BrowserHeaderProps {
  /** URL to display in the address bar */
  url?: string;
  /** Whether to show navigation buttons */
  showNavigation?: boolean;
  /** Whether to show the copy button */
  showCopyButton?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Props for the BrowserAddressBar building block */
export interface BrowserAddressBarProps {
  /** URL to display */
  url?: string;
  /** Whether to show the copy button */
  showCopyButton?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Our --ds-* tokens redeclare under `.light` / `.dark`, so wrapping a subtree
// in that class forces its palette regardless of the page theme.
function variantClass(variant?: BrowserVariant): string {
  return variant === "light" ? "light" : variant === "dark" ? "dark" : "";
}

// Shared class for the header's three flex slots (left / center / right).
const HEADER_SLOT =
  "flex items-center flex-1 justify-center gap-4 min-w-0 first:justify-start md:first:max-w-[140px] max-md:first:flex-none last:justify-end md:last:max-w-[140px]";

// Geist's exact browser-chrome glyphs, inlined so the chrome is pixel-identical
// (Geist uses its own icon set here, not lucide). All decorative (aria-hidden);
// fill inherits via currentColor.
const ICON = {
  back: "m6.47 13.78.53.53 1.06-1.06-.53-.53-3.97-3.97H15v-1.5H3.56l3.97-3.97.53-.53L7 1.69l-.53.53L1.4 7.29a1 1 0 0 0 0 1.42z",
  forward:
    "M9.53 2.22 9 1.69 7.94 2.75l.53.53 3.97 3.97H1v1.5h11.44l-3.97 3.97-.53.53L9 14.31l.53-.53 5.07-5.07a1 1 0 0 0 0-1.42z",
  refresh:
    "M8 1a7 7 0 0 0-6.16 3.67l-.36.66 1.32.72.36-.66a5.5 5.5 0 0 1 10.11 1.03h-2.2v1.5h4.18c.41 0 .75-.33.75-.75V3h-1.5v2.39A7 7 0 0 0 8 1m-6.5 9.6V13H0V8.83c0-.42.34-.75.75-.75h4.18v1.5h-2.2a5.5 5.5 0 0 0 10.1 1.06l.36-.66 1.31.72-.36.66a7 7 0 0 1-12.64-.75",
  copy: "M8.25 2c.14 0 .25.11.25.25V3H10v-.75C10 1.28 9.22.5 8.25.5h-5.5C1.78.5 1 1.28 1 2.25v7.5c0 .97.78 1.75 1.75 1.75H4.5V10H2.75a.25.25 0 0 1-.25-.25v-7.5c0-.14.11-.25.25-.25zm5 4c.14 0 .25.11.25.25v7.5q-.02.23-.25.25h-5.5a.25.25 0 0 1-.25-.25v-7.5c0-.14.11-.25.25-.25zm0 9.5c.97 0 1.75-.78 1.75-1.75v-7.5c0-.97-.78-1.75-1.75-1.75h-5.5C6.78 4.5 6 5.28 6 6.25v7.5c0 .97.78 1.75 1.75 1.75z",
  check:
    "m15.56 4-.53.53-8.8 8.8c-.68.68-1.78.68-2.47 0l.53-.54-.53.53-2.79-2.79L.44 10 1.5 8.94l.53.53 2.8 2.8c.1.09.25.09.35 0l8.79-8.8.53-.53z",
} as const;

function GeistGlyph({
  d,
  size = 16,
  className = "",
}: {
  d: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      <path fill="currentColor" fillRule="evenodd" d={d} clipRule="evenodd" />
    </svg>
  );
}

// ============================================================================
// Building blocks (composable — named exports for custom chrome layouts)
// ============================================================================

/** Traffic-light dots (macOS-style window controls). */
export function BrowserDots() {
  return (
    <div aria-hidden="true" className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#FE5F57]" />
      <div className="w-3 h-3 rounded-full bg-[#FEBB2E]" />
      <div className="w-3 h-3 rounded-full bg-[#26C941]" />
    </div>
  );
}

/** Back / forward / refresh nav controls (hidden below md, like Geist). */
export function BrowserControls() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-4 max-md:hidden text-textSubtle"
    >
      <GeistGlyph d={ICON.back} size={14} />
      <GeistGlyph d={ICON.forward} size={14} />
      <GeistGlyph d={ICON.refresh} size={14} />
    </div>
  );
}

/** The address-bar pill (URL + optional copy button). */
export function BrowserAddressBar({
  url = "distanzrunning.com",
  showCopyButton = true,
  className = "",
}: BrowserAddressBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [url]);

  return (
    <div
      className={`lg:max-w-xs bg-canvas border border-borderDefault w-full rounded-full pl-4 pr-1 py-1 flex items-center justify-between ${className}`}
    >
      <MiddleTruncate
        text={url}
        aria-hidden="true"
        className="text-copy-13 text-textDefault flex-1 min-w-0 justify-center"
      />
      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy URL"
          // [&_svg]:size-3 forces the glyph to 12px (Geist's `[&_svg]:size-3`),
          // overriding the global `button svg { width: --ds-icon-size, 16px }`.
          className="flex h-6 w-6 items-center justify-center rounded-[4px] text-textDefault hover:bg-[var(--ds-gray-alpha-200)] transition-colors [&_svg]:size-3"
        >
          <div className="relative w-3 h-3">
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-150 ease-out ${
                copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
              }`}
            >
              <GeistGlyph d={ICON.copy} />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-150 ease-out ${
                copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <GeistGlyph d={ICON.check} />
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Browser Header
// ============================================================================

/** The canned browser chrome bar (dots + controls · address bar · spacer). */
export const BrowserHeader = forwardRef<HTMLDivElement, BrowserHeaderProps>(
  (
    { url, showNavigation = true, showCopyButton = true, className = "" },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`px-4 py-2 md:px-5 md:py-2.5 flex justify-between gap-4 md:gap-6 bg-surface ${className}`}
      >
        {/* Left: traffic lights + nav controls */}
        <div className={HEADER_SLOT}>
          <BrowserDots />
          {showNavigation && <BrowserControls />}
        </div>

        {/* Center: address bar */}
        <div className={HEADER_SLOT}>
          <BrowserAddressBar url={url} showCopyButton={showCopyButton} />
        </div>

        {/* Right: spacer (balances the address bar; hidden below lg) */}
        <div className={`${HEADER_SLOT} max-lg:hidden`} />
      </div>
    );
  },
);

BrowserHeader.displayName = "BrowserHeader";

// ============================================================================
// Browser
// ============================================================================

/**
 * Browser — a realistic browser-style frame for showcasing screenshots,
 * demos, or recordings. Use the canned `Browser`, or compose your own chrome
 * from the building blocks (`BrowserDots`, `BrowserControls`,
 * `BrowserAddressBar`). Pass `variant="light" | "dark"` to force the chrome
 * theme; omit it to follow the page theme.
 *
 * @example
 * <Browser url="distanzrunning.com">
 *   <img src="/screenshot.png" alt="Race calendar on Distanz" />
 * </Browser>
 */
export const Browser = forwardRef<HTMLDivElement, BrowserProps>(
  (
    {
      children,
      url = "distanzrunning.com",
      showNavigation = true,
      showCopyButton = true,
      variant,
      className = "",
    },
    ref,
  ) => {
    return (
      // container-type so md:rounded-[1.5cqw] resolves to the Browser's width;
      // the variant class forces the chrome palette for this subtree.
      <div
        ref={ref}
        className={`[container-type:inline-size] ${variantClass(variant)} ${className}`}
      >
        {/* Geist `material-small` (borderless: shadow-border-small + 6px) with
            the fill overridden to canvas (bg-200) and radius growing at md. */}
        <div className="material-small overflow-hidden rounded-md !bg-canvas md:rounded-[1.5cqw]">
          <BrowserHeader
            url={url}
            showNavigation={showNavigation}
            showCopyButton={showCopyButton}
          />
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  },
);

Browser.displayName = "Browser";

// Default export
export default Browser;
