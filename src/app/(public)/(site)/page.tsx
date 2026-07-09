// Homepage — being rebuilt section by section. The Masthead + announcement
// banner come from the (site) route-group layout; this page only renders
// its sections. IMPORTANT: don't mount MastheadWrapper here — the layout
// already renders it, and a second mount site double-stacks the header
// after client-side navigation (the root layout persists across soft navs).

import HomepageHero from "@/components/home/HomepageHero";
import AdPlacement from "@/components/ads/AdPlacement";
import PromoUnit from "@/components/home/PromoUnit";
import HomepageLatestNews from "@/components/home/HomepageLatestNews";
import HomepageEditorsPicks from "@/components/home/HomepageEditorsPicks";
import HomepageUpcomingRaces from "@/components/home/HomepageUpcomingRaces";

export default function HomePage() {
  return (
    <>
      <HomepageHero />

      {/* Ad below the hero (404 Media's latest-post__ad slot). The ad
          layer decides what serves — size per breakpoint from the
          placement registry, house creatives until AdSense goes live. */}
      <AdPlacement
        name="home-below-hero"
        className="mx-auto w-full max-w-content px-6 pb-10 lg:pb-16"
      />

      {/* Full-bleed ink promo band (404's promo-unit) — who we are,
          about link, subscribe CTA. */}
      <PromoUnit />

      {/* Latest News — Quartr's section structure, our ArticleCards. */}
      <HomepageLatestNews />

      {/* Editor's Picks — sticky main pick + scrolling rail of three. */}
      <HomepageEditorsPicks />

      {/* Upcoming Races — next 10 by event date, Runna's card grammar
          in the Latest News carousel anatomy. */}
      <HomepageUpcomingRaces />
    </>
  );
}
