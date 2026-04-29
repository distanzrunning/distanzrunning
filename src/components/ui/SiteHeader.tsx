"use client";

import { useContext, useEffect, useState } from "react";
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
// row right.
//
// Sticky to the viewport top with z-40 so page content scrolls under
// it. A 1 px bottom border baselines as transparent and fades to
// --ds-gray-400 on scroll (matching v0's pattern) — gives a clear
// affordance that the header is fixed and separates it from the
// content scrolling below without painting a hairline at rest.
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
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position so the sticky header's bottom border can
  // fade in once content has been scrolled under it. Threshold of 0
  // matches v0 — the border appears as soon as you start scrolling.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 flex h-[50px] w-full shrink-0 items-center justify-between border-b bg-[color:var(--ds-background-100)] px-3 transition-colors duration-150 sm:px-2 dark:bg-[color:var(--ds-background-200)] ${
          scrolled
            ? "border-[color:var(--ds-gray-400)]"
            : "border-transparent"
        }`}
      >
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

        {/* Right (mobile only): hamburger ↔ close toggle. 28 px
            square with rounded-md + hairline border. Interior is
            the alternate of the header surface (bg-200 light, bg-100
            dark) so the chip reads against either chrome. The icon
            swaps to an X glyph while the drawer is open so the
            close affordance is obvious. */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          data-mobile-nav-toggle
          onClick={() => setMobileOpen((prev) => !prev)}
          className="pointer-events-auto relative z-[101] grid size-7 place-items-center rounded-md border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-200)] text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)] md:hidden dark:bg-[color:var(--ds-background-100)] dark:hover:bg-[color:var(--ds-gray-100)]"
        >
          {mobileOpen ? (
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
                d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
              />
            </svg>
          ) : (
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
          )}
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
