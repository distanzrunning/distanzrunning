// src/app/page.tsx
//
// Homepage. Composed in sections — the first section is the
// HomepageHeroCarousel which auto-rotates through editorial slides
// flagged `featuredOnHomepage` across post / productPost / raceGuide.
// Server component fetches the slides and hands them to the client
// carousel.

import { sanityFetch } from "@/sanity/lib/live";
import { homepageHeroQuery } from "@/sanity/queries/homepageHeroQuery";
import HomepageHeroCarousel, {
  type HomepageHeroSlide,
} from "@/components/home/HomepageHeroCarousel";

export const revalidate = 60;

export default async function Home() {
  const { data } = await sanityFetch({ query: homepageHeroQuery });
  const slides = (data ?? []) as HomepageHeroSlide[];

  return (
    <>
      <HomepageHeroCarousel slides={slides} />
    </>
  );
}
