// src/sanity/queries/categoryArticlesQuery.ts

import { groq } from 'next-sanity'

export const categoryArticlesQuery = groq`
  {
    "category": *[_type == "category" && slug.current == $categorySlug][0]{
      title,
      description,
      "availableTags": *[_type == "post" && references(^._id)].tags[] | order(@ asc)
    },
    "articles": *[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
      title,
      slug,
      publishedAt,
      excerpt,
      tags,
      "mainImage": mainImage.asset->url
    }
  }
`