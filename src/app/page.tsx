// src/app/page.tsx
import { sanity } from '@/lib/sanity';
import { urlFor } from '@/lib/image';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

// Define type for posts
type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: any;
  publishedAt: string;
  excerpt: string;
  categories: Array<{ title: string }>;
};

export default async function HomePage() {
  // Fetch featured posts and recent posts
  const posts: Post[] = await sanity.fetch(`
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

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section className="py-16">
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
                <Link href={`/articles/${featuredPost.slug.current}`}>
                  <div className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-white bg-primary hover:bg-dark hover:border-dark transition-colors duration-300">
                    Read Article
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-dark">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
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
                  <Link href={`/articles/${post.slug.current}`}>
                    <div className="text-sm font-medium text-primary hover:text-dark transition-colors duration-300">
                      Read More →
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/articles">
              <div className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-white bg-primary hover:bg-dark hover:border-dark transition-colors duration-300">
                View All Articles
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/90 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-12 md:p-12 md:flex md:items-center md:justify-between">
              <div className="md:w-0 md:flex-1">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Get running updates in your inbox
                </h2>
                <p className="mt-3 max-w-3xl text-white opacity-90">
                  Sign up for our newsletter to receive the latest running news, race guides, and gear reviews.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:ml-10">
                <form className="sm:flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-5 py-3 border border-transparent placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
                  />
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 transition-colors duration-300"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}