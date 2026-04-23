"use client";

import Link from "next/link";
import Image from "next/image";
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
// Taxonomy (extracted verbatim from the old NavbarAlt)
// ============================================================================

const topLevelLinks: ReadonlyArray<{ label: string; href: string }> = [
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
// Top-level standalone link — matches trigger style minus the chevron
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
// Simple category row (icon-less, text-only)
// ============================================================================

function CategoryRow({ href, label }: { href: string; label: string }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="flex items-center rounded-sm px-3 py-2 text-base font-medium text-[color:var(--ds-gray-900)] transition-colors hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)]"
      >
        {label}
      </Link>
    </NavigationMenuLink>
  );
}

// ============================================================================
// Featured card (used in Gear + Races dropdowns)
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
        className="group/card relative flex flex-col overflow-hidden rounded-md border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] p-3 transition-all hover:bg-[color:var(--ds-gray-100)] hover:shadow-sm"
      >
        <div
          className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-sm"
          style={{ background: "var(--ds-gray-200)" }}
        >
          {image && (
            <Image
              src={urlFor(image).width(520).height(390).url()}
              alt=""
              fill
              sizes="220px"
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--ds-gray-700)]">
          {eyebrow}
        </span>
        <span className="mt-0.5 text-base font-semibold leading-tight text-[color:var(--ds-gray-1000)]">
          {title}
        </span>
        {meta && (
          <span className="mt-0.5 text-sm text-[color:var(--ds-gray-700)]">
            {meta}
          </span>
        )}
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
    <NavigationMenu viewport={false} className="max-w-none">
      <NavigationMenuList>
        {/* Top-level standalone links */}
        {topLevelLinks.map((item) => (
          <TopLevelLink key={item.href} href={item.href} label={item.label} />
        ))}

        {/* Gear */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Gear</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[440px] grid-cols-1 gap-3 p-1 md:grid-cols-[1fr_180px]">
              <div className="flex flex-col gap-0.5">
                {gearLinks.map((item) => (
                  <CategoryRow
                    key={item.href}
                    href={item.href}
                    label={item.label}
                  />
                ))}
              </div>
              {featuredGear && (
                <FeaturedCard
                  href={`/gear/${featuredGear.slug.current}`}
                  image={featuredGear.mainImage}
                  eyebrow="Featured"
                  title={featuredGear.title}
                  meta={featuredGear.excerpt}
                />
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Races */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Races</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[440px] grid-cols-1 gap-3 p-1 md:grid-cols-[1fr_180px]">
              <div className="flex flex-col gap-0.5">
                {raceLinks.map((item) => (
                  <CategoryRow
                    key={item.href}
                    href={item.href}
                    label={item.label}
                  />
                ))}
              </div>
              {featuredRace && (
                <FeaturedCard
                  href={`/races/${featuredRace.slug.current}`}
                  image={featuredRace.mainImage}
                  eyebrow="Featured"
                  title={featuredRace.title}
                  meta={[featuredRace.location, featuredRace.eventDate]
                    .filter(Boolean)
                    .join(" · ")}
                />
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
