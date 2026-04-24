// src/app/nutrition/category/[categorySlug]/page.tsx

import { client as sanity } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ProductCategoryLayout from "@/components/ProductCategoryLayout";

const SECTION = "nutrition" as const;
const SECTION_PATH = "/nutrition" as const;

export default async function NutritionCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const [category, articles] = await Promise.all([
    sanity.fetch<{ title: string; description?: string | null } | null>(
      `*[_type == "productCategory"
         && slug.current == $slug
         && section == $section][0]{ title, description }`,
      { slug: categorySlug, section: SECTION },
    ),
    sanity.fetch<
      Array<{
        slug: { current: string };
        title: string;
        publishedAt: string;
        mainImage?: unknown;
        excerpt?: string;
        tags?: string[];
      }>
    >(
      `*[_type == "productPost"
         && productCategory->slug.current == $slug
         && productCategory->section == $section
       ] | order(publishedAt desc){
        title,
        slug,
        excerpt,
        tags,
        mainImage,
        publishedAt
      }`,
      { slug: categorySlug, section: SECTION },
    ),
  ]);

  if (!category) return notFound();

  return (
    <ProductCategoryLayout
      category={category}
      articles={articles}
      sectionPath={SECTION_PATH}
    />
  );
}
