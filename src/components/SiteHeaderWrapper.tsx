// src/components/SiteHeaderWrapper.tsx
//
// Server component that fetches the three section featured items
// (shoes / gear / nutrition) + featured race from Sanity and forwards
// them to SiteHeader (client). Mirrors the pattern used by
// NavbarAltWrapper so layout.tsx can drop the server boundary in as a
// prop without client-side data fetching.

import { sanityFetch } from "@/sanity/lib/live";
import {
  featuredShoeProductQuery,
  featuredGearProductQuery,
  featuredNutritionProductQuery,
} from "@/sanity/queries/featuredProductQueries";
import { featuredRaceQuery } from "@/sanity/queries/featuredRaceQuery";
import { featuredNewsQuery } from "@/sanity/queries/featuredNewsQuery";
import SiteHeader from "./ui/SiteHeader";

export default async function SiteHeaderWrapper({
  newsletterSource,
}: {
  newsletterSource?: string;
}) {
  const [
    featuredNews,
    featuredShoe,
    featuredGear,
    featuredNutrition,
    featuredRace,
  ] = await Promise.all([
    sanityFetch({ query: featuredNewsQuery }),
    sanityFetch({ query: featuredShoeProductQuery }),
    sanityFetch({ query: featuredGearProductQuery }),
    sanityFetch({ query: featuredNutritionProductQuery }),
    sanityFetch({ query: featuredRaceQuery }),
  ]);

  return (
    <SiteHeader
      featuredNews={featuredNews.data}
      featuredShoe={featuredShoe.data}
      featuredGear={featuredGear.data}
      featuredNutrition={featuredNutrition.data}
      featuredRace={featuredRace.data}
      newsletterSource={newsletterSource}
    />
  );
}
