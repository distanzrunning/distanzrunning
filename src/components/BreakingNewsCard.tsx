// src/components/BreakingNewsCard.tsx
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
  tags?: string[];
};

interface BreakingNewsCardProps {
  post: Post;
}

const BreakingNewsCard = React.memo(function BreakingNewsCard({ post }: BreakingNewsCardProps) {
  return (
    <Link
      href={`/articles/post/${post.slug.current}`}
      className="group flex flex-col h-full w-full transition"
    >
      {/* Image - 16:9 ratio */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 dark:bg-neutral-800">
        {post.mainImage && (
          <Image
            src={urlFor(post.mainImage).width(1000).auto("format").url()}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL={urlFor(post.mainImage).width(10).height(7).blur(20).auto("format").url()}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 mt-4 lg:mt-6">
        <h3 className="text-[21px] font-semibold leading-[25px] text-dark dark:text-white mb-3 lg:mb-5 transition-colors duration-300">
          {post.title}
        </h3>

        {/* Tags and Date - Pinned to bottom with mt-auto */}
        <div className="flex items-center gap-3 mt-auto text-[10px] font-medium leading-[14px] text-gray-500 dark:text-gray-400 transition-colors duration-300">
          {post.tags?.[0] && (
            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-sm transition-colors duration-300">
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

export default BreakingNewsCard;
