"use client";

import { useContext } from "react";
import Image from "next/image";
import { Search, Sun, Moon, Monitor, Sparkles } from "lucide-react";
import { DarkModeContext } from "@/components/DarkModeProvider";

interface DesignSystemHeaderProps {
  onHomeClick: () => void;
  onNavigate?: (slug: string) => void;
  activeSlug?: string;
}

export default function DesignSystemHeader({
  onHomeClick,
  onNavigate,
  activeSlug,
}: DesignSystemHeaderProps) {
  const { isDark, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <header
      className="sticky top-12 z-40 w-full border-b border-borderSubtle"
      style={{ background: "var(--ds-background-100)" }}
    >
      <div className="flex w-full pl-[22px]">
        {/* Logo section - matches sidebar width */}
        <div className="flex grow items-center gap-4 border-r border-borderSubtle py-4 pl-px xl:w-[238px] xl:grow-0">
          <button
            onClick={onHomeClick}
            className="flex items-center gap-4 text-black dark:text-white no-underline"
          >
            <Image
              src="/images/distanz_icon_black.png"
              alt="Distanz Running"
              width={27}
              height={27}
              className="dark:hidden"
            />
            <Image
              src="/images/distanz_icon_white.png"
              alt="Distanz Running"
              width={27}
              height={27}
              className="hidden dark:block"
            />
            <p
              className="text-[16px] font-medium"
              style={{ letterSpacing: "-0.32px" }}
            >
              Stride Design System
            </p>
          </button>
        </div>

        {/* Right section with search and theme */}
        <div className="flex items-center justify-between p-4 xl:grow">
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
            aria-label="Open menu"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Component Generator button */}
          <button
            type="button"
            onClick={() => onNavigate?.("component-generator")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeSlug === "component-generator"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-borderDefault text-textDefault hover:bg-surfaceSubtle"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Generator</span>
          </button>

          {/* Theme switcher - Geist style */}
          <fieldset className="hidden xl:flex items-center gap-0 rounded-full border border-borderDefault bg-canvas">
            <legend className="sr-only">Select a display theme:</legend>

            {/* System theme option */}
            <label className="relative">
              <input
                type="radio"
                name="theme"
                value="system"
                className="sr-only peer"
                aria-label="system"
              />
              <span className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer text-textSubtle hover:text-textDefault peer-checked:bg-surfaceSubtle peer-checked:text-textDefault transition-colors">
                <Monitor className="w-4 h-4" />
              </span>
            </label>

            {/* Light theme option */}
            <label className="relative">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={!isDark}
                onChange={() => isDark && toggleDarkMode()}
                className="sr-only peer"
                aria-label="light"
              />
              <span className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer text-textSubtle hover:text-textDefault peer-checked:bg-surfaceSubtle peer-checked:text-textDefault transition-colors">
                <Sun className="w-4 h-4" />
              </span>
            </label>

            {/* Dark theme option */}
            <label className="relative">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={isDark}
                onChange={() => !isDark && toggleDarkMode()}
                className="sr-only peer"
                aria-label="dark"
              />
              <span className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer text-textSubtle hover:text-textDefault peer-checked:bg-surfaceSubtle peer-checked:text-textDefault transition-colors">
                <Moon className="w-4 h-4" />
              </span>
            </label>
          </fieldset>
        </div>
      </div>
    </header>
  );
}
