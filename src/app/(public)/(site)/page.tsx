// Homepage — being rebuilt section by section. The Masthead + announcement
// banner come from the (site) route-group layout; this page only renders
// its sections. IMPORTANT: don't mount MastheadWrapper here — the layout
// already renders it, and a second mount site double-stacks the header
// after client-side navigation (the root layout persists across soft navs).

import HomepageHero from "@/components/home/HomepageHero";
import AdPlacement from "@/components/ads/AdPlacement";

export default function HomePage() {
  return (
    <>
      <HomepageHero />

      {/* Ad below the hero (404 Media's latest-post__ad slot). The ad
          layer decides what serves — size per breakpoint from the
          placement registry, house creatives until AdSense goes live. */}
      <AdPlacement
        name="home-below-hero"
        className="mx-auto w-full max-w-[1400px] px-6 pb-10 lg:pb-16"
      />
    </>
  );
}
