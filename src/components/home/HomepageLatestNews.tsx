// src/components/home/HomepageLatestNews.tsx
//
// Homepage Latest News — Quartr's "Latest from Edge" section structure
// on our primitives: header row (section title + subtle tagline left,
// tertiary view-all button right — the button drops below the grid on
// mobile), then a two-column grid of the canonical ArticleCard.
//
// Server component: fetches the four newest posts (minus the hero's
// article — see latestNewsQuery) and resolves image URLs + LQIPs at
// the data boundary per the DS convention.

import { ChevronRight } from "lucide-react";

import ArticleCard from "@/components/ui/ArticleCard";
import { ButtonLink } from "@/components/ui/Button";
import { sanityFetch } from "@/sanity/lib/live";
import { latestNewsQuery } from "@/sanity/queries/latestNewsQuery";
import { urlFor } from "@/sanity/lib/image";
import { formatDisplayDate } from "@/lib/dates";

const ALL_ARTICLES_HREF = "/articles";

function AllArticlesButton() {
  return (
    <ButtonLink
      href={ALL_ARTICLES_HREF}
      variant="tertiary"
      size="medium"
      suffixIcon={<ChevronRight />}
    >
      All articles
    </ButtonLink>
  );
}

export default async function HomepageLatestNews() {
  const { data: posts } = await sanityFetch({ query: latestNewsQuery });
  if (!posts?.length) return null;

  return (
    <section
      aria-label="Latest news"
      className="mx-auto w-full max-w-content px-6 py-16 lg:py-20"
    >
      <div className="flex w-full flex-col gap-8 md:gap-11">
        {/* Header row — title + tagline left, view-all right (desktop). */}
        <div className="flex items-center justify-between gap-8 md:items-end">
          <div className="flex flex-col gap-3">
            <h2 className="text-heading-24 md:text-heading-32 text-balance text-textDefault">
              Latest News
            </h2>
            <p className="text-copy-14 md:text-copy-16 text-balance text-textSubtle">
              The latest stories from road, track, and trail.
            </p>
          </div>
          <div className="hidden md:block">
            <AllArticlesButton />
          </div>
        </div>

        {/* Card grid — Quartr's rhythm (tight columns, roomy rows). */}
        <div className="grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 md:gap-y-12">
          {posts.map(
            (post: {
              _id: string;
              title: string;
              excerpt?: string | null;
              publishedAt?: string | null;
              mainImage?: unknown;
              lqip?: string | null;
              category?: { title: string; slug: string } | null;
              href: string;
            }) => (
              <ArticleCard
                key={post._id}
                size="lg"
                chrome="plain"
                href={post.href}
                title={post.title}
                excerpt={post.excerpt}
                imageUrl={
                  post.mainImage
                    ? urlFor(post.mainImage as Parameters<typeof urlFor>[0])
                        .width(1240)
                        .height(775)
                        .auto("format")
                        .url()
                    : null
                }
                blurDataURL={post.lqip}
                imageSizes="(max-width: 768px) 100vw, 620px"
                category={
                  post.category
                    ? {
                        label: post.category.title,
                        href: `/articles/${post.category.slug}`,
                      }
                    : null
                }
                publishedAt={post.publishedAt ? formatDisplayDate(post.publishedAt) : null}
              />
            ),
          )}
        </div>

        {/* Mobile view-all — below the grid, as Quartr does. */}
        <div className="md:hidden">
          <AllArticlesButton />
        </div>
      </div>
    </section>
  );
}
