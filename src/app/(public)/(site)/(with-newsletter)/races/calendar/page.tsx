// src/app/races/calendar/page.tsx
//
// Race calendar — a month grid with races on their days (rebuilt on
// Stride 2026-08-23, replacing the legacy FullCalendar + popup-window
// implementation). Server-rendered like the /races index: the month
// lives in the URL (?m=YYYY-MM) so months are shareable, crawlable
// and back-button-correct; prev/next are prefetched links, so paging
// months feels instant. Race chips soft-navigate to their guides;
// days with more races than fit link into the /races index filtered
// to that exact day.

import { groq } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";

import RaceUnitControls from "../../../races/RaceUnitControls";
import CalendarGrid, { type CalendarRace } from "./CalendarGrid";
import { calendarRange, monthFromParam } from "./month";

export const revalidate = 60;

export const metadata = {
  title: "Race Calendar — Distanz Running",
  description:
    "Explore upcoming races on a monthly calendar. Find your next race and plan your running schedule.",
};

// The grid shows leading/trailing days of the adjacent months, so
// the fetch window is the full visible grid, not just the month.
// Beyond the chip fields, the projection carries the summary-sheet
// details (category, stats, image + inline LQIP per the image
// convention).
const calendarQuery = groq`
  *[_type == "raceGuide" && defined(eventDate) && defined(slug.current)
    && eventDate >= $start && eventDate <= $end]
    | order(eventDate asc) {
    _id,
    title,
    "slug": slug.current,
    eventDate,
    startTime,
    city,
    country,
    tags,
    "category": raceCategory->title,
    introduction,
    distance,
    surface,
    elevationGain,
    averageTemperature,
    price,
    currency,
    mainImage,
    "lqip": mainImage.asset->metadata.lqip
  }
`;

type CalendarQueryRow = CalendarRace & {
  mainImage?: SanityImageSource | null;
  lqip?: string | null;
};

// Sheet panel is 420px — 2x for retina.
const SHEET_IMAGE_RENDER_WIDTH = 420 * 2;

export default async function RaceCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const month = monthFromParam(typeof sp.m === "string" ? sp.m : undefined);

  const { gridStart, gridEnd } = calendarRange(month);
  const result = await sanityFetch({
    query: calendarQuery,
    params: {
      start: `${gridStart}T00:00:00.000Z`,
      end: `${gridEnd}T23:59:59.999Z`,
    },
  });
  const rows = (result.data ?? []) as CalendarQueryRow[];
  // Resolve image URLs at the data layer (urlFor + inline LQIP) —
  // the client island receives plain strings, per convention.
  const races: CalendarRace[] = rows.map(({ mainImage, lqip, ...race }) => ({
    ...race,
    imageUrl: mainImage
      ? urlFor(mainImage).width(SHEET_IMAGE_RENDER_WIDTH).auto("format").url()
      : null,
    blurDataURL: lqip ?? null,
  }));

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-12 md:gap-10 md:py-16 lg:py-20">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="flex flex-col gap-3">
          {/* Page title is wayfinding chrome — UI heading register,
              like the /races index. The month + nav live INSIDE the
              calendar unit (its toolbar row). */}
          <h1 className="m-0 text-balance text-heading-40 text-textDefault md:text-heading-48">
            Race Calendar
          </h1>
          <p className="max-w-2xl text-copy-16 text-textSubtle md:text-copy-18">
            Explore upcoming races month by month and plan your running
            schedule.
          </p>
        </div>
        {/* Imperial/Metric + currency picked ONCE up here (user call
            2026-08-23) — the shared UnitsContext carries the choice
            into every summary sheet (and the rest of the site). Same
            header slot as the /races index. */}
        <RaceUnitControls />
      </header>
      <CalendarGrid month={month} races={races} />
    </div>
  );
}
