import Masthead from "@/components/Masthead";
import { sanityFetch } from "@/sanity/lib/live";
import { featuredNewsByCategoryQuery } from "@/sanity/queries/featuredNewsByCategoryQuery";
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
// Server component: fetches the mega-menu featured items (one featured News
// article per discipline + one product per section + a featured race) and
// forwards them to the client Masthead. Mirrors SiteHeaderWrapper's fetch,
// but per-discipline for News since the Masthead splits Road/Track/Trail
// into separate mega-menu triggers.
export default async function HomePage() {
  const [news, shoe, gear, nutrition, race] = await Promise.all([
    sanityFetch({ query: featuredNewsByCategoryQuery }),
    sanityFetch({ query: featuredShoeProductQuery }),
    sanityFetch({ query: featuredGearProductQuery }),
    sanityFetch({ query: featuredNutritionProductQuery }),
    sanityFetch({ query: featuredRaceQuery }),
  ]);

  return (
    <>
      <Masthead
        featuredNews={news.data}
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
