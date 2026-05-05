// src/app/races/[raceSlug]/page.tsx
//
// Server component for a single race guide. The page is a
// map-led canvas: the race route fills the entire PageFrame
// surface as a Mapbox map, with a floating guide panel on the
// right-hand side carrying the race meta + write-up.
//
// Data shape: 26 of 30 race guides have an existing `gpxFile`
// upload (a .geojson FeatureCollection of LineString features).
// We dereference the asset to its CDN URL here and hand the URL
// to the client island, which fetches + renders the route.

import { notFound } from "next/navigation";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import RaceGuideShell, {
  type RaceGuideMeta,
} from "./RaceGuideShell";

export const revalidate = 60;

type RaceGuideQueryRow = RaceGuideMeta & {
  mainImage?: SanityImageSource | null;
  portraitImage?: SanityImageSource | null;
  routeGeoJsonUrl?: string | null;
};

// Width of the panel card the image sits inside (mirrors
// PANEL_WIDTH in RaceGuideShell). Doubled so retina screens
// get a sharp source. We resolve a single CDN URL on the
// server rather than passing the raw Sanity image source down
// to the client.
const HERO_IMAGE_RENDER_WIDTH = 520 * 2;

const raceGuideQuery = /* groq */ `
  *[_type == "raceGuide" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    eventDate,
    startTime,
    city,
    stateRegion,
    country,
    "category": raceCategory->title,
    distance,
    surface,
    surfaceBreakdown,
    profile,
    elevationGain,
    elevationLoss,
    altitude,
    humidity,
    averageTemperature,
    price,
    currency,
    fieldSize,
    tags,
    mensCourseRecord,
    mensCourseRecordAthlete,
    mensCourseRecordCountry,
    womensCourseRecord,
    womensCourseRecordAthlete,
    womensCourseRecordCountry,
    officialWebsite,
    introduction,
    body,
    mainImage,
    portraitImage,
    "routeGeoJsonUrl": gpxFile.asset->url
  }
`;

export default async function RaceGuidePage({
  params,
}: {
  params: Promise<{ raceSlug: string }>;
}) {
  const { raceSlug } = await params;
  const result = await sanityFetch({
    query: raceGuideQuery,
    params: { slug: raceSlug },
  });
  const race = result.data as RaceGuideQueryRow | null;

  if (!race) notFound();

  // Prefer the dedicated 3:4 portraitImage when set; fall back
  // to mainImage so older races without a portrait upload still
  // show the hero.
  const heroSource = race.portraitImage ?? race.mainImage ?? null;
  const heroImageUrl = heroSource
    ? urlFor(heroSource)
        .width(HERO_IMAGE_RENDER_WIDTH)
        .auto("format")
        .url()
    : null;

  return (
    <RaceGuideShell
      race={race}
      routeGeoJsonUrl={race.routeGeoJsonUrl ?? null}
      heroImageUrl={heroImageUrl}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ raceSlug: string }>;
}) {
  const { raceSlug } = await params;
  const result = await sanityFetch({
    query: /* groq */ `
      *[_type == "raceGuide" && slug.current == $slug][0]{ title, city, country }
    `,
    params: { slug: raceSlug },
  });
  const row = result.data as
    | { title?: string; city?: string; country?: string }
    | null;
  if (!row?.title) return { title: "Race — Distanz Running" };
  const location = [row.city, row.country].filter(Boolean).join(", ");
  return {
    title: `${row.title} — Distanz Running`,
    description: location
      ? `Race guide for ${row.title} in ${location}.`
      : `Race guide for ${row.title}.`,
  };
}
