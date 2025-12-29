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
import ExpandableTags from '@/components/ExpandableTags'
import { Metadata } from 'next'
import { calculateReadingTime } from '@/lib/readingTime'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  mainImage: any // Keep as any for Sanity image objects
  publishedAt: string
  excerpt: string
  categoryName?: string
  tags?: string[]
  body?: any[] // Portable Text body for reading time calculation
  readingTime?: number // Calculated reading time in minutes
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
  city?: string
  stateRegion?: string
  country?: string
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
          <div className="pt-12 pb-8 px-3 sm:px-6">
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
              <div className="max-w-3xl mx-auto text-center mb-16 px-3 sm:px-4">
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
          <main id="marathon-showcase" className="flex-1 flex flex-col px-3 sm:px-6 pb-4">
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
          <div className="px-3 sm:px-6 py-8">
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
  let recentRaces: RaceGuide[] = [];

  try {
    // Fetch breaking news posts
    const breakingNewsRaw = await sanity.fetch(`
      *[_type == "post" && isBreaking == true] | order(publishedAt desc)[0...6]{
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        tags,
        "categoryName": category->title,
        body
      }
    `);

    // Calculate reading time for breaking news
    breakingNews = breakingNewsRaw.map((post: Post) => ({
      ...post,
      readingTime: post.body ? calculateReadingTime(post.body) : 5
    }));

    // Fetch featured post
    const featuredPostRaw = await sanity.fetch(`
      *[_type == "post" && featuredPost == true] | order(publishedAt desc)[0]{
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        "categoryName": category->title,
        body
      }
    `);

    // Calculate reading time for featured post
    if (featuredPostRaw) {
      featuredPost = {
        ...featuredPostRaw,
        readingTime: featuredPostRaw.body ? calculateReadingTime(featuredPostRaw.body) : 5
      };
    }

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

    // Fetch race guides for horizontal carousel
    recentRaces = await sanity.fetch(`
      *[_type == "raceGuide"] | order(eventDate desc)[0...12]{
        _id,
        title,
        slug,
        mainImage,
        eventDate,
        city,
        stateRegion,
        country,
        "raceCategoryName": raceCategory->title
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
          <section className="bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Featured Post - Takes up 8 columns (66.67%) */}
              {featuredPost && (
                <div className="lg:col-span-8 lg:sticky lg:top-20 lg:self-start border-b border-neutral-200 dark:border-neutral-800">
                  <div className="w-[95%] mx-auto">
                    <div className="flex flex-col w-full pb-4 lg:pr-4">
                      <Link href={`/articles/post/${featuredPost.slug.current}`} className="group transition-opacity duration-200 hover:opacity-80">
                        {/* Featured & Category Tags */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 text-xs font-medium uppercase text-neutral-600 dark:text-neutral-400 border-l border-b border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-100 dark:hover:border-neutral-800 transition-colors">
                            FEATURED
                          </span>
                          {featuredPost.categoryName && (
                            <span className="px-2 py-1 text-xs font-medium uppercase text-electric-pink border-l border-b border-neutral-300 dark:border-neutral-600 hover:bg-electric-pink hover:text-white hover:border-electric-pink transition-colors">
                              {featuredPost.categoryName.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Title with Subheadline */}
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-headline leading-tight mb-3 group/title">
                          <span className="font-bold text-neutral-900 dark:text-white group-hover/title:underline group-hover/title:decoration-electric-pink group-hover/title:decoration-1 group-hover/title:underline-offset-2 inline cursor-pointer">
                            {featuredPost.title}
                          </span>
                          {featuredPost.excerpt && (
                            <>
                              {' '}
                              <svg className="inline-block w-4 h-4 mx-1 align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              {' '}
                              <span className="font-[var(--font-headline-sc)] font-normal text-neutral-600 dark:text-neutral-400 group-hover/title:underline group-hover/title:decoration-electric-pink group-hover/title:decoration-1 group-hover/title:underline-offset-2 inline">
                                {featuredPost.excerpt}
                              </span>
                            </>
                          )}
                        </h2>

                        {/* Date & Reading Time */}
                        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-4 uppercase">
                          <span suppressHydrationWarning>
                            {format(new Date(featuredPost.publishedAt), 'd MMM yyyy').toUpperCase()}
                          </span>
                          <span>|</span>
                          <span>{featuredPost.readingTime || 5} MIN READ</span>
                        </div>

                        {/* Image */}
                        <div className="relative w-full overflow-hidden rounded-sm">
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
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Breaking News - Takes up 4 columns (33.33%) */}
              {breakingNews.length > 0 && (
                <div className="lg:col-span-4 flex flex-col border-l border-neutral-200 dark:border-neutral-800">
                  <div className="w-[95%] mx-auto">
                    {/* Articles */}
                    <div className="flex flex-col">
                      {breakingNews.map((post) => (
                        <div
                          key={post._id}
                          className="group border-b border-neutral-200 dark:border-neutral-800"
                        >
                          <div className="flex flex-row items-start gap-3 pt-5 pb-5 lg:pl-0">
                          {/* Text Content - Left Side */}
                          <div className="flex-1 flex flex-col gap-2">
                            {/* Tags - NEWS + Category */}
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="px-2 py-1 text-[10px] font-medium uppercase text-neutral-600 dark:text-neutral-400 border-l border-b border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-100 dark:hover:border-neutral-800 transition-colors">
                                NEWS
                              </span>
                              {post.categoryName && (
                                <Link
                                  href={`/articles/category/${post.categoryName.toLowerCase()}`}
                                  className="px-2 py-1 text-[10px] font-medium uppercase text-electric-pink border-l border-b border-neutral-300 dark:border-neutral-600 hover:bg-electric-pink hover:text-white hover:border-electric-pink transition-colors"
                                >
                                  {post.categoryName.toUpperCase()}
                                </Link>
                              )}
                            </div>

                            {/* Title */}
                            <Link href={`/articles/post/${post.slug.current}`}>
                              <h3 className="text-[18px] leading-tight font-bold text-neutral-900 dark:text-white line-clamp-3 hover:underline hover:decoration-electric-pink hover:decoration-1 hover:underline-offset-2">
                                {post.title}
                              </h3>
                            </Link>

                            {/* Date and Read Time */}
                            <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 uppercase">
                              <span suppressHydrationWarning>
                                {format(new Date(post.publishedAt), 'd MMM yyyy').toUpperCase()}
                              </span>
                              <span>|</span>
                              <span>{post.readingTime || 5} MIN READ</span>
                            </div>
                          </div>

                          {/* Image - Right Side */}
                          <Link
                            href={`/articles/post/${post.slug.current}`}
                            className="w-1/3 shrink-0 overflow-hidden rounded-sm transition-opacity duration-200 hover:opacity-80"
                          >
                            <div style={{ paddingBottom: '66.67%' }} className="relative">
                              {post.mainImage && (
                                <img
                                  src={urlFor(post.mainImage).width(400).height(267).url()}
                                  alt={post.title}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              )}
                            </div>
                          </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Write For Us Section */}
        <WriteForUs />

        {/* Gear Section */}
        {(featuredGearPost || secondFeaturedGear || recentGear.length > 0) && (
          <section className="py-12 bg-neutral-50 dark:bg-neutral-900/50 transition-colors duration-300">
            <div className="w-[95%] mx-auto px-2 sm:px-3">
              {/* Section Header */}
              <div className="flex items-end justify-between gap-8 mb-8 md:mb-11">
                <div className="flex flex-col gap-3">
                  {/* Pill */}
                  <div className="inline-flex items-center self-start px-3 py-1.5 bg-electric-pink/10 dark:bg-electric-pink/20 rounded-full mb-1">
                    <span className="text-electric-pink dark:text-electric-pink font-medium text-xs tracking-wide uppercase leading-none">
                      Gear
                    </span>
                  </div>
                  {/* Title */}
                  <h2 className="font-body text-2xl md:text-4xl font-semibold text-neutral-900 dark:text-white">
                    Gear Reviews
                  </h2>
                  {/* Subtitle */}
                  <p className="font-body text-sm md:text-base font-medium text-neutral-600 dark:text-neutral-400 max-w-3xl">
                    From carbon-plated race shoes to GPS watches and nutrition, we review the latest running tech to uncover the top must-haves for runners
                  </p>
                </div>
                {/* All Gear Articles Link - Hidden on mobile */}
                <Link
                  href="/gear"
                  className="hidden md:flex items-center gap-1.5 px-4 h-9 rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <span className="font-body text-sm font-medium text-neutral-900 dark:text-white">All gear articles</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Two Main Featured Articles */}
              {(featuredGearPost || secondFeaturedGear) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* First Featured Gear */}
                  {featuredGearPost && (
                    <div className="flex flex-col w-full">
                      <Link href={`/gear/${featuredGearPost.slug.current}`} className="group transition-opacity duration-200 hover:opacity-80">
                        {/* Image */}
                        <div className="relative w-full overflow-hidden rounded-sm">
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

                        {/* Title and Excerpt */}
                        <div className="flex flex-col gap-2 px-1 mt-4">
                          {/* Title */}
                          <h3 className="text-xl md:text-2xl font-body font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2 mb-3">
                            {featuredGearPost.title}
                          </h3>

                          {/* Excerpt */}
                          {featuredGearPost.excerpt && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 mb-4">
                              {featuredGearPost.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>

                      {/* Tags and Date - Outside gear link */}
                      <div className="flex items-center gap-2 text-xs md:text-[10px] font-medium leading-[14px] text-gray-500 dark:text-gray-400 px-1">
                        {/* Primary Category Tag - Linked */}
                        {featuredGearPost.gearCategoryName && (
                          <Link
                            href={`/gear/category/${featuredGearPost.gearCategoryName.toLowerCase().replace(/\s+/g, '-')}`}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            {featuredGearPost.gearCategoryName}
                          </Link>
                        )}
                        {/* Secondary Tags - Expandable */}
                        {featuredGearPost.tags && <ExpandableTags tags={featuredGearPost.tags} />}
                        <span suppressHydrationWarning>
                          {format(new Date(featuredGearPost.publishedAt), 'yyyy-MM-dd')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Second Featured Gear */}
                  {secondFeaturedGear && (
                    <div className="flex flex-col w-full">
                      <Link href={`/gear/${secondFeaturedGear.slug.current}`} className="group transition-opacity duration-200 hover:opacity-80">
                        {/* Image */}
                        <div className="relative w-full overflow-hidden rounded-sm">
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

                        {/* Title and Excerpt */}
                        <div className="flex flex-col gap-2 px-1 mt-4">
                          {/* Title */}
                          <h3 className="text-xl md:text-2xl font-body font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2 mb-3">
                            {secondFeaturedGear.title}
                          </h3>

                          {/* Excerpt */}
                          {secondFeaturedGear.excerpt && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 mb-4">
                              {secondFeaturedGear.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>

                      {/* Tags and Date - Outside gear link */}
                      <div className="flex items-center gap-2 text-xs md:text-[10px] font-medium leading-[14px] text-gray-500 dark:text-gray-400 px-1">
                        {/* Primary Category Tag - Linked */}
                        {secondFeaturedGear.gearCategoryName && (
                          <Link
                            href={`/gear/category/${secondFeaturedGear.gearCategoryName.toLowerCase().replace(/\s+/g, '-')}`}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            {secondFeaturedGear.gearCategoryName}
                          </Link>
                        )}
                        {/* Secondary Tags - Expandable */}
                        {secondFeaturedGear.tags && <ExpandableTags tags={secondFeaturedGear.tags} />}
                        <span suppressHydrationWarning>
                          {format(new Date(secondFeaturedGear.publishedAt), 'yyyy-MM-dd')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Four Smaller Articles Below */}
              {recentGear.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentGear.map((gear) => (
                      <div key={gear._id} className="flex flex-col w-full">
                        <Link
                          href={`/gear/${gear.slug.current}`}
                          className="group transition-opacity duration-200 hover:opacity-80"
                        >
                          {/* Image */}
                          <div className="relative w-full overflow-hidden rounded-sm">
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

                          {/* Title */}
                          <div className="px-1 mt-4">
                            <h3 className="text-lg md:text-lg font-body font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2 mb-3">
                              {gear.title}
                            </h3>
                          </div>
                        </Link>

                        {/* Tags and Date - Outside gear link */}
                        <div className="flex items-center gap-2 text-xs md:text-[10px] font-medium leading-[14px] text-gray-500 dark:text-gray-400 px-1">
                          {/* Primary Category Tag - Linked */}
                          {gear.gearCategoryName && (
                            <Link
                              href={`/gear/category/${gear.gearCategoryName.toLowerCase().replace(/\s+/g, '-')}`}
                              className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              {gear.gearCategoryName}
                            </Link>
                          )}
                          {/* Secondary Tags - Expandable */}
                          {gear.tags && <ExpandableTags tags={gear.tags} />}
                          <span suppressHydrationWarning>
                            {format(new Date(gear.publishedAt), 'yyyy-MM-dd')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* All Gear Articles Link - Mobile only */}
                  <div className="block md:hidden mt-8">
                    <Link
                      href="/gear"
                      className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors w-full"
                    >
                      <span className="font-body text-sm font-medium text-neutral-900 dark:text-white">All gear articles</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Races Section - Horizontal Scrolling Carousel */}
        {recentRaces.length > 0 && (
          <section className="py-12 bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
            <div className="w-[95%] mx-auto px-2 sm:px-3">
              {/* Section Header */}
              <div className="flex items-end justify-between gap-8 mb-8 md:mb-11">
                <div className="flex flex-col gap-3">
                  {/* Pill */}
                  <div className="inline-flex items-center self-start px-3 py-1.5 bg-electric-pink/10 dark:bg-electric-pink/20 rounded-full mb-1">
                    <span className="text-electric-pink dark:text-electric-pink font-medium text-xs tracking-wide uppercase leading-none">
                      Races
                    </span>
                  </div>
                  {/* Title */}
                  <h2 className="font-body text-2xl md:text-4xl font-semibold text-neutral-900 dark:text-white">
                    Race Guides
                  </h2>
                  {/* Subtitle */}
                  <p className="font-body text-sm md:text-base font-medium text-neutral-600 dark:text-neutral-400 max-w-3xl">
                    Find your next race with detailed race guides, course analysis, and insider tips on thousands of the world&apos;s greatest races
                  </p>
                </div>
                {/* All Races Link - Hidden on mobile */}
                <Link href="/races" className="hidden md:flex items-center gap-1.5 px-4 h-9 rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <span className="font-body text-sm font-medium text-neutral-900 dark:text-white">All races</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Horizontal Scrolling Container */}
              <div className="overflow-x-auto -mx-2 px-2 sm:-mx-3 sm:px-3 scrollbar-hide">
                <div className="flex gap-4 md:gap-6 pb-4">
                  {recentRaces.map((race) => (
                    <Link
                      key={race._id}
                      href={`/races/${race.slug.current}`}
                      className="group flex-shrink-0 w-[340px] md:w-[400px] transition-opacity duration-200 hover:opacity-80"
                    >
                      <div className="flex flex-col gap-0">
                        {/* Image Container */}
                        <div className="relative w-full">
                          {/* Image Wrapper */}
                          <div className="relative overflow-hidden rounded-t-lg">
                            <div style={{ paddingBottom: '65%' }} className="relative">
                              {race.mainImage && (
                                <img
                                  src={urlFor(race.mainImage).width(800).height(520).url()}
                                  alt={race.title}
                                  className="absolute inset-0 w-full h-full object-cover object-center block z-[1]"
                                  loading="eager"
                                />
                              )}
                            </div>
                          </div>

                          {/* Distance/Category Pill - Top Right */}
                          {race.raceCategoryName && (
                            <div className="absolute top-3 right-3 z-[2]">
                              <div className="px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full">
                                <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                                  {race.raceCategoryName}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content Card */}
                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-b-lg px-5 py-5">
                          <div className="flex items-center justify-between gap-3">
                            {/* Title and Location */}
                            <div className="flex flex-col gap-1 flex-1">
                              <h3 className="font-body text-xl md:text-lg font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2">
                                {race.title}
                              </h3>
                              {(race.city || race.stateRegion || race.country) && (
                                <p className="font-body text-sm font-normal text-neutral-600 dark:text-neutral-400">
                                  {[race.city, race.stateRegion, race.country].filter(Boolean).join(', ')}
                                </p>
                              )}
                            </div>

                            {/* Date Container - Right Side (Rounded) */}
                            <div className="flex flex-col items-center justify-center gap-0 flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-16 h-16">
                              <p className="font-body text-xs font-medium uppercase text-neutral-900 dark:text-white" suppressHydrationWarning>
                                {format(new Date(race.eventDate), 'MMM')}
                              </p>
                              <p className="font-body text-2xl font-semibold leading-tight text-neutral-900 dark:text-white" suppressHydrationWarning>
                                {format(new Date(race.eventDate), 'dd')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* All Races Link - Mobile only */}
              <div className="block md:hidden mt-8">
                <Link
                  href="/races"
                  className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-lg bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors w-full"
                >
                  <span className="font-body text-sm font-medium text-neutral-900 dark:text-white">All races</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
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