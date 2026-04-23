// src/components/SiteHeaderWrapper.tsx
//
// Server component that fetches the featured gear + race items from
// Sanity and forwards them to SiteHeader (client). Mirrors the
// pattern used by NavbarAltWrapper so layout.tsx can drop the server
// boundary in as a prop without client-side data fetching.

import { sanityFetch } from "@/sanity/lib/live";
import { featuredGearQuery } from "@/sanity/queries/featuredGearQuery";
import { featuredRaceQuery } from "@/sanity/queries/featuredRaceQuery";
import SiteHeader from "./ui/SiteHeader";

export default async function SiteHeaderWrapper({
  newsletterSource,
}: {
  newsletterSource?: string;
}) {
  const [featuredGear, featuredRace] = await Promise.all([
    sanityFetch({ query: featuredGearQuery }),
    sanityFetch({ query: featuredRaceQuery }),
  ]);

  return (
    <SiteHeader
      featuredGear={featuredGear.data}
      featuredRace={featuredRace.data}
      newsletterSource={newsletterSource}
    />
  );
}
