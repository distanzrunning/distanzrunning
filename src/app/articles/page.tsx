// src/app/articles/page.tsx
import { client as sanity } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import ArticleCard from '@/components/ArticleCard';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

type Post = {
  _id: string;
  title: string;
  slug: string;
  mainImage: SanityImageSource;
  publishedAt: string;
  excerpt: string;
  category?: string;
};

export default async function ArticlesPage() {
  const posts: Post[] = await sanity.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      excerpt,
      "category": category->title
    }
  `);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Articles</h1>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const imageUrl = post.mainImage
              ? urlFor(post.mainImage).width(1200).auto('format').url()
              : undefined;
            const blurDataURL = post.mainImage
              ? urlFor(post.mainImage).width(16).height(9).blur(20).auto('format').url()
              : undefined;
            return (
              <ArticleCard
                key={post._id}
                href={`/articles/${post.slug}`}
                title={post.title}
                publishedAt={post.publishedAt}
                kicker={post.category}
                excerpt={post.excerpt}
                imageUrl={imageUrl}
                blurDataURL={blurDataURL}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}