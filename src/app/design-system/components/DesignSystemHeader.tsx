"use client";

import { useContext } from "react";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Search,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  Ellipsis,
} from "lucide-react";
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
      className="sticky top-0 z-40 w-full border-b border-borderSubtle"
      style={{ background: "var(--ds-background-100)" }}
    >
      <style>{`
        .ds-header-dropdown-content {
          min-width: 180px;
          padding: 4px;
          border-radius: 8px;
          background: var(--ds-background-100);
          border: 1px solid var(--ds-gray-alpha-400);
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          color: var(--ds-gray-1000);
          font-size: 14px;
          z-index: 100;
          will-change: transform, opacity;
          animation-duration: 150ms;
          animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.1);
        }
        .ds-header-dropdown-content[data-state="open"] {
          animation-name: ds-dropdown-in;
        }
        @keyframes ds-dropdown-in {
          from { opacity: 0; transform: scale(0.96) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ds-header-dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 36px;
          padding: 0 8px;
          border-radius: 6px;
          font-size: 14px;
          line-height: 20px;
          color: var(--ds-gray-1000);
          cursor: pointer;
          user-select: none;
          outline: none;
          text-decoration: none;
          transition: background 0.1s ease;
        }
        .ds-header-dropdown-item .ds-item-icon {
          margin-left: auto;
          display: flex;
          align-items: center;
          color: var(--ds-gray-900);
        }
        .ds-header-dropdown-item[data-highlighted] {
          background: var(--ds-gray-alpha-200);
        }
        .ds-header-dropdown-separator {
          height: 1px;
          background: var(--ds-gray-alpha-400);
          margin: 4px;
        }
      `}</style>
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

          {/* Right: Ellipsis dropdown menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="flex items-center justify-center w-8 h-8 rounded-md text-textSubtle hover:text-textDefault hover:bg-surfaceSubtle transition-colors outline-none"
                aria-label="Menu"
              >
                <Ellipsis className="w-5 h-5" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="ds-header-dropdown-content"
                sideOffset={8}
                align="end"
              >
                {/* Generator */}
                <DropdownMenu.Item
                  className="ds-header-dropdown-item"
                  onSelect={() => onNavigate?.("component-generator")}
                >
                  <span>Generator</span>
                  <span className="ds-item-icon">
                    <Sparkles className="w-4 h-4" />
                  </span>
                </DropdownMenu.Item>

                {/* Back to site */}
                <DropdownMenu.Item
                  className="ds-header-dropdown-item"
                  asChild
                >
                  <a href="/" className="no-underline">
                    <span>Back to site</span>
                    <span className="ds-item-icon">
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </a>
                </DropdownMenu.Item>

                {/* Theme toggle footer */}
                <div
                  className="flex items-center justify-center -mx-1 -mb-1 mt-1 rounded-b-lg py-2"
                  style={{ background: "var(--ds-gray-alpha-100)" }}
                >
                  <div
                    className="inline-flex items-center rounded-full p-0.5"
                    style={{ background: "var(--ds-gray-alpha-200)" }}
                  >
                    <button
                      onClick={() => isDark && toggleDarkMode()}
                      className="flex items-center justify-center w-7 h-7 rounded-full transition-colors"
                      style={{
                        background: !isDark ? "var(--ds-background-100)" : "transparent",
                        color: !isDark ? "var(--ds-gray-1000)" : "var(--ds-gray-700)",
                        boxShadow: !isDark ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                      }}
                      aria-label="Light mode"
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => !isDark && toggleDarkMode()}
                      className="flex items-center justify-center w-7 h-7 rounded-full transition-colors"
                      style={{
                        background: isDark ? "var(--ds-background-100)" : "transparent",
                        color: isDark ? "var(--ds-gray-1000)" : "var(--ds-gray-700)",
                        boxShadow: isDark ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                      }}
                      aria-label="Dark mode"
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
