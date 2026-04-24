"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  TbRoad,
  TbArrowCapsule,
  TbMountain,
  TbFlag2,
  TbCalendar,
  TbCloud,
  TbStopwatch,
  TbDeviceWatch,
  TbHeadphones,
  TbShirt,
  TbBatteryCharging,
  TbBottle,
  TbFlag,
  TbCalendarEvent,
  TbDatabase,
} from "react-icons/tb";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu";

// ============================================================================
// Types (mirrors the queries in /sanity/queries)
// ============================================================================

type SanitySlug = { current: string };

export type FeaturedProduct = {
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
  featuredNews: FeaturedProduct;
  featuredShoe: FeaturedProduct;
  featuredGear: FeaturedProduct;
  featuredNutrition: FeaturedProduct;
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

const newsLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Road",
    href: "/articles/category/road",
    description: "Marathon and road racing",
    Icon: TbRoad,
  },
  {
    label: "Track",
    href: "/articles/category/track",
    description: "From 100m to 10,000m",
    Icon: TbArrowCapsule,
  },
  {
    label: "Trail",
    href: "/articles/category/trail",
    description: "Mountain and ultra racing",
    Icon: TbMountain,
  },
];

const shoeLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Race-Day Shoes",
    href: "/shoes/category/race-day-shoes",
    description: "Built for PR days",
    Icon: TbFlag2,
  },
  {
    label: "Daily Trainers",
    href: "/shoes/category/daily-trainers",
    description: "Your go-to runners",
    Icon: TbCalendar,
  },
  {
    label: "Max Cushion",
    href: "/shoes/category/max-cushion",
    description: "Plush for long miles",
    Icon: TbCloud,
  },
  {
    label: "Tempo Shoes",
    href: "/shoes/category/tempo-shoes",
    description: "Responsive and fast",
    Icon: TbStopwatch,
  },
  {
    label: "Trail Shoes",
    href: "/shoes/category/trail-shoes",
    description: "Off-road traction",
    Icon: TbMountain,
  },
];

const gearLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Watches",
    href: "/gear/category/watches",
    description: "Track every run",
    Icon: TbDeviceWatch,
  },
  {
    label: "Headphones",
    href: "/gear/category/headphones",
    description: "Music on the move",
    Icon: TbHeadphones,
  },
  {
    label: "Apparel",
    href: "/gear/category/apparel",
    description: "Kit for every season",
    Icon: TbShirt,
  },
];

const nutritionLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Gels",
    href: "/nutrition/category/gels",
    description: "Fast-acting fuel",
    Icon: TbBatteryCharging,
  },
  {
    label: "Hydration",
    href: "/nutrition/category/hydration",
    description: "Electrolytes and drinks",
    Icon: TbBottle,
  },
];

const raceLinks: ReadonlyArray<CategoryItem> = [
  {
    label: "Races",
    href: "/races",
    description: "Browse race guides",
    Icon: TbFlag,
  },
  {
    label: "Calendar",
    href: "/races/calendar",
    description: "Upcoming races",
    Icon: TbCalendarEvent,
  },
  {
    label: "Database",
    href: "/races/database",
    description: "Search every race",
    Icon: TbDatabase,
  },
];

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
          <h3
            className="flex items-center gap-2 font-headline text-[20px] leading-[24px] font-medium text-[color:var(--ds-gray-1000)]"
            style={{ letterSpacing: "-0.01em" }}
          >
            <span className="min-w-0 flex-1 truncate">{title}</span>
            <span
              aria-hidden
              className="grid size-6 shrink-0 place-items-center rounded-full bg-[color:var(--ds-gray-100)] text-[color:var(--ds-gray-900)] transition-all duration-150 ease-out group-hover/card:translate-x-0.5 group-hover/card:bg-[color:var(--ds-gray-200)]"
            >
              <ArrowRight className="size-3.5" />
            </span>
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
  featuredNews,
  featuredShoe,
  featuredGear,
  featuredNutrition,
  featuredRace,
}: SiteNavigationMenuProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* News */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>News</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <DropdownPanel
              heading="News"
              featured={
                featuredNews && (
                  <FeaturedCard
                    href={`/articles/post/${featuredNews.slug.current}`}
                    image={featuredNews.mainImage}
                    label="Featured Article"
                    title={featuredNews.title}
                  />
                )
              }
              items={newsLinks}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Shoes */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Shoes</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <DropdownPanel
              heading="Shoes"
              featured={
                featuredShoe && (
                  <FeaturedCard
                    href={`/shoes/${featuredShoe.slug.current}`}
                    image={featuredShoe.mainImage}
                    label="Featured Article"
                    title={featuredShoe.title}
                  />
                )
              }
              items={shoeLinks}
            />
          </NavigationMenuContent>
        </NavigationMenuItem>

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

        {/* Nutrition */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Nutrition</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <DropdownPanel
              heading="Nutrition"
              featured={
                featuredNutrition && (
                  <FeaturedCard
                    href={`/nutrition/${featuredNutrition.slug.current}`}
                    image={featuredNutrition.mainImage}
                    label="Featured Article"
                    title={featuredNutrition.title}
                  />
                )
              }
              items={nutritionLinks}
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
      {/* Links column — bg-200 recessed surface in both modes. */}
      <div
        className="col-span-1 flex flex-col gap-0.5 border-r border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-200)] p-2"
      >
        <h4 className="px-3 pt-2.5 pb-1 text-[14px] leading-5 font-normal text-[color:var(--ds-gray-900)]">
          {heading}
        </h4>
        {items.map((item) => (
          <IconRow key={item.href} item={item} />
        ))}
      </div>

      {/* Featured column — bg-100 showcase surface in both modes. */}
      <div className="col-span-2 bg-[color:var(--ds-background-100)] p-3">
        {featured}
      </div>
    </div>
  );
}
