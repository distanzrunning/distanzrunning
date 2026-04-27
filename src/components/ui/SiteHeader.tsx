"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { NewsletterButton } from "@/components/ui/NewsletterModal";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import SiteNavigationMenu, {
  type FeaturedProduct,
  type FeaturedRace,
} from "@/components/ui/SiteNavigationMenu";
import MobileNavDrawer from "@/components/ui/MobileNavDrawer";
import Wordmark from "@/components/ui/Wordmark";

// ============================================================================
// SiteHeader
// ============================================================================
//
// Public-site header that sits above the PageFrame. Anatomy modelled on
// v0.app's chat-header: 50 px tall, wordmark left, nav centre, action
// row right. Sits in the document flow (relative, not sticky) so it
// scrolls naturally with the page.
//
// Responsive split at the md breakpoint (768 px):
//   below md → wordmark + hamburger; tap hamburger to open the
//              MobileNavDrawer (full-screen panel that slides from the
//              right with two-pane section navigation)
//   md+      → wordmark + centred SiteNavigationMenu + Newsletter +
//              ThemeSwitcher actions

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="relative z-20 flex h-[50px] w-full shrink-0 items-center justify-between px-3 sm:px-2">
        {/* Left: wordmark */}
        <div className="flex min-w-0 items-center">
          <Link
            href="/"
            aria-label="Distanz Running — home"
            className="inline-flex h-10 items-center px-1 text-[color:var(--ds-gray-1000)]"
          >
            {/* Inline SVG via <Wordmark /> — single render, no network
                request, no light/dark download swap. Colour follows
                currentColor (text-gray-1000), which flips automatically
                between near-black and near-white in dark mode. */}
            <Wordmark className="h-6 w-auto" />
          </Link>
        </div>

        {/* Centre: primary nav (desktop only). Absolutely positioned so
            the row is geometrically centred on the page, independent
            of the wordmark + action-row widths. */}
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

        {/* Right (desktop only): newsletter + theme actions */}
        <div className="hidden items-center gap-2 md:flex">
          <NewsletterButton size="small" source={newsletterSource} />
          <ThemeSwitcher
            showSystem={false}
            value={theme === "system" ? "light" : theme}
            onChange={setTheme}
          />
        </div>

        {/* Right (mobile only): hamburger button. 28 px square with
            rounded-md and a hairline border. Interior background is
            the alternate of the header surface — bg-200 (recessed
            off-white) in light mode, bg-100 (elevated #0A0A0A) in
            dark mode — so the chip reads against either chrome. */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="grid size-7 place-items-center rounded-md border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-200)] text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)] md:hidden dark:bg-[color:var(--ds-background-100)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.75 4H1V5.5H1.75H14.25H15V4H14.25H1.75ZM1.75 10.5H1V12H1.75H14.25H15V10.5H14.25H1.75Z"
            />
          </svg>
        </button>
      </header>

      <MobileNavDrawer
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        featuredNews={featuredNews}
        featuredShoe={featuredShoe}
        featuredGear={featuredGear}
        featuredNutrition={featuredNutrition}
        featuredRace={featuredRace}
        newsletterSource={`${newsletterSource}_mobile`}
      />
    </>
  );
}
