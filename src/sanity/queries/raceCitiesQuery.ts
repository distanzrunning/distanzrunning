// src/sanity/queries/raceCitiesQuery.ts
//
// All city / country / state triples across published race guides.
// Sanity returns one row per race; deduping by city happens in
// page.tsx (GROQ doesn't have a clean "unique by key" for object
// arrays). The result is the source of truth for the City filter's
// option list — independent of currently-applied filters so the
// dropdown always shows every city we have data for.
//
// `stateRegion` is optional (only US races carry it in our data).
// FiltersShell uses it to auto-fill the State chip when the user
// picks a US city — picking NYC also sets state="New York".

import { groq } from "next-sanity";

export const raceCitiesQuery = groq`
  *[
    _type == "raceGuide"
    && defined(slug.current)
    && defined(city)
    && defined(country)
  ] {
    city,
    country,
    "state": stateRegion
  } | order(city asc)
`;
