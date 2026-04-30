"use client";

import { useContext, useEffect, useState } from "react";
import { Search, ExternalLink, ArrowRight } from "lucide-react";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { navigation } from "./DesignSystemSidebar";

interface DesignSystemHeaderProps {
  onHomeClick: () => void;
  onNavigate?: (slug: string) => void;
  activeSlug?: string;
}

export default function DesignSystemHeader({
  onHomeClick,
  onNavigate,
}: DesignSystemHeaderProps) {
  const { theme, setTheme } = useContext(DarkModeContext);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSelect = (slug: string) => {
    onNavigate?.(slug);
    setSearchOpen(false);
  };

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
              onClick={() => setSearchOpen(true)}
              className="hidden xl:flex h-8 w-[220px] cursor-pointer items-center justify-between rounded border border-[var(--ds-gray-400)] bg-transparent pl-2 pr-1.5 font-sans text-sm text-[var(--ds-gray-700)] outline-none transition-colors hover:bg-[var(--ds-background-200)]"
            >
              Search Stride
              <kbd
                className="ml-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded bg-[var(--ds-background-100)] px-1 font-sans text-[12px] leading-5 text-[var(--ds-gray-900)]"
                style={{ boxShadow: "0 0 0 1px var(--ds-gray-alpha-400)" }}
              >
                <span style={{ minWidth: "1em", display: "inline-block" }}>
                  ⌘
                </span>
                <span>K</span>
              </kbd>
            </button>

            {/* Mobile search icon */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
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

      <CommandMenu
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        placeholder="Search..."
      >
        {navigation.map((section) => (
          <CommandMenu.Group key={section.id} heading={section.label}>
            {section.items
              .filter((item) => !item.locked)
              .map((item) => (
                <CommandMenu.Item
                  key={item.id}
                  icon={
                    section.id === "brands" ? (
                      <span
                        style={{
                          position: "relative",
                          display: "block",
                          width: 16,
                          height: 16,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/brand/icon-black.svg"
                          alt=""
                          className="dark:!hidden"
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: 16,
                            height: 16,
                          }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/brand/icon-white.svg"
                          alt=""
                          className="!hidden dark:!block"
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: 16,
                            height: 16,
                          }}
                        />
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )
                  }
                  onSelect={() => handleSelect(item.id)}
                >
                  {item.label}
                </CommandMenu.Item>
              ))}
          </CommandMenu.Group>
        ))}
      </CommandMenu>
    </header>
  );
}
