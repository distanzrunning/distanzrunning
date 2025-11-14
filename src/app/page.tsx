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
import BreakingNewsCard from '@/components/BreakingNewsCard'
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
  let posts: Post[] = [];
  let featuredPost: Post | null = null;

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

    // Fetch regular posts
    posts = await sanity.fetch(`
      *[_type == "post"] | order(publishedAt desc)[0...6]{
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        "categoryName": category->title
      }
    `);

    // Use featured post if available, otherwise use first post
    if (!featuredPost) {
      featuredPost = posts[0];
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return a fallback if Sanity is not available
    breakingNews = [];
    posts = [];
  }

  const recentPosts = posts.slice(1);

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
        {/* Featured Post and Breaking News Section */}
        {(featuredPost || breakingNews.length > 0) && (
          <section className="py-12 bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
            <div className="max-w-[1800px] mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Featured Post - Takes up 2 columns */}
                {featuredPost && (
                  <Link href={`/articles/post/${featuredPost.slug.current}`} className="lg:col-span-2 block">
                    <div className="relative h-[600px] rounded-lg overflow-hidden group cursor-pointer">
                      {featuredPost.mainImage && (
                        <img
                          src={urlFor(featuredPost.mainImage).width(1200).height(800).url()}
                          alt={featuredPost.title}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Content overlay - top left */}
                      <div className="absolute top-6 left-6 max-w-md flex flex-col items-start text-left">
                        {/* Category tag - pink pill */}
                        {featuredPost.categoryName && (
                          <div className="inline-flex items-center px-3 py-1.5 bg-electric-pink rounded-full mb-4">
                            <span className="text-white font-medium text-xs tracking-wide uppercase leading-none">
                              {featuredPost.categoryName}
                            </span>
                          </div>
                        )}
                        <h3 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">{featuredPost.title}</h3>
                        <p className="text-white/90 text-base drop-shadow-md">{featuredPost.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Breaking News - Takes up 1 column, vertical stack */}
                {breakingNews.length > 0 && (
                  <div className="lg:col-span-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="inline-flex items-center self-start px-3 py-1.5 bg-electric-pink/10 dark:bg-electric-pink/20 rounded-full">
                        <span className="text-electric-pink dark:text-electric-pink font-medium text-xs tracking-wide uppercase leading-none">
                          Breaking
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 flex-1">
                      {breakingNews.map((post) => (
                        <BreakingNewsCard key={post._id} post={post} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Recent Posts */}
        <section className="py-12 bg-neutral-50 dark:bg-neutral-900/50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 text-neutral-900 dark:text-white transition-colors duration-300">Recent Articles</h2>
            {recentPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {post.mainImage && (
                        <img
                          src={urlFor(post.mainImage).width(400).height(250).url()}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 transition-colors duration-300">
                          {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white transition-colors duration-300">{post.title}</h3>
                        <p className="text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3 transition-colors duration-300">{post.excerpt}</p>
                        <Link href={`/articles/post/${post.slug.current}`}>
                          <div className="text-sm font-medium text-electric-pink hover:text-electric-pink/80 transition-colors duration-300">
                            Read More →
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link href="/articles">
                    <div className="inline-flex items-center px-4 py-2 border border-electric-pink text-sm font-medium rounded-md text-white bg-electric-pink hover:bg-electric-pink/90 transition-colors duration-300">
                      View All Articles
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-300 text-lg transition-colors duration-300">Content coming soon...</p>
              </div>
            )}
          </div>
        </section>
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