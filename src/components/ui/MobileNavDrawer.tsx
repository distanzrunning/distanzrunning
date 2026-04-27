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
import { ChevronRight, ArrowLeft, ArrowRight, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { DarkModeContext } from "@/components/DarkModeProvider";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { NewsletterButton } from "@/components/ui/NewsletterModal";
import Wordmark from "@/components/ui/Wordmark";
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
  // displayedSection: lags activeSection during slide-back so the
  // outgoing pane stays mounted while the slide animates.
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [displayedSection, setDisplayedSection] = useState<SectionId | null>(
    null,
  );

  useEffect(() => {
    if (activeSection) {
      setDisplayedSection(activeSection);
      return;
    }
    const t = setTimeout(() => setDisplayedSection(null), 300);
    return () => clearTimeout(t);
  }, [activeSection]);

  // Reset to top view whenever the drawer closes/opens fresh.
  useEffect(() => {
    if (!open) {
      setActiveSection(null);
    }
  }, [open]);

  const closeAndReset = () => {
    onOpenChange(false);
  };

  const sectionOnDisplay = sections.find(
    (s) => s.id === displayedSection,
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[99] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-[100] flex w-full flex-col bg-[color:var(--ds-background-100)] shadow-[var(--ds-shadow-modal)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
          style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
        >
          {/* a11y: required by Radix Dialog */}
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Browse Distanz Running by section: News, Shoes, Gear,
            Nutrition, and Races.
          </Dialog.Description>

          {/* Drawer header — wordmark left, close button right */}
          <div className="flex h-[50px] items-center justify-between border-b border-[color:var(--ds-gray-400)] px-3">
            <Link
              href="/"
              aria-label="Distanz Running — home"
              className="inline-flex h-10 items-center px-1 text-[color:var(--ds-gray-1000)]"
              onClick={closeAndReset}
            >
              <Wordmark className="h-6 w-auto" />
            </Link>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="grid size-7 place-items-center rounded-md bg-[color:var(--ds-background-200)] text-[color:var(--ds-gray-1000)] transition-colors hover:bg-[color:var(--ds-gray-100)]"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Body — two-pane slide */}
          <div className="relative flex-1 overflow-hidden">
            <div
              className="flex h-full transition-transform duration-300 ease-out"
              style={{
                width: "200%",
                transform: activeSection
                  ? "translateX(-50%)"
                  : "translateX(0)",
              }}
            >
              {/* Top pane — section list */}
              <div className="h-full w-1/2 shrink-0 overflow-y-auto">
                <ul className="flex flex-col">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setActiveSection(s.id)}
                        className="flex w-full items-center justify-between border-b border-[color:var(--ds-gray-400)] px-5 py-5 text-left transition-colors hover:bg-[color:var(--ds-gray-100)]"
                      >
                        <span className="text-[18px] leading-6 font-medium text-[color:var(--ds-gray-1000)]">
                          {s.label}
                        </span>
                        <ChevronRight
                          className="size-5 text-[color:var(--ds-gray-700)]"
                          aria-hidden
                        />
                      </button>
                    </li>
                  ))}
                </ul>
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

          {/* Footer — theme switcher + full-width newsletter button */}
          <div className="flex flex-col gap-3 border-t border-[color:var(--ds-gray-400)] px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] leading-5 text-[color:var(--ds-gray-700)]">
                Theme
              </span>
              <ThemeSwitcher
                showSystem={false}
                value={theme === "system" ? "light" : theme}
                onChange={setTheme}
              />
            </div>
            <NewsletterButton
              size="large"
              source={newsletterSource}
              className="w-full"
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
      {/* Detail header — back button + section title */}
      <div className="flex items-center gap-2 border-b border-[color:var(--ds-gray-400)] px-3 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to all sections"
          className="grid size-9 place-items-center rounded-md text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)]"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-[18px] leading-6 font-medium text-[color:var(--ds-gray-1000)]">
          {section.label}
        </h2>
      </div>

      {/* Sub-item list */}
      <ul className="flex flex-col">
        {section.items.map((item) => (
          <li key={item.href}>
            <MobileSubItem item={item} onClick={onLinkClick} />
          </li>
        ))}
      </ul>

      {/* Featured card — pinned to the bottom of the pane */}
      {section.featured && section.featuredHref && (
        <div className="mt-auto border-t border-[color:var(--ds-gray-400)] p-4">
          <MobileFeaturedCard
            href={section.featuredHref}
            image={section.featured.mainImage}
            title={section.featured.title}
            onClick={onLinkClick}
          />
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
  const { label, href, description, Icon } = item;
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 border-b border-[color:var(--ds-gray-400)] px-5 py-4 transition-colors hover:bg-[color:var(--ds-gray-100)]"
    >
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-xs border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-900)]"
      >
        <Icon className="size-5 stroke-[1.5]" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[16px] leading-6 font-medium text-[color:var(--ds-gray-1000)]">
          {label}
        </span>
        <span className="text-[13px] leading-5 text-[color:var(--ds-gray-700)]">
          {description}
        </span>
      </span>
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
