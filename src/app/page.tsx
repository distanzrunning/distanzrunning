// src/app/page.tsx
//
// Homepage. Composed in sections, all driven by the
// `homepageSettings` singleton in Sanity:
//   - Hero carousel  → featuredSlides
//   - Breaking news  → breakingNewsItems
//   - Gear           → latest 4 productPost records (auto)
//   - Races          → next 10 raceGuides with eventDate ≥ now (auto)
// The section flow is broken up by a mid-page AdSlot (between Gear
// and Races) and closed by an inverse-theme NewsletterSignup right
// before the footer. Every section uses the same vertical rhythm
// (py-12 md:py-16 lg:py-20) so the homepage cadence stays
// consistent regardless of which section sits where.

import { sanityFetch } from "@/sanity/lib/live";
import { homepageHeroQuery } from "@/sanity/queries/homepageHeroQuery";
import HomepageHeroCarousel, {
  type HomepageHeroSlide,
} from "@/components/home/HomepageHeroCarousel";
import HomepageBreakingNews, {
  type BreakingNewsItem,
} from "@/components/home/HomepageBreakingNews";
import HomepageGear, {
  type HomepageGearItem,
} from "@/components/home/HomepageGear";
import HomepageRaces, {
  type HomepageRaceItem,
} from "@/components/home/HomepageRaces";
import { AdSlot } from "@/components/ui/AdSlot";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

export const revalidate = 60;

type HomepageData = {
  slides?: HomepageHeroSlide[];
  breakingNews?: BreakingNewsItem[];
  gear?: HomepageGearItem[];
  races?: HomepageRaceItem[];
} | null;

export default async function Home() {
  const { data } = await sanityFetch({ query: homepageHeroQuery });
  const settings = data as HomepageData;
  const slides = settings?.slides ?? [];
  const breakingNews = settings?.breakingNews ?? [];
  const gear = settings?.gear ?? [];
  const races = settings?.races ?? [];

  return (
    <>
      <HomepageHeroCarousel slides={slides} />
      <HomepageBreakingNews items={breakingNews} />
      <HomepageGear items={gear} />

      {/* Mid-page editorial pause. preview=true until real AdSense
          slot IDs are wired up — renders the Distanz "Advertise
          with us" fallback so the slot still earns its space. */}
      <section className="w-full px-4 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <AdSlot
            slot="homepage-mid"
            size="billboard"
            preview
            className="mx-auto"
          />
        </div>
      </section>

      <HomepageRaces items={races} />

      {/* Closing CTA. theme="black" gives the panel the inverse of
          whatever theme the page is in — strong visual punctuation
          right before the footer. */}
      <section className="w-full px-4 py-12 md:py-16 lg:py-20">
        <NewsletterSignup theme="black" source="homepage_footer" />
      </section>
    </>
  );
}
