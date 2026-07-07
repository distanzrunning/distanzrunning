// src/sanity/queries/latestNewsQuery.ts
//
// The homepage Latest News slider: the six newest posts, excluding
// whichever article the hero is showing (the curated featuredSlides[0]
// — or, when curation lapsed, the latest post the hero falls back to)
// so the same story never appears twice on the page.

import { groq } from "next-sanity";

export const latestNewsQuery = groq`
  *[_type == "post" && defined(slug.current) && _id != coalesce(
    *[_id == "homepageSettings"][0].featuredSlides[0]->._id,
    *[_type == "post" && defined(slug.current)]
      | order(coalesce(publishedAt, _createdAt) desc)[0]._id
  )] | order(coalesce(publishedAt, _createdAt) desc)[0...6]{
    _id,
    title,
    excerpt,
    "publishedAt": coalesce(publishedAt, _createdAt),
    mainImage,
    "lqip": mainImage.asset->metadata.lqip,
    "category": category->{ title, "slug": slug.current },
    "href": "/articles/" + slug.current
  }
`;
