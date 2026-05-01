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

export const raceIndexQuery = groq`
  *[
    _type == "raceGuide"
    && defined(slug.current)
    && (!defined($qWild) || title match $qWild || city match $qWild || country match $qWild)
    && (!defined($dateFrom) || eventDate >= $dateFrom)
    && (!defined($dateTo) || eventDate <= $dateTo)
    && (!defined($distanceMin) || distance >= $distanceMin - 0.05)
    && (!defined($distanceMax) || distance <= $distanceMax + 0.05)
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
