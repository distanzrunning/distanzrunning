// src/sanity/queries/editorsPicksQuery.ts
//
// The homepage Editor's Picks: curated homepageSettings featuredSlides
// AFTER the hero (positions 1+), cross-type like the hero (post /
// productPost / raceGuide). Returns up to four (one main + three rail).
// The section backfills from recent posts when curation runs short —
// see the companion backfill query.

import { groq } from "next-sanity";

const pickProjection = `
  _id,
  _type,
  title,
  excerpt,
  "publishedAt": coalesce(publishedAt, _createdAt),
  mainImage,
  "lqip": mainImage.asset->metadata.lqip,
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

export const editorsPicksQuery = groq`
  *[_id == "homepageSettings"][0].featuredSlides[1...5]->{ ${pickProjection} }
`;

/** Backfill when curation holds fewer than four picks: recent posts not
 *  already on the page ($usedIds = hero + curated picks). */
export const editorsPicksBackfillQuery = groq`
  *[_type == "post" && defined(slug.current) && !(_id in $usedIds)]
    | order(coalesce(publishedAt, _createdAt) desc)[0...4]{ ${pickProjection} }
`;
