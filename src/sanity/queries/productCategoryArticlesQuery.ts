// src/sanity/queries/productCategoryArticlesQuery.ts
//
// Fetches a product category + its articles, scoped to one section
// so /shoes/category/trail-shoes can't accidentally surface a gear
// category that happens to share a slug. The route passes $section.

import { groq } from 'next-sanity'

export const productCategoryArticlesQuery = groq`
  {
    "category": *[_type == "productCategory"
      && slug.current == $slug
      && section == $section][0]{
      title,
      description,
      section,
      "availableTags": *[_type == "productPost" && references(^._id)].tags[] | order(@ asc)
    },
    "articles": *[_type == "productPost"
      && productCategory->slug.current == $slug
      && productCategory->section == $section
    ] | order(publishedAt desc) {
      title,
      slug,
      publishedAt,
      excerpt,
      tags,
      "mainImage": mainImage.asset->url
    }
  }
`
