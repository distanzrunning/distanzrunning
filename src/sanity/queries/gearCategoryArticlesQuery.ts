// src/sanity/queries/gearCategoryArticlesQuery.ts

import { groq } from 'next-sanity'

export const gearCategoryArticlesQuery = groq`
  {
    "category": *[_type == "gearCategory" && slug.current == $gearCategorySlug][0]{
      title,
      description,
      "availableTags": *[_type == "gearPost" && references(^._id)].tags[] | order(@ asc)
    },
    "articles": *[_type == "gearPost" && gearCategory->slug.current == $gearCategorySlug] | order(publishedAt desc) {
      title,
      slug,
      publishedAt,
      excerpt,
      tags,
      "mainImage": mainImage.asset->url
    }
  }
`