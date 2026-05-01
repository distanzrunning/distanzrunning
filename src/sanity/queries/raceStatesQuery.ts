// src/sanity/queries/raceStatesQuery.ts
//
// All state/region + country pairs across published race guides.
// Sanity returns one row per race; deduping by stateRegion happens
// in page.tsx (GROQ doesn't have clean "unique by key" for object
// arrays). The `stateRegion` field is optional in the schema —
// races in countries that don't subdivide that way (Belgium, Qatar,
// etc) won't have one, and the `defined()` predicate filters those
// out so the dropdown stays useful.

import { groq } from "next-sanity";

export const raceStatesQuery = groq`
  *[
    _type == "raceGuide"
    && defined(slug.current)
    && defined(stateRegion)
    && defined(country)
  ] {
    "state": stateRegion,
    country
  } | order(state asc)
`;
