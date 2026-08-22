// src/sanity/queries/raceIndexQuery.ts
//
// All published race guides for the /races index page. Filter
// predicates use the `!defined($x) || …` pattern so the same
// query string serves the unfiltered first paint AND any filtered
// view — page.tsx always passes every parameter, with null for
// filters the user hasn't set. Adding a new filter is two steps:
//   1. New parameter on RaceQueryParams in app/races/filters.ts
//   2. New `&& (!defined($x) || <predicate>)` clause here
//
// Sort is parameterised differently — GROQ ordering can't be
// driven by a parameter the way `where` predicates can, so we
// build the order clause as a string and embed it via a query
// builder function.

import { groq } from "next-sanity";

import { FALLBACK_RATES } from "@/lib/raceUtils";

// GROQ snippet that converts a race's `price` field (in
// `currency`) to USD using the same fallback rates raceUtils.ts
// uses for client-side display. Generated from FALLBACK_RATES so
// every currency we know about is covered — without this, races
// in currencies we forgot to list (e.g. MXN, KRW) would be
// treated as raw USD and a 649-MXN race would be filtered out by
// "Under $50".
const PRICE_TO_USD = `select(${[
  ...Object.entries(FALLBACK_RATES).map(([cur, rate]) =>
    cur === "USD"
      ? `currency == "USD" => price`
      : `currency == "${cur}" => price / ${rate}`,
  ),
  // Default: assume the value is already in USD if the currency
  // string isn't one we know about.
  `price`,
].join(", ")})`;

// Sort key → GROQ order clause. Mirrors the legacy filter's
// option set. Adding a new sort: append here + the matching
// label in src/app/races/filters/SortFilter.tsx.
export const SORT_KEYS = [
  "date-asc",
  "date-desc",
  "name-asc",
  "name-desc",
  "distance-asc",
  "distance-desc",
  "elevation-asc",
  "elevation-desc",
  "price-asc",
  "price-desc",
] as const;

export type RaceSortKey = (typeof SORT_KEYS)[number];

export const DEFAULT_SORT: RaceSortKey = "date-asc";

const SORT_GROQ: Record<RaceSortKey, string> = {
  "date-asc": "eventDate asc",
  "date-desc": "eventDate desc",
  "name-asc": "title asc",
  "name-desc": "title desc",
  "distance-asc": "distance asc",
  "distance-desc": "distance desc",
  "elevation-asc": "elevationGain asc",
  "elevation-desc": "elevationGain desc",
  "price-asc": "price asc",
  "price-desc": "price desc",
};

// Shared predicate block — the list query and the count query MUST
// filter identically or the page count lies.
const RACE_FILTER_PREDICATES = `
      _type == "raceGuide"
      && defined(slug.current)
      && (!defined($qWild) || title match $qWild || city match $qWild || country match $qWild)
      && (!defined($dateFrom) || eventDate >= $dateFrom)
      && (!defined($dateTo) || eventDate <= $dateTo)
      && (!defined($distanceMin) || distance >= $distanceMin - 0.05)
      && (!defined($distanceMax) || distance <= $distanceMax + 0.05)
      && (!defined($country) || country == $country)
      && (!defined($city) || city == $city)
      && (!defined($state) || stateRegion == $state)
      && (!defined($surface) || surface == $surface)
      && (!defined($priceMin) || (defined(price) && ${PRICE_TO_USD} >= $priceMin))
      && (!defined($priceMax) || (defined(price) && ${PRICE_TO_USD} <= $priceMax))
      && (!defined($elevationMin) || (defined(elevationGain) && elevationGain >= $elevationMin))
      && (!defined($elevationMax) || (defined(elevationGain) && elevationGain <= $elevationMax))
      && (!defined($temperatureMin) || (defined(averageTemperature) && averageTemperature >= $temperatureMin))
      && (!defined($temperatureMax) || (defined(averageTemperature) && averageTemperature <= $temperatureMax))
      && (!defined($raceTag) || $raceTag in tags)
      && (!defined($hidePastBefore) || eventDate >= $hidePastBefore)
`;

/** Total matching races for the current filter set — drives the
 *  grid's page count. Takes the same params object as the list
 *  query. */
export const raceCountQuery = groq`count(*[${RACE_FILTER_PREDICATES}])`;

export function buildRaceIndexQuery(
  sort: RaceSortKey = DEFAULT_SORT,
  /** When set, slice the ordered result (grid pagination). The
   *  bounds are embedded as literals — like the order clause, GROQ
   *  can't take them as params in this position. Omit for the full
   *  set (the map view needs every marker). */
  slice?: { offset: number; limit: number },
): string {
  const order = SORT_GROQ[sort] ?? SORT_GROQ[DEFAULT_SORT];
  const sliceClause = slice
    ? `[${Math.max(0, Math.floor(slice.offset))}...${Math.max(0, Math.floor(slice.offset + slice.limit))}]`
    : "";
  return groq`
    *[${RACE_FILTER_PREDICATES}] | order(${order}) ${sliceClause} {
      _id,
      title,
      "slug": slug.current,
      "href": "/races/" + slug.current,
      mainImage,
      "lqip": mainImage.asset->metadata.lqip,
      "lat": location.lat,
      "lng": location.lng,
      eventDate,
      city,
      stateRegion,
      country,
      "category": raceCategory->title,
      tags,
      surface,
      surfaceBreakdown,
      profile,
      elevationGain,
      price,
      currency,
      fieldSize
    }
  `;
}
