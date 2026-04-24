"use client";

import { useContext } from "react";
import Link from "next/link";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { NewsletterButton } from "@/components/ui/NewsletterModal";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import SiteNavigationMenu, {
  type FeaturedProduct,
  type FeaturedRace,
} from "@/components/ui/SiteNavigationMenu";

// ============================================================================
// SiteHeader
// ============================================================================
//
// Public-site header that sits above the PageFrame. Anatomy modelled on
// v0.app's chat-header: 50px tall, padded chrome, wordmark left, nav
// centre, action row right. Sits in the document flow (relative, not
// sticky) so it scrolls naturally with the page.
//
// Desktop-only for now — the mobile drawer (burger button, full-screen
// menu) lands in a follow-up.

export interface SiteHeaderProps {
  featuredNews: FeaturedProduct;
  featuredShoe: FeaturedProduct;
  featuredGear: FeaturedProduct;
  featuredNutrition: FeaturedProduct;
  featuredRace: FeaturedRace;
  /**
   * Where the newsletter trigger reports from in PostHog.
   * Defaults to "site_header".
   */
  newsletterSource?: string;
}

export default function SiteHeader({
  featuredNews,
  featuredShoe,
  featuredGear,
  featuredNutrition,
  featuredRace,
  newsletterSource = "site_header",
}: SiteHeaderProps) {
  const { theme, setTheme } = useContext(DarkModeContext);

  return (
    <header
      className="relative z-20 flex h-[50px] w-full shrink-0 items-center justify-between px-3 sm:px-2"
    >
      {/* Left: wordmark */}
      <div className="flex min-w-0 items-center">
        <Link
          href="/"
          aria-label="Distanz Running — home"
          className="inline-flex h-10 items-center px-1"
        >
          {/* Tailwind dark-mode swap — both SVGs are in public/brand. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wordmark-black.svg"
            alt=""
            className="block h-5 w-auto dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wordmark-white.svg"
            alt=""
            className="hidden h-5 w-auto dark:block"
          />
        </Link>
      </div>

      {/* Centre: primary nav (desktop). Absolutely positioned so the
          row is geometrically centred on the page, independent of the
          wordmark + action-row widths. pointer-events-none on the
          wrapper (with auto on the inner) lets clicks fall through
          the empty horizontal strip to whatever sits behind. */}
      <div className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex">
        <div className="pointer-events-auto">
          <SiteNavigationMenu
            featuredNews={featuredNews}
            featuredShoe={featuredShoe}
            featuredGear={featuredGear}
            featuredNutrition={featuredNutrition}
            featuredRace={featuredRace}
          />
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <NewsletterButton size="small" source={newsletterSource} />
        <ThemeSwitcher
          showSystem={false}
          value={theme === "system" ? "light" : theme}
          onChange={setTheme}
        />
      </div>
    </header>
  );
}
