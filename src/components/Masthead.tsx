"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Search, Moon, Sun, Menu, X } from "lucide-react";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { useSearch } from "@/contexts/SearchContext";
import { Button } from "@/components/ui/Button";

// Distanz masthead — our take on the 404 Media two-tier header:
//   top tier:  search + theme toggle (left) · centered wordmark · Sign in /
//              Subscribe + mobile hamburger (right)
//   bottom tier: left-aligned section nav (collapses into the mobile menu)
// Sticky, with a shadow once scrolled. Wires the real DarkModeContext (theme)
// and SearchContext (⌘K search). Section links + auth targets are placeholders
// to finalise.

const NAV: { label: string; href: string }[] = [
  { label: "Racing", href: "/races" },
  { label: "Training", href: "/articles" },
  { label: "Gear", href: "/gear" },
  { label: "Shoes", href: "/shoes" },
  { label: "Nutrition", href: "/nutrition" },
];

export default function Masthead() {
  const { isDark, toggleDarkMode } = useContext(DarkModeContext);
  const { openSearch } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-surface transition-shadow ${
        scrolled ? "shadow-[0_6px_16px_-12px_rgba(0,0,0,0.45)]" : ""
      }`}
    >
      {/* top tier */}
      <div className="border-b border-borderSubtle">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-3">
          {/* left — search + single theme toggle */}
          <div className="flex items-center gap-1">
            <Button
              shape="square"
              size="large"
              variant="tertiary"
              onClick={openSearch}
              aria-label="Search"
              title="Search (⌘K)"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              shape="square"
              size="large"
              variant="tertiary"
              onClick={toggleDarkMode}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Light theme" : "Dark theme"}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* center — wordmark */}
          <Link
            href="/"
            aria-label="Distanz — home"
            className="flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/wordmark-black.svg"
              alt="Distanz"
              className="block h-12 w-auto dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/wordmark-white.svg"
              alt="Distanz"
              className="hidden h-12 w-auto dark:block"
            />
          </Link>

          {/* right — auth + hamburger */}
          <div className="flex items-center justify-end gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="tertiary" size="large">
                Sign in
              </Button>
              <Button variant="default" size="large">
                Subscribe
              </Button>
            </div>
            <Button
              shape="square"
              size="large"
              variant="tertiary"
              onClick={() => setMobileOpen((v) => !v)}
              className="sm:hidden"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* bottom tier — section nav (desktop) */}
      <div className="hidden border-b border-borderSubtle sm:block">
        <nav className="mx-auto max-w-[1280px] px-6">
          <ul className="flex items-center justify-center gap-6 py-2.5">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-copy-13 font-medium tracking-[0.02em] text-textSubtle no-underline transition-colors hover:text-textDefault"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="border-b border-borderSubtle sm:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-6 py-4">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-copy-14 font-medium text-textSubtle no-underline hover:text-textDefault"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="tertiary" size="small">
                Sign in
              </Button>
              <Button variant="default" size="small">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
