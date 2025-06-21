// src/components/ArticleCard.tsx
import React from 'react';
import Link from 'next/link';
import { urlFor } from '@/lib/image';
import { format } from 'date-fns';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: any;
  publishedAt: string;
  excerpt: string;
};

interface ArticleCardProps {
  post: Post;
}

// Using React.memo to prevent unnecessary re-renders
const ArticleCard = React.memo(function ArticleCard({ post }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
      <Link href={`/articles/post/${post.slug.current}`}>
        <div>
          {post.mainImage && (
            <img
              src={urlFor(post.mainImage).width(400).height(250).url()}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <div className="text-sm text-gray-500 mb-2">
              {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </div>
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="text-sm font-medium text-blue-600">
              Read More →
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default ArticleCard;