"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Footprints,
  Mountain,
  Watch,
  Zap,
  Calendar,
  Database,
  Compass,
} from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";
import { cn } from "@/lib/utils";

// ============================================================================
// Types (mirrors the queries in /sanity/queries)
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
// Taxonomy
// ============================================================================

type CategoryItem = {
  label: string;
  href: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const topLevelLinks: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Road", href: "/articles/category/road" },
  { label: "Track", href: "/articles/category/track" },
  { label: "Trail", href: "/articles/category/trail" },
];

const gearLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Race-Day Shoes",
    href: "/gear/category/race-day-shoes",
    description: "Built for PR days",
    Icon: Footprints,
  },
  {
    label: "Daily Trainers",
    href: "/gear/category/daily-trainers",
    description: "Your go-to runners",
    Icon: Footprints,
  },
  {
    label: "Max Cushion",
    href: "/gear/category/max-cushion-shoes",
    description: "Plush for long miles",
    Icon: Footprints,
  },
  {
    label: "Tempo Shoes",
    href: "/gear/category/tempo-shoes",
    description: "Responsive and fast",
    Icon: Footprints,
  },
  {
    label: "Trail Shoes",
    href: "/gear/category/trail-shoes",
    description: "Off-road traction",
    Icon: Mountain,
  },
  {
    label: "GPS Watches",
    href: "/gear/category/gps-watches",
    description: "Track every run",
    Icon: Watch,
  },
  {
    label: "Nutrition",
    href: "/gear/category/nutrition",
    description: "Fuel for the miles",
    Icon: Zap,
  },
];

const raceLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Overview",
    href: "/races",
    description: "Browse race guides",
    Icon: Compass,
  },
  {
    label: "Calendar",
    href: "/races/calendar",
    description: "Upcoming races",
    Icon: Calendar,
  },
  {
    label: "Database",
    href: "/races/database",
    description: "Search every race",
    Icon: Database,
  },
];

// ============================================================================
// Top-level standalone link (no chevron) — shares trigger style
// ============================================================================

function TopLevelLink({ href, label }: { href: string; label: string }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        asChild
        className={cn(navigationMenuTriggerStyle(), "flex-row")}
      >
        <Link href={href}>{label}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

// ============================================================================
// Link row with icon — Vercel-style (icon square + heading + subtitle)
// ============================================================================

function IconRow({ item }: { item: CategoryItem }) {
  const { label, href, description, Icon } = item;
  return (
    <NavigationMenuLink
      asChild
      // className goes on NavigationMenuLink (not the inner Link) so
      // shadcn's internal cn() runs tailwind-merge and resolves
      // flex-col (shadcn default) vs flex-row (ours). The group/row
      // lets the icon square + description react to hover on the row
      // while the row itself keeps a transparent background.
      // hover:bg-transparent + focus:bg-transparent override shadcn's
      // default hover:bg-accent / focus:bg-accent so no grey pill
      // shows behind the row on hover or focus.
      className="group/row flex flex-row items-center gap-3 rounded-sm p-3 text-left hover:bg-transparent focus:bg-transparent"
    >
      <Link href={href}>
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-xs border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-900)] transition-colors group-hover/row:border-[color:var(--ds-gray-1000)] group-hover/row:bg-[color:var(--ds-gray-1000)] group-hover/row:text-[color:var(--ds-background-100)]"
        >
          <Icon className="size-4" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-[14px] leading-5 font-medium text-[color:var(--ds-gray-1000)]">
            {label}
          </span>
          <span className="text-[12px] leading-4 text-[color:var(--ds-gray-900)] transition-colors group-hover/row:text-[color:var(--ds-gray-1000)]">
            {description}
          </span>
        </span>
      </Link>
    </NavigationMenuLink>
  );
}

// ============================================================================
// Featured card — editorial/magazine pattern, no card chrome:
//   - 16:9 image at the top (hero)
//   - Eyebrow label below the image
//   - Article/race title as the prominent headline, arrow inline
//   - Subtle image zoom on hover + arrow slide; no bg change (the
//     column's bg-200 is doing the recessed-surface work now)
// ============================================================================

