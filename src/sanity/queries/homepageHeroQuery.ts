// src/sanity/queries/homepageHeroQuery.ts
//
// Reads the homepage settings singleton plus a freshly-filtered
// race list in a single roundtrip:
//   - slides → featuredSlides (curated)
//   - breakingNews → breakingNewsItems (curated)
//   - races → next 10 raceGuides with eventDate ≥ now (auto)
//
// Article-shaped items carry: title, kicker (category / "Race
// Guide"), excerpt, dek date, mainImage, plus a section-aware
// href and kickerHref for the category landing page.
// Race-shaped items carry: title, mainImage, eventDate, location
// (city / region / country), category and href.

import { groq } from "next-sanity";

const articleProjection = `
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
`;

const raceProjection = `
  _id,
  title,
  "slug": slug.current,
  "href": "/races/" + slug.current,
  mainImage,
  eventDate,
  city,
  stateRegion,
  country,
  "category": raceCategory->title
`;

export const homepageHeroQuery = groq`
  *[_id == "homepageSettings"][0]{
    "slides": featuredSlides[]->{ ${articleProjection} },
    "breakingNews": breakingNewsItems[]->{ ${articleProjection} },
    "races": *[
      _type == "raceGuide"
      && defined(eventDate)
      && eventDate >= now()
    ] | order(eventDate asc)[0...10]{ ${raceProjection} }
  }
`;
