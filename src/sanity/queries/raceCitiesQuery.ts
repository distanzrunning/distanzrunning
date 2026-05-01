// src/sanity/queries/raceCitiesQuery.ts
//
// All city/country pairs across published race guides. The Sanity
// side just returns every race's city + country; deduping by city
// happens in page.tsx (GROQ doesn't have a clean "unique by key"
// for object arrays). The result is the source of truth for the
// City filter's option list — independent of currently-applied
// filters so the dropdown always shows every city we have data
// for.

import { groq } from "next-sanity";

export const raceCitiesQuery = groq`
  *[
    _type == "raceGuide"
    && defined(slug.current)
    && defined(city)
    && defined(country)
  ] {
    city,
    country
  } | order(city asc)
`;
