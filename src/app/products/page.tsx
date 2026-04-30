// src/app/products/page.tsx
//
// Combined product-coverage index — every productPost across
// shoes, gear, and nutrition. Covers reviews, best-of round-ups,
// and explainers (anything published as a productPost), so the
// route is named after the schema rather than "reviews" — that
// would mis-scope the broader content.
//
// Linked from the homepage Gear section ("See all articles").
// Pulls the same shape the homepage row uses so cards route to
// /{section}/{slug} via the productCategory.section field.

import { client as sanity } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import ArticleCard from "@/components/ArticleCard";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const revalidate = 60;

type ProductIndexItem = {
  _id: string;
  title: string;
  slug: string;
  href: string;
  mainImage?: SanityImageSource;
  publishedAt: string;
  excerpt?: string;
  kicker?: string;
  kickerHref?: string | null;
};

export default async function ProductsIndexPage() {
  const posts: ProductIndexItem[] = await sanity.fetch(`
    *[_type == "productPost" && defined(slug.current)] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      "href": "/" + productCategory->section + "/" + slug.current,
      mainImage,
      "publishedAt": coalesce(publishedAt, _createdAt),
      excerpt,
      "kicker": productCategory->title,
      "kickerHref": "/" + productCategory->section + "/" + productCategory->slug.current
    }
  `);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-2">
          <h1 className="m-0 text-heading-40 text-balance text-[color:var(--ds-gray-1000)]">
            Products
          </h1>
          <p className="text-balance text-[16px] leading-[1.5] text-[color:var(--ds-gray-900)] md:text-[18px]">
            Reviews, best-of round-ups, and explainers across shoes,
            gear, and nutrition.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-[color:var(--ds-gray-900)]">
            No product articles yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const imageUrl = post.mainImage
                ? urlFor(post.mainImage).width(1200).auto("format").url()
                : undefined;
              const blurDataURL = post.mainImage
                ? urlFor(post.mainImage)
                    .width(16)
                    .height(9)
                    .blur(20)
                    .auto("format")
                    .url()
                : undefined;
              return (
                <ArticleCard
                  key={post._id}
                  href={post.href}
                  title={post.title}
                  publishedAt={post.publishedAt}
                  kicker={post.kicker}
                  kickerHref={post.kickerHref ?? undefined}
                  excerpt={post.excerpt}
                  imageUrl={imageUrl}
                  blurDataURL={blurDataURL}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
