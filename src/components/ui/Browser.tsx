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
    <div className="flex items-center gap-2">
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
    <div className="flex items-center gap-4 max-md:hidden">
      <ArrowLeft size={14} className="text-[var(--ds-gray-900)]" />
      <ArrowRight size={14} className="text-[var(--ds-gray-900)]" />
      <RotateCw size={14} className="text-[var(--ds-gray-900)]" />
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
  url = "www.distanzrunning.com",
  showCopyButton = true,
}: AddressBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [url]);

  return (
    <div className="lg:max-w-xs bg-[var(--ds-background-200)] border border-[var(--ds-gray-400)] w-full rounded-full pl-4 pr-1 py-1 flex items-center justify-between">
      <div className="text-[13px] text-[var(--ds-gray-1000)] truncate flex-1 min-w-0 text-center">
        {url}
      </div>
      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy URL"
          className="p-1.5 rounded-full hover:bg-[var(--ds-gray-300)] transition-colors"
        >
          <div className="relative w-3 h-3">
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-150 ease-out ${
                copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
              }`}
            >
              <Copy size={12} className="text-[var(--ds-gray-900)]" />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-150 ease-out ${
                copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              <Check size={12} className="text-[var(--ds-gray-900)]" />
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
        className={`px-4 py-2 md:px-5 md:py-2.5 flex justify-between gap-4 md:gap-6 bg-[var(--ds-background-100)] ${className}`}
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
 * <Browser url="www.distanzrunning.com">
 *   <img src="/screenshot.png" alt="Website screenshot" />
 * </Browser>
 */
export const Browser = forwardRef<HTMLDivElement, BrowserProps>(
  (
    {
      children,
      url = "www.distanzrunning.com",
      showNavigation = true,
      showCopyButton = true,
      className = "",
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`rounded-md overflow-hidden bg-[var(--ds-background-200)] shadow-[0_0_0_1px_var(--ds-gray-400)] md:rounded-xl ${className}`}
      >
        <BrowserHeader
          url={url}
          showNavigation={showNavigation}
          showCopyButton={showCopyButton}
        />
        <div className="p-6">{children}</div>
      </div>
    );
  },
);

Browser.displayName = "Browser";

// Default export
export default Browser;
