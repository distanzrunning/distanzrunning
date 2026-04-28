// src/sanity/queries/homepageHeroQuery.ts
//
// Reads the homepage hero carousel slides from the singleton
// `homepageSettings` document — `featuredSlides` is an ordered
// array of references to post / productPost / raceGuide. Editors
// drag-and-drop within that array to reorder the carousel.
//
// Each slide carries: title, kicker (category / "Race Guide"),
// excerpt, dek date, mainImage, plus a section-aware href and
// kickerHref for the category landing page.

import { groq } from "next-sanity";

export const homepageHeroQuery = groq`
  *[_id == "homepageSettings"][0]{
    "slides": featuredSlides[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      excerpt,
      "publishedAt": coalesce(publishedAt, _createdAt),
      mainImage,
      "kicker": select(
        _type == "post" => category->title,
        _type == "productPost" => productCategory->title,
        _type == "raceGuide" => "Race Guide",
        ""
      ),
      "kickerHref": select(
        _type == "post" => "/articles/" + category->slug.current,
        _type == "productPost" => "/" + productCategory->section + "/" + productCategory->slug.current,
        _type == "raceGuide" => "/races",
        null
      ),
      "href": select(
        _type == "post" => "/articles/" + slug.current,
        _type == "productPost" => "/" + productCategory->section + "/" + slug.current,
        _type == "raceGuide" => "/races/" + slug.current,
        "#"
      )
    }
  }
`;
