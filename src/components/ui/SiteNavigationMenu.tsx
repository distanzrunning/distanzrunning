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
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="flex items-center gap-3 rounded-sm px-3 py-2 transition-colors hover:bg-[color:var(--ds-gray-100)]"
      >
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-xs border border-[color:var(--ds-gray-400)] text-[color:var(--ds-gray-900)]"
        >
          <Icon className="size-4" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-[14px] leading-5 font-medium text-[color:var(--ds-gray-1000)]">
            {label}
          </span>
          <span className="text-xs leading-4 text-[color:var(--ds-gray-700)]">
            {description}
          </span>
        </span>
      </Link>
    </NavigationMenuLink>
  );
}

// ============================================================================
// Featured card (2/3 width, left column) — v0-inspired editorial card
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
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="group/card relative flex flex-col overflow-hidden rounded-sm border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-200)] p-3 transition-all hover:bg-[color:var(--ds-gray-100)] hover:shadow-sm"
      >
        {/* Top: heading + arrow */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--ds-gray-700)]">
              {eyebrow}
            </span>
            <h3 className="text-[14px] leading-5 font-semibold text-[color:var(--ds-gray-1000)]">
              {title}
            </h3>
            {meta && (
              <p className="text-xs leading-4 text-[color:var(--ds-gray-700)]">
                {meta}
              </p>
            )}
          </div>
          <span
            aria-hidden
            className="grid size-6 shrink-0 place-items-center rounded-full bg-[color:var(--ds-gray-200)] text-[color:var(--ds-gray-900)] transition-all group-hover/card:translate-x-0.5 group-hover/card:bg-[color:var(--ds-gray-300)]"
          >
            <ArrowRight className="size-3.5" />
          </span>
        </div>

        {/* Image */}
        <div
          className="relative h-[140px] w-full overflow-hidden rounded-xs border border-[color:var(--ds-gray-400)]"
          style={{ background: "var(--ds-gray-200)" }}
        >
          {image && (
            <Image
              src={urlFor(image).width(720).height(420).url()}
              alt=""
              fill
              sizes="360px"
              style={{ objectFit: "cover" }}
            />
          )}
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
    <NavigationMenu className="max-w-none">
      <NavigationMenuList>
        {/* Standalone top-level links */}
        {topLevelLinks.map((item) => (
          <TopLevelLink key={item.href} href={item.href} label={item.label} />
        ))}

        {/* Gear */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Gear</NavigationMenuTrigger>
          <NavigationMenuContent>
            <DropdownPanel
              featured={
                featuredGear && (
                  <FeaturedCard
                    href={`/gear/${featuredGear.slug.current}`}
                    image={featuredGear.mainImage}
                    eyebrow="Featured gear"
                    title={featuredGear.title}
                    meta={featuredGear.excerpt}
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
          <NavigationMenuContent>
            <DropdownPanel
              featured={
                featuredRace && (
                  <FeaturedCard
                    href={`/races/${featuredRace.slug.current}`}
                    image={featuredRace.mainImage}
                    eyebrow="Featured race"
                    title={featuredRace.title}
                    meta={[featuredRace.location, featuredRace.eventDate]
                      .filter(Boolean)
                      .join(" · ")}
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
// Shared dropdown body: featured 2/3 left, link list 1/3 right
// ============================================================================

function DropdownPanel({
  featured,
  items,
}: {
  featured: React.ReactNode;
  items: ReadonlyArray<CategoryItem>;
}) {
  return (
    <div className="grid w-[560px] grid-cols-3 gap-3 p-2">
      <div className="col-span-2">{featured}</div>
      <div className="col-span-1 flex flex-col gap-0.5">
        {items.map((item) => (
          <IconRow key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}
