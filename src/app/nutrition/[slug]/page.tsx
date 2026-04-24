// src/app/nutrition/[slug]/page.tsx

import { client as sanity } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ProductPostLayout, {
  type ProductPostForLayout,
} from "@/components/ProductPostLayout";

export const revalidate = 60;

const SECTION = "nutrition" as const;
const SECTION_PATH = "/nutrition" as const;

export async function generateStaticParams() {
  const posts = await sanity.fetch<Array<{ slug: { current: string } }>>(
    `*[_type == "productPost" && productCategory->section == $section]{ slug }`,
    { section: SECTION },
  );
  return posts.map((post) => ({ slug: post.slug.current }));
}

export default async function NutritionPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) return notFound();

  const post = await sanity.fetch<ProductPostForLayout | null>(
    `*[_type == "productPost"
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
    }`,
    { slug, section: SECTION },
  );

  if (!post) return notFound();

  return <ProductPostLayout post={post} sectionPath={SECTION_PATH} />;
}
