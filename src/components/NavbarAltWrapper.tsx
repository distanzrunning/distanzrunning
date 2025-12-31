// src/components/NavbarAltWrapper.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { featuredGearQuery } from "@/sanity/queries/featuredGearQuery";
import { featuredRaceQuery } from "@/sanity/queries/featuredRaceQuery";
import NavbarTwoPart from "./NavbarTwoPart";

export default async function NavbarAltWrapper() {
  const [featuredGear, featuredRace] = await Promise.all([
    sanityFetch({ query: featuredGearQuery }),
    sanityFetch({ query: featuredRaceQuery }),
  ]);

  return <NavbarTwoPart featuredGear={featuredGear.data} featuredRace={featuredRace.data} />;
}
