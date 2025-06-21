// src/app/page.tsx
import { sanity } from '@/lib/sanity'
import { urlFor } from '@/lib/image'
import Link from 'next/link'
import { format } from 'date-fns'
import NewsletterSignup from '@/components/NewsletterSignup'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  mainImage: any // Keep as any for Sanity image objects
  publishedAt: string
  excerpt: string
  categories: Array<{ title: string }>
}

// Preview Mode Component
function PreviewPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with bigger logo */}
      <header className="pt-8 pb-4">
        <div className="flex justify-center">
          <img
            src="/images/logo.svg"
            alt="Distanz Running Logo"
            className="h-16 md:h-20 w-auto"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-lg mx-auto space-y-8">
          <h1 className="text-title-quartr text-textDefault">
            Coming Soon
          </h1>
          
          <p className="text-intro-quartr text-textSubtle">
            We&apos;re building the ultimate destination for running news, marathon guides, and gear reviews.
          </p>
          
          <div className="pt-6 border-t border-borderNeutralSubtle">
            <p className="text-meta-quartr text-textSubtle mb-6">
              Follow us for updates
            </p>
            
            {/* Social Icons - matching footer container exactly */}
            <div className="flex items-center space-x-4 justify-center">
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="X / Twitter" 
                className="hover:text-primary transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn" 
                className="hover:text-primary transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                className="hover:text-primary transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="https://strava.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Strava" 
                className="hover:text-primary transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 384 512">
                  <path d="M158.4 0L7 292h89.2l62.2-116.1L220.1 292h88.5zm150.2 292l-43.9 88.2-44.6-88.2h-67.6l112.2 220 111.5-220z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Simple footer */}
      <footer className="pb-8 pt-4">
        <div className="text-center">
          <p className="text-meta-quartr text-textSubtle">
            © 2025 Distanz Running. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
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
    <div>
      {/* Hero Section */}
      <section className="bg-secondary/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-dark sm:text-5xl md:text-6xl">
              Distanz <span className="text-primary">Running</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-muted sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              The latest running news, marathon guides and gear reviews for passionate runners.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 text-dark">Featured Article</h2>
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
                <div className="text-sm text-muted mb-2">
                  {format(new Date(featuredPost.publishedAt), 'MMMM d, yyyy')}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-dark">{featuredPost.title}</h3>
                <p className="text-muted mb-4">{featuredPost.excerpt}</p>
                <Link href={`/articles/post/${featuredPost.slug.current}`}>
                  <div className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90">
                    Read Article
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-12 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-dark">Recent Articles</h2>
          {recentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
                  >
                    {post.mainImage && (
                      <img
                        src={urlFor(post.mainImage).width(400).height(250).url()}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="text-sm text-muted mb-2">
                        {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-dark">{post.title}</h3>
                      <p className="text-muted mb-4 line-clamp-3">{post.excerpt}</p>
                      <Link href={`/articles/post/${post.slug.current}`}>
                        <div className="text-sm font-medium text-primary hover:text-primary/80">
                          Read More →
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/articles">
                  <div className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90">
                    View All Articles
                  </div>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted text-lg">Content coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup - Only if component exists */}
      {NewsletterSignup && <NewsletterSignup />}
    </div>
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