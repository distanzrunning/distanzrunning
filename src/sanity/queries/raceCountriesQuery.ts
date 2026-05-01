// src/sanity/queries/raceCountriesQuery.ts
//
// All unique country values across published race guides, sorted
// alphabetically. Used to populate the Country filter's dropdown
// list — needs to show every country we have races for, regardless
// of the user's current filter selection, so it's a separate
// fetch from raceIndexQuery (which is filter-narrowed).

import { groq } from "next-sanity";

export const raceCountriesQuery = groq`
  array::unique(
    *[_type == "raceGuide" && defined(slug.current) && defined(country)].country
  ) | order(@ asc)
`;
