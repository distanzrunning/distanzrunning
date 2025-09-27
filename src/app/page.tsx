// src/app/page.tsx
import { sanity } from '@/lib/sanity'
import { urlFor } from '@/lib/image'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import NewsletterSignup from '@/components/NewsletterSignup'
import ResponsiveMarathonShowcase from '@/components/ResponsiveMarathonShowcase'
import { TypewriterText } from '@/components/TypewriterText'
import { ExploreButton } from '@/components/ExploreButton'
import { NewsletterButton } from '@/components/NewsletterModal'
import { DarkModeProvider, DarkModeToggle } from '@/components/DarkModeProvider'
import { headers } from 'next/headers'
import { Metadata } from 'next'

// Force dynamic rendering to ensure middleware runs
export const dynamic = 'force-dynamic'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  mainImage: any // Keep as any for Sanity image objects
  publishedAt: string
  excerpt: string
  categories: Array<{ title: string }>
}

// Generate metadata based on the hostname
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const hostname = headersList.get('host') || ''
  const isStagingDomain = hostname === 'distanzrunning.vercel.app'
  
  if (isStagingDomain) {
    return {
      title: 'Distanz Running | The ultimate destination for running news, gear reviews, and interactive race guides.',
      description: 'Be the first to know when we launch with exclusive running content, gear reviews, and interactive race guides.',
      metadataBase: new URL('https://distanzrunning.vercel.app'),
      alternates: {
        canonical: 'https://distanzrunning.vercel.app',
      },
    }
  }
  
  // Return default metadata for production
  return {
    title: "Distanz Running",
    description: "The latest running news, gear reviews, and interactive race guides.",
    metadataBase: new URL('https://distanzrunning.com'),
    alternates: {
      canonical: 'https://distanzrunning.com',
    },
  }
}

// Preview Mode Component with Marathon Showcase and Dark Mode
function PreviewPage() {
  return (
      <DarkModeProvider>
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0c0c0d] transition-colors duration-300">
          {/* Dark Mode Toggle */}
          <DarkModeToggle />
          
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
              <div className="flex justify-center mb-3">
                <img
                  src="/images/logo_1.svg"
                  alt="Distanz Running Logo"
                  className="block dark:hidden"
                  style={{ height: '100px', width: 'auto' }}
                />
                <img
                  src="/images/logo_white.svg"
                  alt="Distanz Running Logo"
                  className="hidden dark:block"
                  style={{ height: '100px', width: 'auto' }}
                />
              </div>

              {/* Combined blurb and typewriter text */}
              <div className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal text-center mb-16">
                <div className="mb-2">We're building the ultimate destination for</div>
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
          <main id="marathon-showcase" className="flex-1 flex flex-col px-6">
            <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col min-h-0">
              <div className="flex-1 min-h-0">
                <ResponsiveMarathonShowcase />
              </div>
            </div>
          </main>

          {/* Social links moved to bottom */}
          <div className="px-6 py-8">
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-xs text-textSubtle dark:text-neutral-400 mb-4">
                Follow us for updates
              </p>
              
              <div className="flex items-center space-x-4 justify-center mb-6">
                <a 
                  href="https://x.com/DistanzRunning" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="X / Twitter" 
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/distanz-running" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="LinkedIn" 
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/distanzrunning/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram" 
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a 
                  href="https://www.strava.com/clubs/distanzrunning" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Strava" 
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M158.4 0L7 292h89.2l62.2-116.1L220.1 292h88.5zm150.2 292l-43.9 88.2-44.6-88.2h-67.6l112.2 220 111.5-220z"/>
                  </svg>
                </a>
              </div>

              {/* Minimal footer */}
              <p className="text-xs text-textSubtler dark:text-neutral-500">
                © 2025 Distanz Running. All rights reserved.
              </p>
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
  // Get the hostname from headers to determine which page to show
  const headersList = await headers()
  const hostname = headersList.get('host') || ''
  
  // Show preview page for staging domain, development page for others
  const isStagingDomain = hostname === 'distanzrunning.vercel.app'
  
  if (isStagingDomain) {
    return <PreviewPage />;
  }

  return <DevelopmentHomePage />;
}