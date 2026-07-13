// src/components/MastheadWrapper.tsx
//
// Server component that fetches the mega-menu featured items (one product per
// section + a featured race) and forwards them to the client Masthead.
// Mounted exactly once, in the (site) route-group layout — pages must not
// mount it themselves (a second mount double-stacks the header on soft nav).

import { safeSanityFetch } from "@/sanity/lib/safeFetch";
import {
  featuredShoeProductQuery,
  featuredGearProductQuery,
  featuredNutritionProductQuery,
} from "@/sanity/queries/featuredProductQueries";
import { featuredRaceQuery } from "@/sanity/queries/featuredRaceQuery";
import Masthead from "./Masthead";

export default async function MastheadWrapper() {
  const [shoe, gear, nutrition, race] = await Promise.all([
    safeSanityFetch({ query: featuredShoeProductQuery }),
    safeSanityFetch({ query: featuredGearProductQuery }),
    safeSanityFetch({ query: featuredNutritionProductQuery }),
    safeSanityFetch({ query: featuredRaceQuery }),
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
