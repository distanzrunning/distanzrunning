// src/components/Navbar.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { featuredGearQuery } from "@/sanity/queries/featuredGearQuery";
import { featuredRaceQuery } from "@/sanity/queries/featuredRaceQuery";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const [featuredGear, featuredRace] = await Promise.all([
    sanityFetch({ query: featuredGearQuery }),
    sanityFetch({ query: featuredRaceQuery }),
  ]);

  return <NavbarClient featuredGear={featuredGear.data} featuredRace={featuredRace.data} />;
}
