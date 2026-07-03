// src/components/MastheadWrapper.tsx
//
// Server component that fetches the mega-menu featured items (one product per
// section + a featured race) and forwards them to the client Masthead. Used
// both as the site-wide header (layout.tsx) and on the homepage (page.tsx),
// so the fetch + prop wiring lives in one place.

import { sanityFetch } from "@/sanity/lib/live";
import {
  featuredShoeProductQuery,
  featuredGearProductQuery,
  featuredNutritionProductQuery,
} from "@/sanity/queries/featuredProductQueries";
import { featuredRaceQuery } from "@/sanity/queries/featuredRaceQuery";
import Masthead from "./Masthead";

export default async function MastheadWrapper() {
  const [shoe, gear, nutrition, race] = await Promise.all([
    sanityFetch({ query: featuredShoeProductQuery }),
    sanityFetch({ query: featuredGearProductQuery }),
    sanityFetch({ query: featuredNutritionProductQuery }),
    sanityFetch({ query: featuredRaceQuery }),
  ]);

  return (
    <Masthead
      featuredShoe={shoe.data}
      featuredGear={gear.data}
      featuredNutrition={nutrition.data}
      featuredRace={race.data}
    />
  );
}
