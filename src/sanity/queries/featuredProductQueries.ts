// src/sanity/queries/featuredProductQueries.ts
//
// One featured product per section (shoes | gear | nutrition).
// Joins productPost -> productCategory->section so the section filter
// lives on the category, not duplicated on the post.

import { groq } from 'next-sanity'

const featuredProductFragment = groq`
  title,
  slug,
  mainImage,
  excerpt
`

export const featuredShoeProductQuery = groq`
  *[_type == "productPost"
    && featuredInSection == true
    && productCategory->section == "shoes"][0] {
    ${featuredProductFragment}
  }
`

export const featuredGearProductQuery = groq`
  *[_type == "productPost"
    && featuredInSection == true
    && productCategory->section == "gear"][0] {
    ${featuredProductFragment}
  }
`

export const featuredNutritionProductQuery = groq`
  *[_type == "productPost"
    && featuredInSection == true
    && productCategory->section == "nutrition"][0] {
    ${featuredProductFragment}
  }
`
