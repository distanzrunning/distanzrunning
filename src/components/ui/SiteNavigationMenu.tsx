"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  TbRoad,
  TbArrowCapsule,
  TbMountain,
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
    label: "Race-Day",
    href: "/shoes/category/race-day-shoes",
    description: "Built for PR days",
    Icon: TbFlag,
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
    label: "Tempo",
    href: "/shoes/category/tempo-shoes",
    description: "Responsive and fast",
    Icon: TbStopwatch,
  },
  {
    label: "Trail",
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
          <Icon className="size-5 stroke-[1.5]" />
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
// Featured card — full-bleed editorial pattern:
//   - Image fills the entire column (height inherited from the links
//     column via grid stretching)
//   - Bottom-anchored gradient scrim so overlay text holds contrast
//     regardless of the image
//   - Eyebrow + title + glassy circled arrow overlay the image
//   - Subtle image zoom + arrow slide on hover
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
      className="group/card block h-full hover:bg-transparent focus:bg-transparent"
    >
      <Link
        href={href}
        className="relative block h-full w-full overflow-hidden rounded-lg"
        style={{ background: "var(--ds-gray-200)" }}
      >
        {image && (
          <Image
            src={urlFor(image).width(1200).height(800).url()}
            alt=""
            fill
            sizes="535px"
            className="transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
            style={{ objectFit: "cover" }}
          />
        )}

        {/* Top-down scrim so the overlay text always reads cleanly
            even on bright/busy imagery. Bottom half stays clear so
            the photo can breathe. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0) 65%)",
          }}
        />

        {/* Overlay caption — anchored to the top of the image */}
        <div className="absolute inset-x-0 top-0 flex items-start gap-3 p-5">
          <div className="min-w-0 flex-1">
            <span className="text-[14px] leading-5 font-medium text-white/90">
              {label}
            </span>
            <h3
              className="mt-1 text-[20px] leading-[24px] font-[550] text-white"
              style={{ letterSpacing: "-0.005em" }}
            >
              <span className="line-clamp-2">{title}</span>
            </h3>
          </div>
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-150 ease-out group-hover/card:translate-x-0.5 group-hover/card:bg-white/25"
          >
            <ArrowRight className="size-4" />
          </span>
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
                    label="Featured"
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
                    label="Featured"
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
                    label="Featured"
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
                    label="Featured"
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
                    label="Featured"
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
  // min-h matches the natural height of the tallest section (Shoes
  // with 5 link rows). Forcing the grid to that height keeps every
  // dropdown — and therefore every featured image — the same size,
  // regardless of how many links the section has. Shorter sections
  // get a small bg-200 spacer below their links.
  return (
    <div className="grid min-h-[360px] w-[800px] grid-cols-3">
      {/* Links column — bg-200 recessed in light, bg-100 elevated in
          dark (swap intentional so the panel reads with the right
          contrast in each mode). */}
      <div
        className="col-span-1 flex flex-col gap-0.5 border-r border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-200)] p-2 dark:bg-[color:var(--ds-background-100)]"
      >
        <h4 className="px-3 pt-2.5 pb-1 text-[14px] leading-5 font-normal text-[color:var(--ds-gray-900)]">
          {heading}
        </h4>
        {items.map((item) => (
          <IconRow key={item.href} item={item} />
        ))}
      </div>

      {/* Featured column — bg-100 in light, bg-200 in dark (swap
          mirrors the links column). Padding gives the image a small
          breathing room from the column edges; the card itself owns
          the rounded corners + overflow-hidden. */}
      <div className="col-span-2 bg-[color:var(--ds-background-100)] p-4 dark:bg-[color:var(--ds-background-200)]">
        {featured}
      </div>
    </div>
  );
}
