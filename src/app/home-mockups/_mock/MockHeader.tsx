"use client";

import { useContext, useEffect, useState } from "react";
import { Search, Moon, Sun, Menu, X } from "lucide-react";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { useSearch } from "@/contexts/SearchContext";
import { Button } from "@/components/ui/Button";
import { SECTIONS } from "./data";

// Two-tier sticky navbar for the homepage mockups, modelled on the 404 Media
// header: a top bar (search + theme toggle · centered wordmark · Sign in /
// Subscribe + hamburger) over a bottom bar (section links). Wires the real
// DarkModeContext + SearchContext so the toggle and search actually work.
// Stand-in for the production SiteHeader while we iterate on the homepage.

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[color:var(--ds-gray-900)] transition-colors hover:bg-[var(--ds-gray-100)]";

export default function MockHeader() {
  const { isDark, setTheme } = useContext(DarkModeContext);
  const { openSearch } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-surface transition-shadow ${
        scrolled
          ? "border-b border-borderSubtle shadow-[0_6px_16px_-12px_rgba(0,0,0,0.4)]"
          : "border-b border-borderSubtle"
      }`}
    >
      {/* top bar */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-3">
        {/* left — search + theme toggle */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            title="Search"
            className={iconBtn}
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="ml-1 flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setTheme("dark")}
              aria-label="Dark theme"
              aria-pressed={isDark}
              title="Dark theme"
              className={`${iconBtn} ${isDark ? "text-textDefault" : "text-textSubtler"}`}
            >
              <Moon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setTheme("light")}
              aria-label="Light theme"
              aria-pressed={!isDark}
              title="Light theme"
              className={`${iconBtn} ${!isDark ? "text-textDefault" : "text-textSubtler"}`}
            >
              <Sun className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* center — wordmark (black in light, white in dark) */}
        <a
          href="#"
          aria-label="Distanz — home"
          className="flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.svg"
            alt="Distanz"
            className="block h-5 w-auto dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo_white.svg"
            alt="Distanz"
            className="hidden h-5 w-auto dark:block"
          />
        </a>

        {/* right — member actions + hamburger */}
        <div className="flex items-center justify-end gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="tertiary" size="small">
              Sign in
            </Button>
            <Button variant="default" size="small">
              Subscribe
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className={`${iconBtn} sm:hidden`}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* bottom bar — section links (desktop) */}
      <nav className="hidden border-t border-borderSubtle sm:block">
        <ul className="flex items-center justify-center gap-7 px-6 py-2.5">
          {SECTIONS.map((s) => (
            <li key={s}>
              <a
                href="#"
                className="text-copy-13 font-medium tracking-[0.02em] text-textSubtle no-underline transition-colors hover:text-textDefault"
              >
                {s}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="flex flex-col gap-3 border-t border-borderSubtle px-6 py-4 sm:hidden">
          {SECTIONS.map((s) => (
            <a
              key={s}
              href="#"
              className="text-copy-14 font-medium text-textSubtle no-underline hover:text-textDefault"
            >
              {s}
            </a>
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
      )}
    </header>
  );
}
