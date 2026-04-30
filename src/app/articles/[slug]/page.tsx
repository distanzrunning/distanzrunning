// src/app/articles/[slug]/page.tsx
//
// Unified handler for /articles. Slug resolves to either a category
// or a post — single GROQ query fetches both candidates in one
// round trip and we render whichever matched. Category wins on
// collision (editors should keep slugs disjoint regardless).

import { client as sanity } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import {
  similarArticlesQuery,
  fallbackSimilarArticlesQuery,
} from "@/sanity/queries/similarArticlesQuery";
import ArticlePostLayout from "@/components/ArticlePostLayout";
import ArticleCategoryLayout from "@/components/ArticleCategoryLayout";

export const revalidate = 60;

type CategoryArticle = {
  slug: { current: string };
  title: string;
  publishedAt: string;
  mainImage?: unknown;
  excerpt?: string;
  tags?: string[];
};

type PostShape = {
  _id: string;
  title: string;
  slug: { current: string };
  introduction?: unknown;
  body?: unknown;
  mainImage?: unknown;
  publishedAt?: string;
  author?: { name: string; image?: unknown } | null;
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
  } | null;
};

interface ArticleResolution {
  category: { title: string; description?: string | null } | null;
  categoryArticles: ReadonlyArray<CategoryArticle>;
  post: PostShape | null;
}

const resolveQuery = `{
  "category": *[_type == "category" && slug.current == $slug][0]{
    title,
    description
  },
  "categoryArticles": *[_type == "post"
    && category->slug.current == $slug
  ] | order(publishedAt desc){
    title,
    slug,
    publishedAt,
    excerpt,
    tags,
    "mainImage": mainImage.asset->url
  },
  "post": *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    introduction,
    body,
    mainImage,
    publishedAt,
    author->{ name, image },
    category->{ _id, title, slug }
  }
}`;

export async function generateStaticParams() {
  const [posts, categories] = await Promise.all([
    sanity.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "post"]{ slug }`,
    ),
    sanity.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "category"]{ slug }`,
    ),
  ]);
  const slugs = new Set<string>();
  for (const p of posts) slugs.add(p.slug.current);
  for (const c of categories) slugs.add(c.slug.current);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) return notFound();

  const result = await sanity.fetch<ArticleResolution>(resolveQuery, { slug });

  if (result.category) {
    return (
      <ArticleCategoryLayout
        category={result.category}
        articles={result.categoryArticles}
      />
    );
  }

  const post = result.post;
  if (!post) return notFound();

  // Similar articles: same category first, fall back to recent.
  let similarArticles: Array<{ _id: string }> = [];
  if (post.category?._id) {
    similarArticles = await sanity.fetch<Array<{ _id: string }>>(
      similarArticlesQuery,
      {
        categoryRef: post.category._id,
        currentPostId: post._id,
      },
    );
    if (similarArticles.length < 3) {
      const fallback = await sanity.fetch<Array<{ _id: string }>>(
        fallbackSimilarArticlesQuery,
        { currentPostId: post._id },
      );
      const seen = new Set(similarArticles.map((a) => a._id));
      for (const a of fallback) {
        if (!seen.has(a._id)) {
          similarArticles.push(a);
          seen.add(a._id);
        }
      }
    }
  } else {
    similarArticles = await sanity.fetch<Array<{ _id: string }>>(
      fallbackSimilarArticlesQuery,
      { currentPostId: post._id },
    );
  }

  return (
    <ArticlePostLayout post={post} similarArticles={similarArticles} />
  );
}
