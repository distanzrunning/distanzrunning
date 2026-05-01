// src/sanity/queries/raceIndexQuery.ts
//
// All published race guides for the /races index page, ordered by
// eventDate ascending so upcoming races sort to the top. Future
// phases of the rewrite will extend this query with predicate
// fragments built from URL searchParams (filterQuery.ts), so each
// filter narrows the result set server-side rather than fetching
// everything and filtering on the client.

import { groq } from "next-sanity";

export const raceIndexQuery = groq`
  *[
    _type == "raceGuide"
    && defined(slug.current)
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
