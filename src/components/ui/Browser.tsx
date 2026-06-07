"use client";

import { forwardRef, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Copy, Check } from "lucide-react";
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
    <div aria-hidden="true" className="flex items-center gap-4 max-md:hidden">
      <ArrowLeft size={14} className="text-textSubtle" />
      <ArrowRight size={14} className="text-textSubtle" />
      <RotateCw size={14} className="text-textSubtle" />
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
          className="flex h-6 w-6 items-center justify-center rounded-[4px] text-textDefault hover:bg-[var(--ds-gray-alpha-200)] transition-colors"
        >
          <div className="relative w-3 h-3">
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-150 ease-out ${
                copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
              }`}
            >
              <Copy size={12} />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-150 ease-out ${
                copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <Check size={12} />
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
