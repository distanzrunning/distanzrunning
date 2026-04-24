// src/sanity/queries/featuredNewsQuery.ts
//
// Featured News article for the site header dropdown. Picks the most
// recently published `post` in road/track/trail that has featuredPost
// flagged. No fallback — if none flagged, the dropdown renders
// without a featured card (same behaviour as the other sections).

import { groq } from 'next-sanity'

export const featuredNewsQuery = groq`
  *[_type == "post"
    && featuredPost == true
    && category->slug.current in ["road", "track", "trail"]
  ] | order(publishedAt desc)[0] {
    title,
    slug,
    mainImage,
    excerpt
  }
`