function FeaturedCard({
  href,
  image,
  label,
  title,
}: {
  href: string;
  image: SanityImageSource | null | undefined;
  label: string;
  title: string;
}) {
  return (
    <NavigationMenuLink
      asChild
      className="group/card block hover:bg-transparent focus:bg-transparent"
    >
      <Link href={href}>
        {/* Image (16:9) — sits on a gray-200 placeholder surface so
            missing/slow images don't blank out. overflow-hidden on
            the wrapper so the hover zoom doesn't spill. */}
        <div
          className="relative aspect-[16/9] w-full overflow-hidden rounded-xs border border-[color:var(--ds-gray-400)]"
          style={{ background: "var(--ds-gray-200)" }}
        >
          {image && (
            <Image
              src={urlFor(image).width(1000).height(563).url()}
              alt=""
              fill
              sizes="520px"
              className="transition-transform duration-300 ease-out group-hover/card:scale-[1.03]"
              style={{ objectFit: "cover" }}
            />
          )}
        </div>

        {/* Caption: eyebrow + title with inline arrow */}
        <div className="mt-3 flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--ds-gray-700)]">
            {label}
          </span>
          <h3 className="flex items-center gap-1.5 text-[16px] leading-[22px] font-semibold text-[color:var(--ds-gray-1000)]">
            <span className="min-w-0 flex-1 truncate">{title}</span>
            <ArrowRight
              aria-hidden
              className="size-4 shrink-0 text-[color:var(--ds-gray-900)] transition-transform duration-150 ease-out group-hover/card:translate-x-0.5"
            />
          </h3>
        </div>
      </Link>
    </NavigationMenuLink>
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
    <NavigationMenu>
      <NavigationMenuList>
        {/* Standalone top-level links */}
        {topLevelLinks.map((item) => (
          <TopLevelLink key={item.href} href={item.href} label={item.label} />
        ))}

        {/* Gear */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Gear</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <DropdownPanel
              heading="Gear"
              featured={
                featuredGear && (
                  <FeaturedCard
                    href={`/gear/${featuredGear.slug.current}`}
                    image={featuredGear.mainImage}
                    label="Featured Article"
                    title={featuredGear.title}
                  />
                )
              }
              items={gearLinks}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Races */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Races</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <DropdownPanel
              heading="Races"
              featured={
                featuredRace && (
                  <FeaturedCard
                    href={`/races/${featuredRace.slug.current}`}
                    image={featuredRace.mainImage}
                    label="Featured Race"
                    title={featuredRace.title}
                  />
                )
              }
              items={raceLinks}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ============================================================================
// Shared dropdown body — two full-bleed columns separated by a 1px
// divider. Links column sits on the elevated bg-100 (primary); the
// featured column sits on the recessed bg-200 (showcase surface).
// The viewport's outer border + radius wrap the whole thing.
// ============================================================================

function DropdownPanel({
  heading,
  featured,
  items,
}: {
  heading: string;
  featured: React.ReactNode;
  items: ReadonlyArray<CategoryItem>;
}) {
  return (
    <div className="grid w-[800px] grid-cols-3">
      {/* Links column — bg-200, right-bordered divider */}
      <div
        className="col-span-1 flex flex-col gap-0.5 border-r border-[color:var(--ds-gray-400)] p-2"
        style={{ background: "var(--ds-background-200)" }}
      >
        <h4 className="px-3 pt-2.5 pb-1 text-[14px] leading-5 font-normal text-[color:var(--ds-gray-900)]">
          {heading}
        </h4>
        {items.map((item) => (
          <IconRow key={item.href} item={item} />
        ))}
      </div>

      {/* Featured column — bg-100 showcase */}
      <div
        className="col-span-2 p-3"
        style={{ background: "var(--ds-background-100)" }}
      >
        {featured}
      </div>
    </div>
  );
}
