// src/components/ProductCategoryLayout.tsx
//
// Shared category landing layout (hero + TagFilterGrid) for
// /shoes/category/*, /gear/category/*, /nutrition/category/*.
// Ported from the legacy /gear/category/[gearCategorySlug] page so
// all three section category routes render identically.

import TagFilterGrid from "@/components/TagFilterGrid";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

type Article = {
  slug: { current: string };
  title: string;
  publishedAt: string;
  mainImage?: unknown;
  excerpt?: string;
  tags?: string[];
};

interface ProductCategoryLayoutProps {
  category: { title: string; description?: string | null };
  articles: ReadonlyArray<Article>;
  sectionPath: "/shoes" | "/gear" | "/nutrition";
}

export default function ProductCategoryLayout({
  category,
  articles,
  sectionPath,
}: ProductCategoryLayoutProps) {
  return (
    <div>
      <div className="mx-auto px-10 lg:px-32 pt-32 lg:pt-32 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-[68px] font-[550] leading-[75px] font-playfair text-dark mb-4">
            {category.title}
          </h1>
          <p className="text-[24px] font-[450] leading-[31px] text-dark">
            {category.description ||
              "Our reviews and insights on the best in this category."}
          </p>
        </div>

        <TagFilterGrid articles={articles} basePath={`${sectionPath}/`} />
      </div>

      <NewsletterSignup />
    </div>
  );
}
