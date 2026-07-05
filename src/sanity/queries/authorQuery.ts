// src/sanity/queries/authorQuery.ts
export const authorBySlugQuery = `
*[_type == "author" && slug.current == $slug][0] {
  name,
  "slug": slug.current,
  image
}
`;
