// src/sanity/queries/raceIndexQuery.ts
//
// All published race guides for the /races index page, ordered by
// eventDate ascending so upcoming races sort to the top.
//
// Filter predicates use the `!defined($x) || …` pattern so the same
// query string serves the unfiltered first paint AND any filtered
// view — page.tsx always passes every parameter, with null for
// filters the user hasn't set. Adding a new filter is two steps:
//   1. New parameter on RaceQueryParams in app/races/filters.ts
//   2. New `&& (!defined($x) || <predicate>)` clause here

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
    cur === "USD" ? `currency == "USD" => price` : `currency == "${cur}" => price / ${rate}`,
  ),
  // Default: assume the value is already in USD if the currency
  // string isn't one we know about.
  `price`,
].join(", ")})`;

export const raceIndexQuery = groq`
  *[
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
  ] | order(eventDate asc) {
    _id,
    title,
    "slug": slug.current,
    "href": "/races/" + slug.current,
    mainImage,
    eventDate,
    city,
    stateRegion,
    country,
    "category": raceCategory->title,
    distance,
    surface,
    surfaceBreakdown,
    profile,
    elevationGain,
    price,
    currency,
    finishers
  }
`;
