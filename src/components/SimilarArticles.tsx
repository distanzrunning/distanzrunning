// src/components/SimilarArticles.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { format } from 'date-fns';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: any;
  publishedAt: string;
  excerpt: string;
  tags?: string[];
  category?: {
    title: string;
    slug: { current: string };
  };
};

interface SimilarArticlesProps {
  articles: Post[];
  currentArticleId: string;
  maxArticles?: number;
}

const SimilarArticleCard = React.memo(function SimilarArticleCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/articles/post/${post.slug.current}`}
      className="group flex flex-col h-full w-full transition"
    >
      {/* Image - Exact same styling as TagFilterGrid */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
        {post.mainImage && (
          <Image
            src={urlFor(post.mainImage).width(1000).auto("format").url()}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL={urlFor(post.mainImage).width(10).height(7).blur(20).auto("format").url()}
          />
        )}
      </div>

      {/* Content - Exact same styling as TagFilterGrid */}
      <div className="flex flex-col flex-1 mt-4 lg:mt-6">
        <h3 className="text-[21px] font-semibold leading-[25px] text-dark mb-3 lg:mb-5">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-[16px] font-medium leading-[20px] text-muted line-clamp-3 mb-4 lg:mb-6 flex-1">
            {post.excerpt}
          </p>
        )}
        
        {/* Tags and Date - Exact same styling as TagFilterGrid */}
        <div className="flex items-center gap-3 mt-auto text-[10px] font-medium leading-[14px] text-gray-500">
          {post.tags?.[0] && (
            <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-sm">
              {post.tags[0]}
            </span>
          )}
          <span suppressHydrationWarning>
            {format(new Date(post.publishedAt), "yyyy-MM-dd")}
          </span>
        </div>
      </div>
    </Link>
  );
});

const SimilarArticles: React.FC<SimilarArticlesProps> = ({ 
  articles, 
  currentArticleId, 
  maxArticles = 4 
}) => {
  // Filter out the current article and limit the number of articles
  const filteredArticles = articles
    .filter(article => article._id !== currentArticleId)
    .slice(0, maxArticles);

  if (filteredArticles.length === 0) {
    return null;
  }

  return (
    <section className="pt-32 pb-16">
      <div className="mx-auto px-10 lg:px-32">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Related articles
          </h2>
        </div>
        
        {/* Grid - 4 column layout for related articles */}
        <div className="w-full max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8">
          {filteredArticles.map((article) => (
            <SimilarArticleCard key={article._id} post={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarArticles;