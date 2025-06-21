// src/sanity/queries/featuredGearQuery.ts
export const featuredGearQuery = `
*[_type == "gearPost" && featuredGear == true][0] {
  title,
  slug,
  mainImage,
  excerpt
}
`