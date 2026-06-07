"use client";

import { forwardRef, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Copy, Check } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Traffic Light Dots
// ============================================================================

function TrafficLights() {
  return (
    <div aria-hidden="true" className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#FE5F57]" />
      <div className="w-3 h-3 rounded-full bg-[#FEBB2E]" />
      <div className="w-3 h-3 rounded-full bg-[#26C941]" />
    </div>
  );
}

// ============================================================================
// Navigation Buttons
// ============================================================================

function NavigationButtons() {
  return (
    <div aria-hidden="true" className="flex items-center gap-4 max-md:hidden">
      <ArrowLeft size={14} className="text-textSubtle" />
      <ArrowRight size={14} className="text-textSubtle" />
      <RotateCw size={14} className="text-textSubtle" />
    </div>
  );
}

// ============================================================================
// Address Bar
// ============================================================================

interface AddressBarProps {
  url?: string;
  showCopyButton?: boolean;
}

function AddressBar({
  url = "distanzrunning.com",
  showCopyButton = true,
}: AddressBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [url]);

  return (
    <div className="lg:max-w-xs bg-canvas border border-borderDefault w-full rounded-full pl-4 pr-1 py-1 flex items-center justify-between">
      <div
        aria-hidden="true"
        className="text-copy-13 text-textDefault truncate flex-1 min-w-0 text-center"
      >
        {url}
      </div>
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
// Browser Header Component
// ============================================================================

/**
 * BrowserHeader component - the top bar of the browser frame.
 */
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
        {/* Left section: traffic lights and navigation */}
        <div className="flex items-center flex-1 justify-center gap-4 min-w-0 first:justify-start md:first:max-w-[140px] max-md:first:flex-none last:justify-end md:last:max-w-[140px]">
          <TrafficLights />
          {showNavigation && <NavigationButtons />}
        </div>

        {/* Center section: address bar */}
        <div className="flex items-center flex-1 justify-center gap-4 min-w-0 first:justify-start md:first:max-w-[140px] max-md:first:flex-none last:justify-end md:last:max-w-[140px]">
          <AddressBar url={url} showCopyButton={showCopyButton} />
        </div>

        {/* Right section: placeholder for additional controls */}
        <div className="flex items-center flex-1 justify-center gap-4 min-w-0 first:justify-start md:first:max-w-[140px] max-md:first:flex-none last:justify-end md:last:max-w-[140px] max-lg:hidden" />
      </div>
    );
  },
);

BrowserHeader.displayName = "BrowserHeader";

// ============================================================================
// Browser Component
// ============================================================================

/**
 * Browser component - a realistic browser-style frame for showcasing content.
 *
 * @example
 * <Browser url="distanzrunning.com">
 *   <img src="/screenshot.png" alt="Website screenshot" />
 * </Browser>
 */
export const Browser = forwardRef<HTMLDivElement, BrowserProps>(
  (
    {
      children,
      url = "distanzrunning.com",
      showNavigation = true,
      showCopyButton = true,
      className = "",
    },
    ref,
  ) => {
    return (
      // container-type wrapper so the frame's md:rounded-[1.5cqw] (Geist's
      // width-relative corner radius) resolves against the Browser's own width.
      <div ref={ref} className={`[container-type:inline-size] ${className}`}>
        {/* Geist-verbatim frame: the `material-small` primitive (now borderless
            = shadow-border-small + 6px radius) with bg overridden to canvas
            (bg-200) and the radius growing to 1.5cqw at md. */}
        <div className="material-small overflow-hidden rounded-md bg-canvas md:rounded-[1.5cqw]">
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
