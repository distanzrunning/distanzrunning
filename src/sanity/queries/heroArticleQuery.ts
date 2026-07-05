// src/sanity/queries/heroArticleQuery.ts
//
// The homepage hero's featured article: the first curated slide from
// the homepageSettings singleton, falling back to the latest post so
// the hero never renders empty because curation lapsed. Works across
// the three editorial types (post / productPost / raceGuide) — the
// kicker/href selects mirror homepageHeroQuery's articleProjection,
// plus the author byline the hero needs.

import { groq } from "next-sanity";

const heroProjection = `
  _id,
  _type,
  title,
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
  ),
  "author": author->{ name, image }
`;

export const heroArticleQuery = groq`
  coalesce(
    *[_id == "homepageSettings"][0].featuredSlides[0]->,
    *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0]
  ){ ${heroProjection} }
`;
