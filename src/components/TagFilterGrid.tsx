"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { format } from "date-fns";

type Article = {
  slug: { current: string };
  title: string;
  publishedAt: string;
  mainImage?: any;
  excerpt?: string;
  tags?: string[];
};

type Props = {
  articles: Article[];
  basePath?: string;
};

const ARTICLES_PER_BATCH = 16;

export default function TagFilterGrid({ articles, basePath = "/articles/post/" }: Props) {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(ARTICLES_PER_BATCH);

  const allTags = useMemo(() => {
    return Array.from(new Set(articles.flatMap((a) => a.tags || []))).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesTag = activeTag === "All" || article.tags?.includes(activeTag);
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTag && matchesSearch;
    });
  }, [articles, activeTag, searchTerm]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-10">
      {/* Search */}
      <div className="w-full lg:max-w-xl lg:mx-auto">
        <div className="relative">
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <input
            type="text"
            placeholder="Search articles by title, topic, or keyword..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(ARTICLES_PER_BATCH);
            }}
            className="w-full pl-12 pr-5 py-3 text-sm rounded-md bg-gray-200 text-dark placeholder:text-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-400 transition"
          />
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap justify-center gap-2 px-4">
        <button
          onClick={() => {
            setActiveTag("All");
            setVisibleCount(ARTICLES_PER_BATCH);
          }}
          className={`px-4 py-1.5 text-sm rounded-full border ${
            activeTag === "All"
              ? "bg-primary-light text-primary border-primary font-semibold"
              : "bg-gray-100 text-muted border-gray-300 hover:bg-gray-200"
          } transition`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setActiveTag(tag);
              setVisibleCount(ARTICLES_PER_BATCH);
            }}
            className={`px-4 py-1.5 text-sm rounded-full border ${
              activeTag === tag
                ? "bg-primary-light text-primary border-primary font-semibold"
                : "bg-gray-100 text-muted border-gray-300 hover:bg-gray-200"
            } transition`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-x-3 gap-y-8">
        {visibleArticles.map((article) => (
          <Link
            key={article.slug.current}
            href={`${basePath}${article.slug.current}`}
            className="group flex flex-col h-full w-full transition"
          >
            {/* Image - Keeping original 16:9 ratio but making it wider */}
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
              {article.mainImage && (
                <Image
                  src={urlFor(article.mainImage).width(1000).auto("format").url()}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={urlFor(article.mainImage).width(10).height(7).blur(20).auto("format").url()}
                />
              )}
            </div>

            {/* Content - Using flex-1 and flex-col to ensure consistent height */}
            <div className="flex flex-col flex-1 mt-4 lg:mt-6">
              <h3 className="text-[21px] font-semibold leading-[25px] text-dark mb-3 lg:mb-5">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-[16px] font-medium leading-[20px] text-muted line-clamp-3 mb-4 lg:mb-6 flex-1">
                  {article.excerpt}
                </p>
              )}
              
              {/* Tags and Date - Pinned to bottom with mt-auto */}
              <div className="flex items-center gap-3 mt-auto text-[10px] font-medium leading-[14px] text-gray-500">
                {article.tags?.[0] && (
                  <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-sm">
                    {article.tags[0]}
                  </span>
                )}
                <span suppressHydrationWarning>
                  {format(new Date(article.publishedAt), "yyyy-MM-dd")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View More */}
      {visibleCount < filteredArticles.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + ARTICLES_PER_BATCH)}
            className="px-6 py-2 text-sm font-medium text-white bg-black hover:bg-pink-500 rounded-md transition-colors duration-200"
          >
            View more
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <p className="text-center text-muted text-sm">No articles found.</p>
      )}
    </div>
  );
}