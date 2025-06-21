// src/sanity/queries/featuredRaceQuery.ts
export const featuredRaceQuery = `
*[_type == "raceGuide" && featuredRace == true][0] {
  title,
  slug,
  mainImage,
  eventDate,
  location
}
`