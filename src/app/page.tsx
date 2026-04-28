// src/app/page.tsx
//
// Homepage. Composed in sections, all driven by the
// `homepageSettings` singleton in Sanity:
//   - Hero carousel  → featuredSlides
//   - Breaking news  → breakingNewsItems
// Single fetch hands both arrays to their client components.

import { sanityFetch } from "@/sanity/lib/live";
import { homepageHeroQuery } from "@/sanity/queries/homepageHeroQuery";
import HomepageHeroCarousel, {
  type HomepageHeroSlide,
} from "@/components/home/HomepageHeroCarousel";
import HomepageBreakingNews, {
  type BreakingNewsItem,
} from "@/components/home/HomepageBreakingNews";

export const revalidate = 60;

type HomepageData = {
  slides?: HomepageHeroSlide[];
  breakingNews?: BreakingNewsItem[];
} | null;

export default async function Home() {
  const { data } = await sanityFetch({ query: homepageHeroQuery });
  const settings = data as HomepageData;
  const slides = settings?.slides ?? [];
  const breakingNews = settings?.breakingNews ?? [];

  return (
    <>
      <HomepageHeroCarousel slides={slides} />
      <HomepageBreakingNews items={breakingNews} />
    </>
  );
}
