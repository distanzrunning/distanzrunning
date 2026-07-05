// Homepage — being rebuilt section by section. The Masthead + announcement
// banner come from the (site) route-group layout; this page only renders
// its sections. IMPORTANT: don't mount MastheadWrapper here — the layout
// already renders it, and a second mount site double-stacks the header
// after client-side navigation (the root layout persists across soft navs).

import HomepageHero from "@/components/home/HomepageHero";
import AdSlot from "@/components/ui/AdSlot";

export default function HomePage() {
  return (
    <>
      <HomepageHero />

      {/* Leaderboard below the hero (404 Media's latest-post__ad slot).
          `preview` renders the house fallback until real AdSense slot
          IDs are wired — drop the prop to go live. Leaderboard is wider
          than small viewports, so mobile gets the 320×50 banner. */}
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-10 lg:pb-16">
        <div className="lg:hidden">
          <AdSlot
            slot="home-below-hero-mobile"
            size="mobile-banner"
            preview
            className="mx-auto"
          />
        </div>
        <div className="hidden lg:block">
          <AdSlot
            slot="home-below-hero"
            size="leaderboard"
            preview
            className="mx-auto"
          />
        </div>
      </div>
    </>
  );
}
