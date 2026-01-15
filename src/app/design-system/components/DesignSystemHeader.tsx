"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { Search, Monitor, Sun, Moon } from "lucide-react";

interface DesignSystemHeaderProps {
  onHomeClick: () => void;
}

export default function DesignSystemHeader({
  onHomeClick,
}: DesignSystemHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-borderSubtle bg-background-100 dark:bg-[#0a0a0a] dark:border-[#242424]">
      <div className="flex w-full max-w-[1400px] mx-auto">
        {/* Logo section */}
        <div className="flex items-center gap-4 border-r border-borderSubtle dark:border-[#242424] py-4 pl-6 pr-6 xl:w-[280px] xl:flex-shrink-0">
          <button
            onClick={onHomeClick}
            className="flex items-center gap-3 text-textDefault no-underline hover:opacity-70 transition-opacity"
          >
            <Image
              src="/images/distanz_icon_black_round.png"
              alt="Distanz Running"
              width={28}
              height={28}
              className="dark:invert"
            />
            <span className="font-serif text-base font-medium tracking-tight">
              Stride Design System
            </span>
          </button>
        </div>

        {/* Right section with search and theme */}
        <div className="flex items-center justify-between flex-1 px-4">
          {/* Search button - desktop only */}
          <button
            type="button"
            className="hidden xl:flex h-8 w-[220px] cursor-pointer items-center justify-between rounded-md border border-borderDefault bg-transparent pl-3 pr-2 text-sm text-textSubtle hover:bg-surfaceSubtle transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search Stride</span>
            </span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-borderSubtle bg-surfaceSubtle px-1.5 font-mono text-[10px] font-medium text-textSubtle">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </button>

          {/* Mobile search icon */}
          <button
            type="button"
            className="xl:hidden p-2 rounded-full hover:bg-surfaceSubtle transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-textSubtle" />
          </button>

          {/* Theme switcher */}
          <fieldset className="flex items-center gap-1 p-1 rounded-full border border-borderSubtle bg-surfaceSubtle">
            <legend className="sr-only">Select a display theme:</legend>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`p-1.5 rounded-full transition-colors ${
                theme === "system"
                  ? "bg-canvas text-textDefault shadow-sm"
                  : "text-textSubtle hover:text-textDefault"
              }`}
              aria-label="System theme"
            >
              <Monitor className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-full transition-colors ${
                theme === "light"
                  ? "bg-canvas text-textDefault shadow-sm"
                  : "text-textSubtle hover:text-textDefault"
              }`}
              aria-label="Light theme"
            >
              <Sun className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-full transition-colors ${
                theme === "dark"
                  ? "bg-canvas text-textDefault shadow-sm"
                  : "text-textSubtle hover:text-textDefault"
              }`}
              aria-label="Dark theme"
            >
              <Moon className="w-4 h-4" />
            </button>
          </fieldset>
        </div>
      </div>
    </header>
  );
}
