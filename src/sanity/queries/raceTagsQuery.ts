// src/sanity/queries/raceTagsQuery.ts
//
// Every unique tag across all published race guides, alphabetised.
// Powers the Tag filter's option list — independent of currently-
// applied filters so the dropdown always shows every tag we have
// data for.
//
// `tags[]` flattens the per-race string array down to a flat list
// of tag strings; `array::unique(...)` dedupes; `order(@ asc)`
// sorts the resulting strings alphabetically.

import { groq } from "next-sanity";

export const raceTagsQuery = groq`
  array::unique(
    *[_type == "raceGuide" && defined(slug.current)].tags[]
  ) | order(@ asc)
`;
