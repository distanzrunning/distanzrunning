// Author page — placeholder awaiting its rebuild (deliberately blank
// below the chrome for now; the Masthead + announcement banner come from
// the (site) route-group layout). Real slugs resolve (the hero/card
// bylines link here); unknown slugs 404.

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";
import { authorBySlugQuery } from "@/sanity/queries/authorQuery";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: author } = await sanityFetch({
    query: authorBySlugQuery,
    params: { slug },
  });
  return { title: author ? `${author.name} — Distanz Running` : "Author" };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const { data: author } = await sanityFetch({
    query: authorBySlugQuery,
    params: { slug },
  });
  if (!author) notFound();

  return null;
}
