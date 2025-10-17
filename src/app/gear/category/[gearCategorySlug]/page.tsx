import { client as sanity } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import TagFilterGrid from "@/components/TagFilterGrid";
import NewsletterSignup from "@/components/NewsletterSignup";

export default async function GearCategoryPage({
  params,
}: {
  params: Promise<{ gearCategorySlug: string }>; // ✅ Updated type to Promise
}) {
  const { gearCategorySlug } = await params; // ✅ Await params before using

  const category = await sanity.fetch(
    `*[_type == "gearCategory" && slug.current == $gearCategorySlug][0]{ title, description }`,
    { gearCategorySlug }
  );

  const allGearPosts = await sanity.fetch(
    `*[_type == "gearPost" && gearCategory->slug.current == $gearCategorySlug] | order(publishedAt desc){
      title,
      slug,
      excerpt,
      tags,
      mainImage,
      publishedAt
    }`,
    { gearCategorySlug }
  );

  if (!category) return notFound();

  return (
    <div>
      <div className="mx-auto px-10 lg:px-32 pt-32 lg:pt-32 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-[68px] font-[550] leading-[75px] font-playfair text-dark mb-4">
            {category.title}
          </h1>
          <p className="text-[24px] font-[450] leading-[31px] text-dark">
            {category.description ||
              "Our reviews and insights on the best gear in this category."}
          </p>
        </div>

        <TagFilterGrid articles={allGearPosts} basePath="/gear/" />
      </div>

      <NewsletterSignup />
    </div>
  );
}