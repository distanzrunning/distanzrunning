// src/app/page.tsx
import { client as sanity } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { format } from 'date-fns'
import ResponsiveMarathonShowcase from '@/components/ResponsiveMarathonShowcase'
import { TypewriterText } from '@/components/TypewriterText'
import { ExploreButton } from '@/components/ExploreButton'
import { NewsletterButton } from '@/components/NewsletterModal'
import { DarkModeProvider } from '@/components/DarkModeProvider'
import SocialLinks from '@/components/SocialLinks'
import FeatureShowcase from '@/components/FeatureShowcase'
import WriteForUs from '@/components/WriteForUs'
import ScrollIndicator from '@/components/ScrollIndicator'
import { Metadata } from 'next'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  mainImage: any // Keep as any for Sanity image objects
  publishedAt: string
  excerpt: string
  categoryName?: string
  tags?: string[]
}

type GearPost = {
  _id: string
  title: string
  slug: { current: string }
  mainImage: any
  publishedAt: string
  excerpt: string
  gearCategoryName?: string
  tags?: string[]
}

type RaceGuide = {
  _id: string
  title: string
  slug: { current: string }
  mainImage: any
  eventDate: string
  location?: string
  raceCategoryName?: string
}

// Generate metadata based on preview mode
export async function generateMetadata(): Promise<Metadata> {
  const isPreviewMode = process.env.PREVIEW_MODE === 'true';

  if (isPreviewMode) {
    return {
      title: 'Distanz Running | The ultimate destination for running news, gear reviews, and interactive race guides.',
      description: 'Be the first to know when we launch with exclusive running content, gear reviews, and interactive race guides.',
    }
  }

  // Return default metadata for development/production
  return {
    title: "Distanz Running",
    description: "The latest running news, gear reviews, and interactive race guides.",
  }
}

// Preview Mode Component with Marathon Showcase and Dark Mode
function PreviewPage() {
  return (
      <DarkModeProvider>
        {/* Preload critical images for instant loading */}
        <link rel="preload" as="image" href="/images/Distanz_Logo_1600_600_Black.svg" fetchPriority="high" />
        <link rel="preload" as="image" href="/images/logo_white.svg" fetchPriority="high" />

        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
          
          {/* Coming Soon Section */}
          <div className="pt-12 pb-8 px-6">
            <div className="flex flex-col items-center text-center">

              {/* Coming Soon Pill - Using Distanz Electric Pink */}
              <div className="inline-flex items-center px-5 py-2 bg-electric-pink/10 dark:bg-electric-pink/20 rounded-full mb-3">
                <span className="text-electric-pink dark:text-electric-pink font-medium text-xs tracking-wide uppercase leading-none">
                  Coming Soon
                </span>
              </div>

              {/* Logo - smaller, switches between light and dark */}
              <div className="flex justify-center mb-3 svg-container">
                <img
                  src="/images/Distanz_Logo_1600_600_Black.svg"
                  alt="Distanz Running Logo"
                  width="400"
                  height="200"
                  className="block dark:hidden logo-svg"
                  style={{
                    height: '100px',
                    width: 'auto',
                    maxWidth: '100%'
                  }}
                />
                <img
                  src="/images/logo_white.svg"
                  alt="Distanz Running Logo"
                  width="400"
                  height="200"
                  className="hidden dark:block logo-svg"
                  style={{
                    height: '100px',
                    width: 'auto',
                    maxWidth: '100%'
                  }}
                />
              </div>

              {/* Combined blurb and typewriter text */}
              <div className="max-w-3xl mx-auto text-center mb-16 px-4">
                <div className="font-body text-[19px] sm:text-[20px] text-textSubtle dark:text-neutral-300 leading-snug font-normal mb-3 transition-colors duration-300">
                  We're building the ultimate destination for
                </div>
                <div className="flex justify-center">
                  <TypewriterText />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 items-center justify-center flex-wrap">
                <NewsletterButton />
                <ExploreButton variant="pink" />
              </div>

            </div>
          </div>

          {/* Marathon Showcase - takes up remaining space */}
          <main id="marathon-showcase" className="flex-1 flex flex-col px-6 pb-4">
            <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col min-h-0">
              <div className="flex-1 min-h-0">
                <ResponsiveMarathonShowcase />
              </div>
            </div>
          </main>

          {/* Scroll Indicator */}
          <div className="flex justify-center pb-8">
            <ScrollIndicator />
          </div>

          {/* Feature Showcase Section */}
          <section id="features" className="pt-12">
            <FeatureShowcase />
          </section>

          {/* Write For Us Section */}
          <WriteForUs />

          {/* Social links moved to bottom */}
          <div className="px-6 py-8">
            <div className="max-w-6xl mx-auto text-center">
              <SocialLinks />
            </div>
          </div>
        </div>
      </DarkModeProvider>
  );
}

