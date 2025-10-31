// src/app/page.tsx
import { client as sanity } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import NewsletterSignup from '@/components/NewsletterSignup'
import ResponsiveMarathonShowcase from '@/components/ResponsiveMarathonShowcase'
import { TypewriterText } from '@/components/TypewriterText'
import { ExploreButton } from '@/components/ExploreButton'
import { NewsletterButton } from '@/components/NewsletterModal'
import { DarkModeProvider, DarkModeToggle } from '@/components/DarkModeProvider'
import SocialLinks from '@/components/SocialLinks'
import FeatureShowcase from '@/components/FeatureShowcase'
import WriteForUs from '@/components/WriteForUs'
import ScrollIndicator from '@/components/ScrollIndicator'
import { Metadata } from 'next'
import { PreviewDarkModeToggle } from '@/components/PreviewDarkModeToggle'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  mainImage: any // Keep as any for Sanity image objects
  publishedAt: string
  excerpt: string
  categories: Array<{ title: string }>
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

        {/* Dark Mode Toggle - fixed position toggle specific to preview page */}
        <PreviewDarkModeToggle />

        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
          
          {/* Coming Soon Section */}
          <div className="pt-12 pb-8 px-6">
            <div className="flex flex-col items-center text-center">
              
              {/* Coming Soon Pill - no border, smaller */}
              <div className="inline-flex items-center px-5 py-2 bg-pink-500/10 dark:bg-pink-500/20 rounded-full mb-3">
                <span className="text-pink-600 dark:text-pink-400 font-medium text-xs tracking-wide uppercase leading-none">
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
                <div className="text-[19px] sm:text-[20px] text-neutral-600 dark:text-neutral-300 leading-snug font-medium mb-3 transition-colors duration-300">
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
  let posts: Post[] = [];
  
  try {
    posts = await sanity.fetch(`
      *[_type == "post"] | order(publishedAt desc)[0...6]{
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        "categories": categories[]->title
      }
    `);
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return a fallback if Sanity is not available
    posts = [];
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <DarkModeProvider>
      <div className="dark:bg-[#0c0c0d] transition-colors duration-300">
        {/* Dark Mode Toggle */}
        <DarkModeToggle />
        
        {/* Hero Section */}
        <section className="bg-secondary/20 dark:bg-neutral-800/20 py-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-dark dark:text-white sm:text-5xl md:text-6xl transition-colors duration-300">
                Distanz <span className="text-primary">Running</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-muted dark:text-neutral-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl transition-colors duration-300">
                The latest running news, marathon guides and gear reviews for passionate runners.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-12 dark:bg-[#0c0c0d] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-8 text-dark dark:text-white transition-colors duration-300">Featured Article</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative h-64 md:h-full">
                  {featuredPost.mainImage && (
                    <img
                      src={urlFor(featuredPost.mainImage).width(800).height(500).url()}
                      alt={featuredPost.title}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-sm text-muted dark:text-neutral-400 mb-2 transition-colors duration-300">
                    {format(new Date(featuredPost.publishedAt), 'MMMM d, yyyy')}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-dark dark:text-white transition-colors duration-300">{featuredPost.title}</h3>
                  <p className="text-muted dark:text-neutral-300 mb-4 transition-colors duration-300">{featuredPost.excerpt}</p>
                  <Link href={`/articles/post/${featuredPost.slug.current}`}>
                    <div className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300">
                      Read Article
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent Posts */}
        <section className="py-12 bg-secondary/10 dark:bg-neutral-800/10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 text-dark dark:text-white transition-colors duration-300">Recent Articles</h2>
            {recentPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-300"
                    >
                      {post.mainImage && (
                        <img
                          src={urlFor(post.mainImage).width(400).height(250).url()}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="text-sm text-muted dark:text-neutral-400 mb-2 transition-colors duration-300">
                          {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-dark dark:text-white transition-colors duration-300">{post.title}</h3>
                        <p className="text-muted dark:text-neutral-300 mb-4 line-clamp-3 transition-colors duration-300">{post.excerpt}</p>
                        <Link href={`/articles/post/${post.slug.current}`}>
                          <div className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300">
                            Read More →
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link href="/articles">
                    <div className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300">
                      View All Articles
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted dark:text-neutral-300 text-lg transition-colors duration-300">Content coming soon...</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup - Only if component exists */}
        {NewsletterSignup && <NewsletterSignup />}
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