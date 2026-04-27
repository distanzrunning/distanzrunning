// src/sanity/queries/homepageHeroQuery.ts
//
// Aggregates the homepage hero carousel slides across the three
// editorial doc types — `post`, `productPost`, and `raceGuide` —
// each filtered by their respective `featuredOnHomepage` boolean.
// Results are unioned into a single ordered list with a normalised
// shape so the carousel doesn't have to special-case each type.
//
// Each slide carries: title, kicker (section / category / "Race
// Guide"), excerpt, dek date, mainImage, and a section-aware href
// pointing at the canonical URL for that doc type.

import { groq } from "next-sanity";

export const homepageHeroQuery = groq`
  *[
    (_type == "post" && featuredOnHomepage == true) ||
    (_type == "productPost" && featuredOnHomepage == true) ||
    (_type == "raceGuide" && featuredOnHomepage == true)
  ] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    "publishedAt": coalesce(publishedAt, _createdAt),
    mainImage,
    // Kicker label depends on type
    "kicker": select(
      _type == "post" => upper(category->title),
      _type == "productPost" => upper(productCategory->section),
      _type == "raceGuide" => "RACE GUIDE",
      ""
    ),
    // Canonical href per type
    "href": select(
      _type == "post" => "/articles/post/" + slug.current,
      _type == "productPost" => "/" + productCategory->section + "/" + slug.current,
      _type == "raceGuide" => "/races/" + slug.current,
      "#"
    )
  }
`;
