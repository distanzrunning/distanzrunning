import { sanityFetch } from "@/sanity/lib/live";
import { categoryArticlesQuery } from "@/sanity/queries/categoryArticlesQuery";
import { notFound } from "next/navigation";
import TagFilterGrid from "@/components/TagFilterGrid";
import NewsletterSignup from "@/components/NewsletterSignup";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>; // ✅ Updated type to Promise
}) {
  const { categorySlug } = await params; // ✅ Await params before using

  const result = await sanityFetch({
    query: categoryArticlesQuery,
    params: { categorySlug }, // ✅ Use the awaited value
  });

  const { category, articles } = result.data;

  if (!category) return notFound();

  return (
    <div>
      <div className="mx-auto px-10 lg:px-32 pt-32 lg:pt-32 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-[68px] font-[550] leading-[75px] font-playfair text-dark mb-4">
            {category.title}
          </h1>
          <p className="text-[24px] font-[450] leading-[31px] text-dark">
            {category.description}
          </p>
        </div>

        <TagFilterGrid articles={articles} basePath="/articles/post/" />
      </div>

      <NewsletterSignup />
    </div>
  );
}