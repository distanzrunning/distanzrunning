"use client";

import { useContext } from "react";
import { Search, ExternalLink } from "lucide-react";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

interface DesignSystemHeaderProps {
  onHomeClick: () => void;
  onNavigate?: (slug: string) => void;
  activeSlug?: string;
}

export default function DesignSystemHeader({
  onHomeClick,
}: DesignSystemHeaderProps) {
  const { theme, setTheme } = useContext(DarkModeContext);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-borderSubtle"
      style={{ background: "var(--ds-background-100)" }}
    >
      <div className="flex w-full pl-[22px]">
        {/* Logo section - matches sidebar width */}
        <div className="flex grow items-center gap-4 border-r border-borderSubtle py-4 pl-px xl:w-[238px] xl:grow-0">
          <button
            onClick={onHomeClick}
            className="flex items-center gap-4 text-black dark:text-white no-underline"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/stride_icon_black.svg"
              alt="Stride"
              className="dark:hidden"
              style={{ width: 27, height: 27 }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/stride_icon_white.svg"
              alt="Stride"
              className="hidden dark:block"
              style={{ width: 27, height: 27 }}
            />
            <p
              className="text-[16px] font-medium"
              style={{ letterSpacing: "-0.32px" }}
            >
              Stride Design System
            </p>
          </button>
        </div>

        {/* Right section with search and actions */}
        <div className="flex items-center justify-between p-4 xl:grow">
          {/* Left: Search */}
          <div className="flex items-center gap-3">
            {/* Search button - desktop only */}
            <button
              type="button"
              className="hidden xl:flex h-8 w-[220px] cursor-pointer items-center justify-between rounded border border-borderDefault bg-transparent pl-2 pr-1.5 font-sans text-sm text-textSubtle outline-none hover:bg-surfaceSubtle"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Search Stride</span>
              </span>
              <kbd className="inline-flex h-5 items-center gap-0 rounded border border-borderSubtle bg-canvas px-1 font-mono text-[11px] font-medium text-textDefault">
                <span style={{ minWidth: "1em", display: "inline-block" }}>
                  ⌘
                </span>
                <span>K</span>
              </kbd>
            </button>

            {/* Mobile search icon */}
            <button
              type="button"
              className="xl:hidden p-2 rounded-full bg-transparent hover:bg-surfaceSubtle transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Back to site + Theme switcher */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm text-textSubtle hover:text-textDefault hover:bg-surfaceSubtle transition-colors no-underline"
            >
              <span>Back to site</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <ThemeSwitcher
              showSystem={false}
              value={theme === "system" ? "light" : theme}
              onChange={setTheme}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
