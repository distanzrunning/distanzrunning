// src/sanity/queries/featuredRaceQuery.ts
//
// "location" is composed from the doc's city/stateRegion/country parts —
// the same string RaceGrid's formatLocation builds for the /races index
// (there is no bare location field on raceGuide). Empty parts drop out;
// no parts at all yields "" (falsy, so consumers skip the line).
export const featuredRaceQuery = `
*[_type == "raceGuide" && featuredRace == true && defined(slug.current)][0] {
  title,
  slug,
  mainImage,
  "lqip": mainImage.asset->metadata.lqip,
  publishedAt,
  eventDate,
  "location": array::join(array::compact([city, stateRegion, country]), ", ")
}
`