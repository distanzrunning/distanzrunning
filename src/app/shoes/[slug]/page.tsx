// src/app/shoes/[slug]/page.tsx
//
// Unified handler for the /shoes section. The slug can be either a
// productCategory or a productPost — we run a single GROQ query that
// fetches both candidates in one round trip and pick the one that
// resolved. Category wins if both match (slug collision protection;
// editors should keep them disjoint regardless).

import { client as sanity } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ProductPostLayout, {
  type ProductPostForLayout,
} from "@/components/ProductPostLayout";
import ProductCategoryLayout from "@/components/ProductCategoryLayout";

export const revalidate = 60;

const SECTION = "shoes" as const;
const SECTION_PATH = "/shoes" as const;

type CategoryArticle = {
  slug: { current: string };
  title: string;
  publishedAt: string;
  mainImage?: unknown;
  excerpt?: string;
  tags?: string[];
};

interface SectionResolution {
  category: { title: string; description?: string | null } | null;
  categoryArticles: ReadonlyArray<CategoryArticle>;
  post: ProductPostForLayout | null;
}

const resolveQuery = `{
  "category": *[_type == "productCategory"
    && slug.current == $slug
    && section == $section][0]{ title, description },
  "categoryArticles": *[_type == "productPost"
    && productCategory->slug.current == $slug
    && productCategory->section == $section
  ] | order(publishedAt desc){
    title,
    slug,
    excerpt,
    tags,
    mainImage,
    publishedAt
  },
  "post": *[_type == "productPost"
    && slug.current == $slug
    && productCategory->section == $section][0]{
    title,
    slug,
    introduction,
    body,
    mainImage,
    publishedAt,
    author->{ name, image },
    "productCategory": productCategory->{ title, slug }
  }
}`;

export async function generateStaticParams() {
  // Pre-render both category landing pages and product detail pages.
  const [posts, categories] = await Promise.all([
    sanity.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "productPost" && productCategory->section == $section]{ slug }`,
      { section: SECTION },
    ),
    sanity.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "productCategory" && section == $section]{ slug }`,
      { section: SECTION },
    ),
  ]);
  const slugs = new Set<string>();
  for (const p of posts) slugs.add(p.slug.current);
  for (const c of categories) slugs.add(c.slug.current);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function ShoesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) return notFound();

  const result = await sanity.fetch<SectionResolution>(resolveQuery, {
    slug,
    section: SECTION,
  });

  if (result.category) {
    return (
      <ProductCategoryLayout
        category={result.category}
        articles={result.categoryArticles}
        sectionPath={SECTION_PATH}
      />
    );
  }

  if (result.post) {
    return <ProductPostLayout post={result.post} sectionPath={SECTION_PATH} />;
  }

  notFound();
}
