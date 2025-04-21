// src/components/FeaturedArticle.tsx
import React from 'react';
import Link from 'next/link';
import { urlFor } from '@/lib/image';
import { format } from 'date-fns';

interface FeaturedArticleProps {
  post: {
    title: string;
    slug: { current: string };
    mainImage: any;
    publishedAt: string;
    excerpt: string;
  };
}

const FeaturedArticle = React.memo(function FeaturedArticle({ post }: FeaturedArticleProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative h-64 md:h-full">
        {post.mainImage && (
          <img
            src={urlFor(post.mainImage).width(800).height(500).url()}
            alt={post.title}
            className="rounded-lg object-cover w-full h-full"
          />
        )}
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-sm text-gray-500 mb-2">
          {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
        </div>
        <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <Link href={`/blog/${post.slug.current}`}>
          <div className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Read Article
          </div>
        </Link>
      </div>
    </div>
  );
});

export default FeaturedArticle;