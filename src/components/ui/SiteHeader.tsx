"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Search as SearchIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import {
  NewsletterModal,
  preloadNewsletterHero,
} from "@/components/ui/NewsletterModal";
import SiteNavigationMenu, {
  type FeaturedProduct,
  type FeaturedRace,
} from "@/components/ui/SiteNavigationMenu";
import MobileNavDrawer from "@/components/ui/MobileNavDrawer";
import Wordmark from "@/components/ui/Wordmark";
import { useSearch } from "@/contexts/SearchContext";

// ============================================================================
// SiteHeader
// ============================================================================
//
// Public-site header rendered as a Frontify-style warm floating pill: a
// fixed 72 px-tall capsule that floats above the page with a 64 px outer
// gutter and a translucent warm fill backed by a backdrop blur. The pill
// has no bottom rule — separation from page content comes from the
// floating geometry and translucent surface, not a hairline.
//
// Wordmark sits left, primary nav is absolutely centred in the pill so
// it stays geometrically centred regardless of the action cluster's
// width, and the right group hosts the search IconButton + Newsletter
// CTA on desktop alongside the mobile hamburger (md:hidden) — both live
// inside the pill so the chrome reads as a single floating element on
// every breakpoint.

export interface SiteHeaderProps {
  featuredNews: FeaturedProduct;
  featuredShoe: FeaturedProduct;
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
  featuredNutrition,
  featuredRace,
  newsletterSource = "site_header",
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openSearch } = useSearch();
  // True while any desktop nav megamenu is open. Drives the glassy
  // page-dim overlay rendered below the header so the menu's
  // contents read against busy page content (images, dense grids).
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  // Newsletter modal state lives at the header level so the modal
  // can outlive both the desktop trigger and the mobile drawer —
  // the drawer can close itself before the modal appears, so the
  // user only ever sees one overlay at a time.
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterEventSource, setNewsletterEventSource] =
    useState(newsletterSource);

  const openNewsletter = useCallback(
    (source: string, options?: { fromMobileDrawer?: boolean }) => {
      try {
        posthog.capture("newsletter_modal_opened", { location: source });
      } catch {
        // PostHog may not be loaded yet (consent not granted) — ignore.
      }
      setNewsletterEventSource(source);
      if (options?.fromMobileDrawer) setMobileOpen(false);
      setNewsletterOpen(true);
    },
    [],
  );

  // Scroll-position state retained for future use (e.g. animating the
  // pill's elevation or opacity once content scrolls under it). It no
  // longer drives className — the floating pill has no rest/scrolled
  // border state to toggle.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K shortcut + Dialog are owned by SearchProvider —
  // see src/contexts/SearchContext.tsx.

  return (
    <>
      {/* Outer wrapper: fixed, full-bleed, with a 64 px gutter on each
          side (Frontify spec). pointer-events-none keeps the gutter
          transparent to clicks so page content beneath the floating
          pill stays interactive in those margins. */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-40 px-16">
        {/* The pill: max-width capped, centred, re-enables pointer
            events for its own surface. h-[72px] + p-4 + rounded-[8px]
            matches the Frontify reference; warm translucent fill +
            blur(20px) gives the glassy capsule effect. Starting blur
            radius is intentionally moderate (20 px) — easy to tune
            up toward Frontify's blur(200px) once we calibrate. */}
        <header
          className="pointer-events-auto relative mx-auto flex h-[72px] max-w-[1600px] items-center justify-between rounded-[8px] bg-[rgba(240,240,235,0.8)] p-4 [backdrop-filter:blur(20px)] [-webkit-backdrop-filter:blur(20px)]"
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
              the row is geometrically centred on the pill, independent
              of the wordmark + action-row widths. inset-0 (not just
              inset-x-0) + items-center reliably centres the nav
              vertically; without those the absolute wrapper inherits a
              "static position" inside the flex container that browsers
              resolve to the top edge, leaving the nav a few pixels
              higher than the wordmark / right cluster. */}
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
            <div className="pointer-events-auto">
              <SiteNavigationMenu
                featuredNews={featuredNews}
                featuredShoe={featuredShoe}
                featuredNutrition={featuredNutrition}
                featuredRace={featuredRace}
                onValueChange={(v) => setNavMenuOpen(Boolean(v))}
              />
            </div>
          </div>

          {/* Right: action cluster. Desktop shows search + Newsletter;
              mobile shows the hamburger ↔ X toggle. Both live in the
              same flex group so spacing inside the pill stays uniform
              across breakpoints. */}
          <div className="flex items-center gap-2">
            {/* Desktop: search utility + newsletter primary CTA.
                Theme switcher lives in the footer (set-once preference
                doesn't deserve top-of-page real estate). */}
            <div className="hidden items-center gap-2 md:flex">
              <IconButton
                variant="tertiary"
                size="small"
                aria-label="Open search"
                title="Search (⌘K)"
                onClick={openSearch}
              >
                <SearchIcon className="size-4" />
              </IconButton>
              <Button
                size="small"
                onClick={() => openNewsletter(newsletterSource)}
                onMouseEnter={preloadNewsletterHero}
                onFocus={preloadNewsletterHero}
                data-attr="newsletter-modal-open"
              >
                Newsletter
              </Button>
            </div>

            {/* Mobile: hamburger ↔ close toggle. 28 px square with
                rounded-md + hairline border. Interior is the alternate
                of the header surface (bg-200 light, bg-100 dark) so the
                chip reads against either chrome. The icon swaps to an X
                glyph while the drawer is open so the close affordance
                is obvious. */}
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
          </div>
        </header>
      </div>

      {/* Page-dim + glassy blur behind any open desktop megamenu.
          Starts at top: 50 px so the header itself stays sharp;
          z-30 sits between page content and the menu viewport
          (z-50 in NavigationMenu). pointer-events: none so the
          overlay never intercepts clicks — Radix handles outside-
          click detection itself. */}
      <div
        aria-hidden
        className="fixed inset-x-0 bottom-0 top-[50px] z-30 transition-opacity duration-150"
        style={{
          backgroundColor: "var(--ds-overlay-backdrop-color)",
          opacity: navMenuOpen ? 0.5 : 0,
          backdropFilter: navMenuOpen ? "blur(12px)" : "none",
          WebkitBackdropFilter: navMenuOpen ? "blur(12px)" : "none",
          pointerEvents: "none",
        }}
      />

      <MobileNavDrawer
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        featuredNews={featuredNews}
        featuredShoe={featuredShoe}
        featuredNutrition={featuredNutrition}
        featuredRace={featuredRace}
        onOpenNewsletter={() =>
          openNewsletter(`${newsletterSource}_mobile`, {
            fromMobileDrawer: true,
          })
        }
      />

      <NewsletterModal
        isOpen={newsletterOpen}
        onClose={() => setNewsletterOpen(false)}
        source={newsletterEventSource}
      />
    </>
  );
}
