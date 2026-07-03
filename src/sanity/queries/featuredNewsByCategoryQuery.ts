// src/sanity/queries/featuredNewsByCategoryQuery.ts
//
// One featured News article per editorial discipline (road / track /
// trail), for the homepage Masthead mega-menu. Each discipline is its
// own top-level trigger there (unlike the production SiteHeader, which
// groups all three under a single "News" section via featuredNewsQuery),
// so each needs its own featured card. Picks the most recently published
// `post` flagged featuredPost within that category; null if none flagged
// (the panel then renders its featured slot placeholder).

import { groq } from 'next-sanity'

const featuredPostFragment = groq`{
  title,
  slug,
  mainImage,
  excerpt
}`

export const featuredNewsByCategoryQuery = groq`{
  "road": *[_type == "post" && featuredPost == true
    && category->slug.current == "road"] | order(publishedAt desc)[0] ${featuredPostFragment},
  "track": *[_type == "post" && featuredPost == true
    && category->slug.current == "track"] | order(publishedAt desc)[0] ${featuredPostFragment},
  "trail": *[_type == "post" && featuredPost == true
    && category->slug.current == "trail"] | order(publishedAt desc)[0] ${featuredPostFragment}
}`
