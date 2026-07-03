import Masthead from "@/components/Masthead";
import { sanityFetch } from "@/sanity/lib/live";
import {
  featuredShoeProductQuery,
  featuredGearProductQuery,
  featuredNutritionProductQuery,
} from "@/sanity/queries/featuredProductQueries";
import { featuredRaceQuery } from "@/sanity/queries/featuredRaceQuery";

// Homepage — rebuilt from scratch. Renders bare (LayoutContent gives it a
// full-height <main> with no production chrome + the site-wide announcement
// bar), so the homepage owns its own header (Masthead) + sections below.
//
// Server component: fetches the mega-menu featured items (one product per
// section + a featured race) and forwards them to the client Masthead. The
// editorial triggers (Road/Track/Trail) are plain links with no panel, so
// they need no featured data.
export default async function HomePage() {
  const [shoe, gear, nutrition, race] = await Promise.all([
    sanityFetch({ query: featuredShoeProductQuery }),
    sanityFetch({ query: featuredGearProductQuery }),
    sanityFetch({ query: featuredNutritionProductQuery }),
    sanityFetch({ query: featuredRaceQuery }),
  ]);

  return (
    <>
      <Masthead
        featuredShoe={shoe.data}
        featuredGear={gear.data}
        featuredNutrition={nutrition.data}
        featuredRace={race.data}
      />
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        {/* Homepage sections build here. */}
      </div>
    </>
  );
}
