"use client";

// ============================================================================
// MobileNavDrawer
// ============================================================================
//
// Full-height right-side drawer for mobile navigation (below md). Two
// panes: a top-level list of section names (News / Shoes / Gear /
// Nutrition / Races), and a section-detail view with sub-items + the
// section's featured card. Tapping a section slides the inner pane
// left to reveal the detail; the back button slides it back.
//
// Drawer chrome: close button at the top, theme switcher + full-width
// newsletter button at the bottom. Wraps Sheet (Radix Dialog) for
// focus trap, ESC-to-close, and slide-in animation.

import {
  useEffect,
  useState,
  useContext,
  type ComponentType,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { NewsletterButton } from "@/components/ui/NewsletterModal";
import {
  type CategoryItem,
  newsLinks,
  shoeLinks,
  gearLinks,
  nutritionLinks,
  raceLinks,
  type FeaturedProduct,
  type FeaturedRace,
} from "@/components/ui/SiteNavigationMenu";

type SectionId = "news" | "shoes" | "gear" | "nutrition" | "races";

interface SectionDef {
  id: SectionId;
  label: string;
  items: ReadonlyArray<CategoryItem>;
  featured: FeaturedProduct | FeaturedRace;
  featuredHref?: string;
}

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featuredNews: FeaturedProduct;
  featuredShoe: FeaturedProduct;
  featuredGear: FeaturedProduct;
  featuredNutrition: FeaturedProduct;
  featuredRace: FeaturedRace;
  newsletterSource?: string;
}

// ============================================================================
// Keyframes — injected once. We bypass tailwindcss-animate here
// because its `slide-in-from-right` was rendering as a centred
// fade / scale in this project, likely a variant-ordering issue.
// Doing this inline lets us own the easing + duration directly.
// ============================================================================

const KEYFRAMES_ID = "mobile-nav-drawer-keyframes";

function ensureKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes mobile-drawer-slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes mobile-drawer-slide-out {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
    @keyframes mobile-drawer-overlay-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes mobile-drawer-overlay-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    [data-mobile-drawer-overlay][data-state="open"] {
      animation: mobile-drawer-overlay-fade-in 500ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    [data-mobile-drawer-overlay][data-state="closed"] {
      animation: mobile-drawer-overlay-fade-out 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    [data-mobile-drawer-content][data-state="open"] {
      animation: mobile-drawer-slide-in 500ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    [data-mobile-drawer-content][data-state="closed"] {
      animation: mobile-drawer-slide-out 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// Drawer
// ============================================================================

export default function MobileNavDrawer({
  open,
  onOpenChange,
  featuredNews,
  featuredShoe,
  featuredGear,
  featuredNutrition,
  featuredRace,
  newsletterSource = "site_header_mobile",
}: MobileNavDrawerProps) {
  const { theme, setTheme } = useContext(DarkModeContext);

  useEffect(() => {
    ensureKeyframes();
  }, []);

  const sections: ReadonlyArray<SectionDef> = [
    {
      id: "news",
      label: "News",
      items: newsLinks,
      featured: featuredNews,
      featuredHref: featuredNews
        ? `/articles/post/${featuredNews.slug.current}`
        : undefined,
    },
    {
      id: "shoes",
      label: "Shoes",
      items: shoeLinks,
      featured: featuredShoe,
      featuredHref: featuredShoe
        ? `/shoes/${featuredShoe.slug.current}`
        : undefined,
    },
    {
      id: "gear",
      label: "Gear",
      items: gearLinks,
      featured: featuredGear,
      featuredHref: featuredGear
        ? `/gear/${featuredGear.slug.current}`
        : undefined,
    },
    {
      id: "nutrition",
      label: "Nutrition",
      items: nutritionLinks,
      featured: featuredNutrition,
      featuredHref: featuredNutrition
        ? `/nutrition/${featuredNutrition.slug.current}`
        : undefined,
    },
    {
      id: "races",
      label: "Races",
      items: raceLinks,
      featured: featuredRace,
      featuredHref: featuredRace
        ? `/races/${featuredRace.slug.current}`
        : undefined,
    },
  ];

  // activeSection: which section is currently shown (right pane).
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  // Reset to top view AFTER the drawer slide-out finishes (300 ms,
  // matching the slide-out keyframe). If we reset immediately the
  // section pane would snap back to the top pane mid-animation,
  // making the close look like only the submenu closed.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setActiveSection(null), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const closeAndReset = () => {
    onOpenChange(false);
  };

  const sectionOnDisplay = sections.find((s) => s.id === activeSection);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay + drawer both start 50 px from the top so the
            sticky header stays visible while the drawer is open —
            matches v0's behaviour. Animations are wired through the
            data-mobile-drawer-* selectors defined in ensureKeyframes
            (500 ms slide in, 300 ms slide out, both cubic-bezier
            (0.4, 0, 0.2, 1)). */}
        <Dialog.Overlay
          data-mobile-drawer-overlay
          className="fixed inset-x-0 bottom-0 top-[50px] z-[99]"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        />
        <Dialog.Content
          data-mobile-drawer-content
          // The hamburger button in SiteHeader sits outside this
          // Dialog.Content. Without this filter, tapping it would
          // trigger Radix's outside-pointer-down handler which calls
          // onOpenChange(false) — and the same tap would also fire
          // our toggle, flipping the drawer back open. Filtering by
          // data-mobile-nav-toggle lets the toggle button own the
          // open/close transition cleanly.
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement | null;
            if (target?.closest("[data-mobile-nav-toggle]")) {
              e.preventDefault();
            }
          }}
          className="fixed bottom-0 right-0 top-[50px] z-[100] flex w-full flex-col bg-[color:var(--ds-background-100)] shadow-[var(--ds-shadow-modal)] outline-none"
        >
          {/* a11y: required by Radix Dialog */}
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Browse Distanz Running by section: News, Shoes, Gear,
            Nutrition, and Races.
          </Dialog.Description>

          {/* No internal drawer header — the sticky site header above
              owns the wordmark + the (now toggling) hamburger button.
              Closing the drawer happens via the hamburger, ESC, or
              clicking the overlay. */}

          {/* Body — two panes (top + section). Instant swap, no
              transform animation between them. */}
          <div className="relative flex-1 overflow-hidden">
            <div
              className="flex h-full"
              style={{
                width: "200%",
                transform: activeSection
                  ? "translateX(-50%)"
                  : "translateX(0)",
              }}
            >
              {/* Top pane — newsletter CTA + section list. Outer p-4
                  matches v0's drawer body padding, then a centred
                  max-w-md column constrains the content on wider
                  drawer widths (e.g. landscape phones). */}
              <div className="h-full w-1/2 shrink-0 overflow-y-auto p-4">
                <div className="mx-auto flex w-full max-w-md flex-col">
                  {/* Newsletter button + 16 px bottom gap before the list */}
                  <div className="flex flex-col gap-2 pb-4">
                    <NewsletterButton
                      size="small"
                      source={newsletterSource}
                      className="w-full !h-8 !rounded-[4px] !text-[14px] !leading-5"
                    />
                  </div>
                  {/* Section rows — match v0's mobile menu items:
                      text-base / 24 in gray-900, rounded-lg, px-3 py-2 */}
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveSection(s.id)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-base text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)]"
                    >
                      <span>{s.label}</span>
                      <ChevronRight
                        className="size-4 text-[color:var(--ds-gray-700)]"
                        aria-hidden
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Section pane — sub-items + featured card */}
              <div className="h-full w-1/2 shrink-0 overflow-y-auto">
                {sectionOnDisplay && (
                  <SectionDetail
                    section={sectionOnDisplay}
                    onBack={() => setActiveSection(null)}
                    onLinkClick={closeAndReset}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer — just the theme switcher row now that the
              newsletter CTA has moved up to the top pane. */}
          <div className="flex items-center justify-end gap-2 border-t border-[color:var(--ds-gray-400)] px-5 py-4">
            <span className="text-[13px] leading-5 text-[color:var(--ds-gray-700)]">
              Theme
            </span>
            <ThemeSwitcher
              showSystem={false}
              value={theme === "system" ? "light" : theme}
              onChange={setTheme}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ============================================================================
// Section detail pane
// ============================================================================

function SectionDetail({
  section,
  onBack,
  onLinkClick,
}: {
  section: SectionDef;
  onBack: () => void;
  onLinkClick: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col">
      {/* Back row + sub-items share the same max-w-md column +
          padding, so the back button and section title sit on the
          same horizontal grid as the list items below. The whole
          back row is tappable. */}
      <div className="mx-auto flex w-full max-w-md flex-col p-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to all sections"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-base text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span className="font-medium text-[color:var(--ds-gray-1000)]">
            {section.label}
          </span>
        </button>
        {section.items.map((item) => (
          <MobileSubItem
            key={item.href}
            item={item}
            onClick={onLinkClick}
          />
        ))}
      </div>

      {/* Featured card — pinned to the bottom of the pane */}
      {section.featured && section.featuredHref && (
        <div className="mt-auto border-t border-[color:var(--ds-gray-400)] p-4">
          <div className="mx-auto w-full max-w-md">
            <MobileFeaturedCard
              href={section.featuredHref}
              image={section.featured.mainImage}
              title={section.featured.title}
              onClick={onLinkClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MobileSubItem({
  item,
  onClick,
}: {
  item: CategoryItem;
  onClick: () => void;
}) {
  // Mobile sub-items drop the icon box + description and render
  // just the label, matching v0's flat list pattern. Same row
  // anatomy as the top-pane section rows for visual continuity.
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="flex items-center rounded-lg px-3 py-2 text-base text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)]"
    >
      <span>{item.label}</span>
    </Link>
  );
}

// ============================================================================
// Featured card (mobile)
// ============================================================================

function MobileFeaturedCard({
  href,
  image,
  title,
  onClick,
}: {
  href: string;
  image: SanityImageSource | null | undefined;
  title: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group/card relative block w-full overflow-hidden rounded-lg"
      style={{
        background: "var(--ds-gray-200)",
        aspectRatio: "16 / 9",
      }}
    >
      {image && (
        <Image
          src={urlFor(image).width(1200).height(675).url()}
          alt=""
          fill
          sizes="100vw"
          className="transition-transform duration-300 ease-out group-hover/card:scale-[1.02]"
          style={{ objectFit: "cover" }}
        />
      )}

      {/* Top-down scrim so the overlay caption reads cleanly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0) 65%)",
        }}
      />

      <div className="absolute inset-x-0 top-0 flex items-start gap-3 p-4">
        <div className="min-w-0 flex-1">
          <span className="text-[12px] leading-4 font-medium text-white/90">
            Featured
          </span>
          <h3
            className="mt-1 text-[18px] leading-[22px] font-[550] text-white"
            style={{ letterSpacing: "-0.005em" }}
          >
            <span className="line-clamp-2">{title}</span>
          </h3>
        </div>
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md"
        >
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

export type {
  ComponentType,
};
