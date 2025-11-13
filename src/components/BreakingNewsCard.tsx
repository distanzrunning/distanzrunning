// src/components/BreakingNewsCard.tsx
import React from 'react';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { format } from 'date-fns';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: any;
  publishedAt: string;
};

interface BreakingNewsCardProps {
  post: Post;
}

const BreakingNewsCard = React.memo(function BreakingNewsCard({ post }: BreakingNewsCardProps) {
  return (
    <Link href={`/articles/post/${post.slug.current}`}>
      <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full">
        {post.mainImage && (
          <div className="relative h-48">
            <img
              src={urlFor(post.mainImage).width(400).height(250).url()}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 transition-colors duration-300">
            {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  );
});

export default BreakingNewsCard;