// Development Homepage Component
async function DevelopmentHomePage() {
  let breakingNews: Post[] = [];
  let featuredPost: Post | null = null;
  let featuredGearPost: GearPost | null = null;
  let secondFeaturedGear: GearPost | null = null;
  let recentGear: GearPost[] = [];
  let featuredRaceGuide: RaceGuide | null = null;
  let recentRaces: RaceGuide[] = [];

  try {
    // Fetch breaking news posts
    breakingNews = await sanity.fetch(`
      *[_type == "post" && isBreaking == true] | order(publishedAt desc)[0...4]{
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        tags
      }
    `);

    // Fetch featured post
    featuredPost = await sanity.fetch(`
      *[_type == "post" && featuredPost == true] | order(publishedAt desc)[0]{
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        "categoryName": category->title
      }
    `);

    // Fetch top 2 featured gear posts for main display
    const topGear = await sanity.fetch(`
      *[_type == "gearPost"] | order(publishedAt desc)[0...2]{
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        "gearCategoryName": gearCategory->title,
        tags
      }
    `);

    // Split into main gear posts
    featuredGearPost = topGear[0] || null;
    secondFeaturedGear = topGear[1] || null;

    // Fetch 4 smaller gear posts (skip the first 2)
    recentGear = await sanity.fetch(`
      *[_type == "gearPost"] | order(publishedAt desc)[2...6]{
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        tags,
        "gearCategoryName": gearCategory->title
      }
    `);

    // Fetch featured race guide
    featuredRaceGuide = await sanity.fetch(`
      *[_type == "raceGuide" && featuredRace == true] | order(eventDate desc)[0]{
        _id,
        title,
        slug,
        mainImage,
        eventDate,
        location,
        "raceCategoryName": raceCategory->title
      }
    `);

    // Fetch recent race guides
    recentRaces = await sanity.fetch(`
      *[_type == "raceGuide"] | order(eventDate desc)[0...4]{
        _id,
        title,
        slug,
        mainImage,
        eventDate,
        location
      }
    `);
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return a fallback if Sanity is not available
    breakingNews = [];
  }

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
        {/* Featured Post and Breaking News Section */}
        {(featuredPost || breakingNews.length > 0) && (
          <section className="py-12 bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
            <div className="w-[90%] max-w-[2000px] mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 gap-6 md:gap-4 lg:grid-cols-4">
                {/* Featured Post - Takes up 3 columns */}
                {featuredPost && (
                  <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
                    {/* Featured Pill - Above Image */}
                    <div className="flex gap-3 mb-4">
                      <div className="flex items-center gap-2 self-start rounded-full border border-neutral-200 dark:border-neutral-700 backdrop-blur-md px-2.5 py-1.5 md:px-3 md:py-2">
                        <span className="text-xs md:text-sm text-neutral-900 dark:text-white font-medium">
                          Featured
                        </span>
                      </div>
                    </div>

                    <Link href={`/articles/post/${featuredPost.slug.current}`} className="group flex flex-col w-full">
                      {/* Image */}
                      <div className="relative w-full overflow-hidden rounded-lg">
                        <div style={{ paddingBottom: '56.25%' }} className="relative">
                          {featuredPost.mainImage && (
                            <img
                              src={urlFor(featuredPost.mainImage).width(1200).height(675).url()}
                              alt={featuredPost.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>

                      {/* Content below image */}
                      <div className="flex flex-col gap-2 px-1 mt-4 lg:mt-6">
                        {/* Title - Using Playfair Display */}
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-headline font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2 md:line-clamp-3 mb-3">
                          {featuredPost.title}
                        </h3>

                        {/* Excerpt */}
                        {featuredPost.excerpt && (
                          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 line-clamp-2 max-w-3xl lg:w-4/5 mb-4">
                            {featuredPost.excerpt}
                          </p>
                        )}

                        {/* Tag and Date - Category page style */}
                        <div className="flex items-center gap-3 text-[10px] font-medium leading-[14px] text-gray-500 dark:text-gray-400">
                          {featuredPost.categoryName && (
                            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-sm">
                              {featuredPost.categoryName}
                            </span>
                          )}
                          <span suppressHydrationWarning>
                            {format(new Date(featuredPost.publishedAt), 'yyyy-MM-dd')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Breaking News - Takes up 1 column */}
                {breakingNews.length > 0 && (
                  <div className="lg:col-span-1 flex flex-col gap-6 lg:bg-neutral-50 lg:dark:bg-neutral-800/50 lg:rounded-lg lg:p-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-1">
                      <div className="inline-flex items-center px-3 py-1.5 bg-electric-pink/10 dark:bg-electric-pink/20 rounded-full">
                        <span className="text-electric-pink dark:text-electric-pink font-medium text-xs tracking-wide uppercase leading-none">
                          News
                        </span>
                      </div>
                    </div>

                    {/* Articles */}
                    <div className="flex flex-col gap-6">
                      {breakingNews.map((post) => (
                        <Link
                          key={post._id}
                          href={`/articles/post/${post.slug.current}`}
                          className="group flex flex-row md:flex-col items-center md:items-start gap-6 md:gap-4 relative before:absolute before:-bottom-4 before:left-0 before:right-0 before:h-px before:bg-neutral-200 dark:before:bg-neutral-800 last:before:hidden md:before:hidden"
                        >
                          {/* Image */}
                          <div className="w-1/3 max-w-36 shrink-0 md:w-full md:max-w-none overflow-hidden rounded-lg">
                            <div style={{ paddingBottom: '56.25%' }} className="relative">
                              {post.mainImage && (
                                <img
                                  src={urlFor(post.mainImage).width(600).height(338).url()}
                                  alt={post.title}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex flex-col-reverse md:flex-col gap-2 px-1">
                            {/* Title */}
                            <h3 className="text-sm md:text-base font-semibold text-neutral-900 dark:text-white line-clamp-2 md:line-clamp-3 mb-2 md:mb-3">
                              {post.title}
                            </h3>

                            {/* Tag and Date - Category page style */}
                            <div className="flex items-center gap-3 text-[10px] font-medium leading-[14px] text-gray-500 dark:text-gray-400">
                              {post.tags?.[0] && (
                                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-sm">
                                  {post.tags[0]}
                                </span>
                              )}
                              <span suppressHydrationWarning>
                                {format(new Date(post.publishedAt), 'yyyy-MM-dd')}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Gear Section */}
        {(featuredGearPost || secondFeaturedGear || recentGear.length > 0) && (
          <section className="py-12 bg-neutral-50 dark:bg-neutral-900/50 transition-colors duration-300">
            <div className="w-[90%] max-w-[2000px] mx-auto px-4 sm:px-6">
              {/* Section Heading Pill */}
              <div className="flex items-center gap-3 mb-8">
                <div className="inline-flex items-center px-3 py-1.5 bg-electric-pink/10 dark:bg-electric-pink/20 rounded-full">
                  <span className="text-electric-pink dark:text-electric-pink font-medium text-xs tracking-wide uppercase leading-none">
                    Gear
                  </span>
                </div>
              </div>

              {/* Two Main Featured Articles */}
              {(featuredGearPost || secondFeaturedGear) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* First Featured Gear */}
                  {featuredGearPost && (
                    <Link href={`/gear/${featuredGearPost.slug.current}`} className="group flex flex-col w-full">
                      {/* Image */}
                      <div className="relative w-full overflow-hidden rounded-lg">
                        <div style={{ paddingBottom: '65%' }} className="relative">
                          {featuredGearPost.mainImage && (
                            <img
                              src={urlFor(featuredGearPost.mainImage).width(1000).height(650).url()}
                              alt={featuredGearPost.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>

                      {/* Content below image */}
                      <div className="flex flex-col gap-2 px-1 mt-4">
                        {/* Tags as pills */}
                        {featuredGearPost.tags && featuredGearPost.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap mb-2">
                            {featuredGearPost.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="inline-flex items-center px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-headline font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2">
                          {featuredGearPost.title}
                        </h3>

                        {/* Excerpt */}
                        {featuredGearPost.excerpt && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                            {featuredGearPost.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Second Featured Gear */}
                  {secondFeaturedGear && (
                    <Link href={`/gear/${secondFeaturedGear.slug.current}`} className="group flex flex-col w-full">
                      {/* Image */}
                      <div className="relative w-full overflow-hidden rounded-lg">
                        <div style={{ paddingBottom: '65%' }} className="relative">
                          {secondFeaturedGear.mainImage && (
                            <img
                              src={urlFor(secondFeaturedGear.mainImage).width(1000).height(650).url()}
                              alt={secondFeaturedGear.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>

                      {/* Content below image */}
                      <div className="flex flex-col gap-2 px-1 mt-4">
                        {/* Tags as pills */}
                        {secondFeaturedGear.tags && secondFeaturedGear.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap mb-2">
                            {secondFeaturedGear.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="inline-flex items-center px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-headline font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2">
                          {secondFeaturedGear.title}
                        </h3>

                        {/* Excerpt */}
                        {secondFeaturedGear.excerpt && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                            {secondFeaturedGear.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  )}
                </div>
              )}

              {/* Four Smaller Articles Below */}
              {recentGear.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentGear.map((gear) => (
                    <Link
                      key={gear._id}
                      href={`/gear/${gear.slug.current}`}
                      className="group flex flex-col w-full"
                    >
                      {/* Image */}
                      <div className="relative w-full overflow-hidden rounded-lg">
                        <div style={{ paddingBottom: '65%' }} className="relative">
                          {gear.mainImage && (
                            <img
                              src={urlFor(gear.mainImage).width(600).height(390).url()}
                              alt={gear.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>

                      {/* Content below image */}
                      <div className="flex flex-col gap-2 px-1 mt-4">
                        {/* Tags as pills */}
                        {gear.tags && gear.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap mb-2">
                            {gear.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="inline-flex items-center px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-base md:text-lg font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2">
                          {gear.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Races Section */}
        {(featuredRaceGuide || recentRaces.length > 0) && (
          <section className="py-12 bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
            <div className="w-[90%] max-w-[2000px] mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 gap-6 md:gap-4 lg:grid-cols-4">
                {/* Featured Race - Takes up 3 columns */}
                {featuredRaceGuide && (
                  <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
                    {/* Race Pill - Above Image */}
                    <div className="flex gap-3 mb-4">
                      <div className="flex items-center gap-2 self-start rounded-full border border-neutral-200 dark:border-neutral-700 backdrop-blur-md px-2.5 py-1.5 md:px-3 md:py-2">
                        <span className="text-xs md:text-sm text-neutral-900 dark:text-white font-medium">
                          Featured Race
                        </span>
                      </div>
                    </div>

                    <Link href={`/races/${featuredRaceGuide.slug.current}`} className="group flex flex-col w-full">
                      {/* Image */}
                      <div className="relative w-full overflow-hidden rounded-lg">
                        <div style={{ paddingBottom: '56.25%' }} className="relative">
                          {featuredRaceGuide.mainImage && (
                            <img
                              src={urlFor(featuredRaceGuide.mainImage).width(1200).height(675).url()}
                              alt={featuredRaceGuide.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>

                      {/* Content below image */}
                      <div className="flex flex-col gap-2 px-1 mt-4 lg:mt-6">
                        {/* Title - Using Playfair Display */}
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-headline font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2 md:line-clamp-3 mb-3">
                          {featuredRaceGuide.title}
                        </h3>

                        {/* Location */}
                        {featuredRaceGuide.location && (
                          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 mb-4">
                            📍 {featuredRaceGuide.location}
                          </p>
                        )}

                        {/* Category and Event Date */}
                        <div className="flex items-center gap-3 text-[10px] font-medium leading-[14px] text-gray-500 dark:text-gray-400">
                          {featuredRaceGuide.raceCategoryName && (
                            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-sm">
                              {featuredRaceGuide.raceCategoryName}
                            </span>
                          )}
                          <span suppressHydrationWarning>
                            {format(new Date(featuredRaceGuide.eventDate), 'yyyy-MM-dd')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Recent Races - Takes up 1 column */}
                {recentRaces.length > 0 && (
                  <div className="lg:col-span-1 flex flex-col gap-6 lg:bg-neutral-50 lg:dark:bg-neutral-800/50 lg:rounded-lg lg:p-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-1">
                      <div className="inline-flex items-center px-3 py-1.5 bg-electric-pink/10 dark:bg-electric-pink/20 rounded-full">
                        <span className="text-electric-pink dark:text-electric-pink font-medium text-xs tracking-wide uppercase leading-none">
                          Races
                        </span>
                      </div>
                    </div>

                    {/* Race Guides */}
                    <div className="flex flex-col gap-6">
                      {recentRaces.map((race) => (
                        <Link
                          key={race._id}
                          href={`/races/${race.slug.current}`}
                          className="group flex flex-row md:flex-col items-center md:items-start gap-6 md:gap-4 relative before:absolute before:-bottom-4 before:left-0 before:right-0 before:h-px before:bg-neutral-200 dark:before:bg-neutral-800 last:before:hidden md:before:hidden"
                        >
                          {/* Image */}
                          <div className="w-1/3 max-w-36 shrink-0 md:w-full md:max-w-none overflow-hidden rounded-lg">
                            <div style={{ paddingBottom: '56.25%' }} className="relative">
                              {race.mainImage && (
                                <img
                                  src={urlFor(race.mainImage).width(600).height(338).url()}
                                  alt={race.title}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex flex-col-reverse md:flex-col gap-2 px-1">
                            {/* Title */}
                            <h3 className="text-sm md:text-base font-semibold text-neutral-900 dark:text-white line-clamp-2 md:line-clamp-3 mb-2 md:mb-3">
                              {race.title}
                            </h3>

                            {/* Location and Event Date */}
                            <div className="flex items-center gap-3 text-[10px] font-medium leading-[14px] text-gray-500 dark:text-gray-400">
                              {race.location && (
                                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-sm">
                                  {race.location}
                                </span>
                              )}
                              <span suppressHydrationWarning>
                                {format(new Date(race.eventDate), 'yyyy-MM-dd')}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

      </div>
    </DarkModeProvider>
  )
}

export default async function HomePage() {
  // Check if we're in preview mode
  const isPreviewMode = process.env.PREVIEW_MODE === 'true';

  // Return preview page if in preview mode, otherwise return development page
  if (isPreviewMode) {
    return <PreviewPage />;
  }

  return <DevelopmentHomePage />;
}