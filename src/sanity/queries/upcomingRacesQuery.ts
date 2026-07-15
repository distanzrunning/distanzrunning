// src/sanity/queries/upcomingRacesQuery.ts
//
// Homepage "Upcoming Races" row — the next 10 race guides by event
// date. No editorial curation: the row stays current as races pass.
// The card variant used here (chrome="card", default/non-index
// variant) never renders the stat-overlay fields (surface/profile/
// elevation/price/currency), so the projection skips them — trims
// the payload to what the card actually renders. Carries the LQIP
// for the blur placeholder per the DS image convention.

import { groq } from "next-sanity";

export const upcomingRacesQuery = groq`
  *[
    _type == "raceGuide"
    && defined(slug.current)
    && defined(eventDate)
    && eventDate >= now()
  ] | order(eventDate asc)[0...10] {
    _id,
    title,
    "href": "/races/" + slug.current,
    mainImage,
    "lqip": mainImage.asset->metadata.lqip,
    eventDate,
    city,
    stateRegion,
    country,
    "category": raceCategory->title
  }
`;
