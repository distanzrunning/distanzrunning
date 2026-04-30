// src/components/ArticleCategoryLayout.tsx
//
// Renders an articles category landing page. Hero (title + lead) +
// TagFilterGrid of posts in that category. Extracted from the
// legacy /articles/category/[categorySlug]/page.tsx so the unified
// /articles/[slug] handler can render either this or
// ArticlePostLayout based on what the slug resolves to.

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

interface ArticleCategoryLayoutProps {
  category: { title: string; description?: string | null };
  articles: ReadonlyArray<Article>;
}

export default function ArticleCategoryLayout({
  category,
  articles,
}: ArticleCategoryLayoutProps) {
  return (
    <div>
      <div className="mx-auto px-10 py-16 pt-32 lg:px-32 lg:pt-32">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="mb-4 font-playfair text-[68px] font-[550] leading-[75px] text-dark">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-[24px] font-[450] leading-[31px] text-dark">
              {category.description}
            </p>
          )}
        </div>

        {/* basePath uses the flattened scheme — articles live at /articles/<slug> */}
        <TagFilterGrid articles={articles as never} basePath="/articles/" />
      </div>

      <NewsletterSignup />
    </div>
  );
}
