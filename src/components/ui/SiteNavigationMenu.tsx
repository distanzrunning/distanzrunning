"use client";

import Link from "next/link";
import Image from "next/image";
import { NavigationMenu } from "@base-ui-components/react/navigation-menu";
import { ChevronDown } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// ============================================================================
// Types
// ============================================================================

type SanitySlug = { current: string };

export type FeaturedGear = {
  title: string;
  slug: SanitySlug;
  mainImage?: SanityImageSource | null;
  excerpt?: string;
} | null;

export type FeaturedRace = {
  title: string;
  slug: SanitySlug;
  mainImage?: SanityImageSource | null;
  eventDate?: string;
  location?: string;
} | null;

export interface SiteNavigationMenuProps {
  featuredGear: FeaturedGear;
  featuredRace: FeaturedRace;
}

// ============================================================================
// Nav item definitions (mirrors the previous NavbarAlt taxonomy)
// ============================================================================

const articleLinks: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Road", href: "/articles/category/road" },
  { label: "Track", href: "/articles/category/track" },
  { label: "Trail", href: "/articles/category/trail" },
];

const gearLinks: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Race-Day Shoes", href: "/gear/category/race-day-shoes" },
  { label: "Daily Trainers", href: "/gear/category/daily-trainers" },
  { label: "Max Cushion Shoes", href: "/gear/category/max-cushion-shoes" },
  { label: "Tempo Shoes", href: "/gear/category/tempo-shoes" },
  { label: "Trail Shoes", href: "/gear/category/trail-shoes" },
  { label: "GPS Watches", href: "/gear/category/gps-watches" },
  { label: "Nutrition", href: "/gear/category/nutrition" },
];

const raceLinks: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Overview", href: "/races" },
  { label: "Calendar", href: "/races/calendar" },
  { label: "Database", href: "/races/database" },
];

// ============================================================================
// Shared style tokens for menu surfaces
// ============================================================================

const triggerClass =
  "group inline-flex h-8 items-center gap-1 rounded-md px-3 text-sm font-medium text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)] data-[popup-open]:bg-[color:var(--ds-gray-100)] data-[popup-open]:text-[color:var(--ds-gray-1000)] focus-visible:outline-2 focus-visible:outline-[color:var(--ds-gray-alpha-600)] focus-visible:outline-offset-2";

const linkRowClass =
  "flex items-center rounded-md px-3 py-2 text-sm text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)]";

// ============================================================================
// Column-style link list used inside a dropdown
// ============================================================================

function LinkList({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div className="flex min-w-[200px] flex-col gap-0.5">
      <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--ds-gray-700)]">
        {title}
      </div>
      {items.map((item) => (
        <NavigationMenu.Link
          key={item.href}
          render={
            <Link href={item.href} className={linkRowClass}>
              {item.label}
            </Link>
          }
        />
      ))}
    </div>
  );
}

// ============================================================================
// Featured item card (used in Gear + Races dropdowns)
// ============================================================================

function FeaturedCard({
  href,
  image,
  eyebrow,
  title,
  meta,
}: {
  href: string;
  image: SanityImageSource | null | undefined;
  eyebrow: string;
  title: string;
  meta?: string;
}) {
  return (
    <NavigationMenu.Link
      render={
        <Link
          href={href}
          className="group flex w-[260px] flex-col overflow-hidden rounded-lg border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] transition-colors hover:bg-[color:var(--ds-gray-100)]"
        >
          <div
            className="relative aspect-[4/3] w-full"
            style={{ background: "var(--ds-gray-200)" }}
          >
            {image && (
              <Image
                src={urlFor(image).width(520).height(390).url()}
                alt=""
                fill
                sizes="260px"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
          <div className="flex flex-col gap-1 p-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--ds-gray-700)]">
              {eyebrow}
            </span>
            <span className="text-sm font-medium leading-tight text-[color:var(--ds-gray-1000)]">
              {title}
            </span>
            {meta && (
              <span className="text-xs text-[color:var(--ds-gray-700)]">
                {meta}
              </span>
            )}
          </div>
        </Link>
      }
    />
  );
}

// ============================================================================
// Main
// ============================================================================

export default function SiteNavigationMenu({
  featuredGear,
  featuredRace,
}: SiteNavigationMenuProps) {
  return (
    <NavigationMenu.Root className="relative flex items-center">
      <NavigationMenu.List className="flex items-center gap-1 m-0 p-0 list-none">
        {/* Articles */}
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClass}>
            Articles
            <ChevronDown
              className="size-3 transition-transform duration-150 group-data-[popup-open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="p-4">
            <LinkList title="Surfaces" items={articleLinks} />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {/* Gear */}
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClass}>
            Gear
            <ChevronDown
              className="size-3 transition-transform duration-150 group-data-[popup-open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="flex gap-6 p-4">
            <LinkList title="Categories" items={gearLinks} />
            {featuredGear && (
              <FeaturedCard
                href={`/gear/${featuredGear.slug.current}`}
                image={featuredGear.mainImage}
                eyebrow="Featured gear"
                title={featuredGear.title}
                meta={featuredGear.excerpt}
              />
            )}
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {/* Races */}
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClass}>
            Races
            <ChevronDown
              className="size-3 transition-transform duration-150 group-data-[popup-open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="flex gap-6 p-4">
            <LinkList title="Browse" items={raceLinks} />
            {featuredRace && (
              <FeaturedCard
                href={`/races/${featuredRace.slug.current}`}
                image={featuredRace.mainImage}
                eyebrow="Featured race"
                title={featuredRace.title}
                meta={[featuredRace.location, featuredRace.eventDate]
                  .filter(Boolean)
                  .join(" · ")}
              />
            )}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          className="z-50 box-border"
          sideOffset={8}
          collisionPadding={16}
        >
          <NavigationMenu.Popup
            className="overflow-hidden rounded-lg border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] shadow-[var(--ds-shadow-menu)]"
          >
            <NavigationMenu.Viewport className="relative" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
