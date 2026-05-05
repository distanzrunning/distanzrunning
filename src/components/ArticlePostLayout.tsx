// src/components/ArticlePostLayout.tsx
//
// Renders a single editorial article (post type). Extracted from the
// legacy /articles/post/[postSlug]/page.tsx so the unified
// /articles/[slug] handler can render either this or
// ArticleCategoryLayout based on what the slug resolves to.
//
// Breadcrumb URLs use the flattened scheme (/articles/<category>,
// /articles/<post-slug>) — no /category/ or /post/ segment.

import Image from "next/image";
import { format } from "date-fns";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import SimilarArticles from "@/components/SimilarArticles";
import TableOfContentsWidget from "@/components/TableOfContentsWidget";
import { CustomTable } from "@/components/CustomTable";
import { CustomCodeBlock } from "@/components/CustomCodeBlock";
import {
  generateHeadingId,
  extractTextFromChildren,
} from "@/utils/headingUtils";

export interface ArticlePostLayoutProps {
  post: {
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
  similarArticles: ReadonlyArray<{ _id: string } & Record<string, unknown>>;
}

export default function ArticlePostLayout({
  post,
  similarArticles,
}: ArticlePostLayoutProps) {
  const publishedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "d MMM yyyy")
    : "Unknown Date";

  const readTime = Array.isArray(post.body)
    ? Math.ceil(
        (post.body as Array<{ _type?: string; children?: Array<{ text?: string }> }>).reduce(
          (acc, block) => {
            if (block._type === "block" && block.children) {
              const words = block.children
                .map((c) => c.text ?? "")
                .join(" ")
                .split(" ").length;
              return acc + words;
            }
            return acc;
          },
          0,
        ) / 200,
      )
    : 1;

  // PortableText renderer with heading IDs for the TOC.
  const portableTextComponents = {
    block: {
      normal: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-6 font-sans text-[17px] font-normal leading-[25px] text-textDefault last:mb-0 md:text-[19px] md:leading-[28px]">
          {children}
        </p>
      ),
      h1: ({ children }: { children?: React.ReactNode }) => {
        const text = extractTextFromChildren(children as never);
        const id = generateHeadingId(text);
        return (
          <h1
            id={id}
            className="capsize mb-6 mt-12 font-sans text-3xl font-semibold leading-tight text-textDefault"
            style={{ scrollMarginTop: "100px" }}
          >
            {children}
          </h1>
        );
      },
      h2: ({ children }: { children?: React.ReactNode }) => {
        const text = extractTextFromChildren(children as never);
        const id = generateHeadingId(text);
        return (
          <div
            className="group relative mb-5 mt-10 flex justify-start gap-3"
            style={{ scrollMarginTop: "100px" }}
          >
            <div className="relative mr-4">
              <div className="pt-6">
                <h2
                  id={id}
                  className="capsize font-sans text-3xl font-semibold leading-tight text-textDefault"
                >
                  {children}
                </h2>
              </div>
            </div>
          </div>
        );
      },
      h3: ({ children }: { children?: React.ReactNode }) => {
        const text = extractTextFromChildren(children as never);
        const id = generateHeadingId(text);
        return (
          <div className="pt-6">
            <div
              className="group relative mb-4 mt-6 flex justify-start gap-3"
              style={{ scrollMarginTop: "100px" }}
            >
              <div className="relative mr-4">
                <h3
                  id={id}
                  className="capsize font-sans text-2xl font-semibold leading-tight text-textDefault"
                >
                  {children}
                </h3>
              </div>
            </div>
          </div>
        );
      },
      h4: ({ children }: { children?: React.ReactNode }) => (
        <h4 className="capsize mb-3 mt-6 font-sans text-2xl font-semibold leading-tight text-textDefault">
          {children}
        </h4>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <div
          className="my-8 flex flex-col gap-6 border border-borderNeutralSubtle pl-6"
          style={{ borderWidth: "0px 0px 0px 4px" }}
        >
          <div className="font-sans text-[17px] font-normal italic leading-[25px] text-textDefault md:text-[19px] md:leading-[28px]">
            {children}
          </div>
        </div>
      ),
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => (
        <b className="fragment-b font-semibold" data-v2="true">
          {children}
        </b>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <i className="fragment-i italic" data-v2="true">
          {children}
        </i>
      ),
      link: ({
        children,
        value,
      }: {
        children?: React.ReactNode;
        value?: { href?: string; blank?: boolean };
      }) => {
        const href = value?.href ?? "";
        const isExternal =
          href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("//");
        return (
          <a
            href={href}
            className="fragment-a font-medium text-primary underline transition-colors hover:opacity-70"
            target={isExternal || value?.blank ? "_blank" : undefined}
            rel={isExternal || value?.blank ? "noopener noreferrer" : undefined}
            data-v2="true"
          >
            {children}
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <ul className="fragment-ul mb-6" data-v2="true">
          {children}
        </ul>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <ol className="fragment-ol mb-6 list-decimal space-y-8 pl-5">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <li className="fragment-li mb-6 last:mb-0">
          <div className="font-sans text-[17px] font-normal leading-[25px] text-textDefault md:text-[19px] md:leading-[28px]">
            {children}
          </div>
        </li>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <li className="fragment-li mb-8 pl-1 font-sans text-[17px] font-normal leading-[25px] text-textDefault md:text-[19px] md:leading-[28px]">
          {children}
        </li>
      ),
    },
    types: {
      image: ({
        value,
      }: {
        value: { alt?: string; caption?: string; credit?: string } & Record<string, unknown>;
      }) => (
        <div className="my-8">
          <a
            href={urlFor(value).width(2400).quality(95).url()}
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer transition-opacity hover:opacity-95"
          >
            <Image
              src={urlFor(value).width(1600).quality(90).url()}
              alt={value.alt || ""}
              width={1600}
              height={1067}
              className="h-auto w-full rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority={false}
              quality={90}
            />
          </a>
          {(value.caption || value.credit) && (
            <div className="mt-3 space-y-1">
              {value.caption && (
                <p className="text-left font-sans text-sm font-normal leading-snug text-textSubtle">
                  {value.caption}
                </p>
              )}
              {value.credit && (
                <p className="text-left font-sans text-xs font-normal italic leading-snug text-textSubtler">
                  {value.credit}
                </p>
              )}
            </div>
          )}
        </div>
      ),
      customTable: CustomTable,
      customCodeBlock: CustomCodeBlock,
    },
  };

  return (
    <div className="relative">
      <TableOfContentsWidget body={post.body as never} />
      <div className="distanz-font-features bg-white">
        <div className="distanz-article-container distanz-text-spacing">
          <div className="distanz-full-col grid grid-cols-1">
            {post.mainImage != null && (
              <div className="w-full">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={urlFor(post.mainImage).width(1400).url()}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Breadcrumb — flattened URLs (no /category/ or /post/) */}
            <div className="pb-6 pt-3 md:pb-9 md:pt-6">
              <ul className="flex w-full flex-nowrap items-center gap-x-1 gap-y-1">
                {post.category && (
                  <>
                    <li className="break-words py-1">
                      <a href={`/articles/${post.category.slug.current}`}>
                        <div className="capsize font-sans text-lg font-normal leading-snug text-textSubtle">
                          <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                            {post.category.title}
                          </span>
                        </div>
                      </a>
                    </li>
                    <li className="flex select-none place-items-center pl-2 pr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right text-greyCold400"
                        aria-hidden
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </li>
                  </>
                )}
                <li className="break-words overflow-hidden py-1">
                  <a href={`/articles/${post.slug.current}`}>
                    <div className="capsize font-sans text-lg font-normal leading-snug text-textSubtle">
                      <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        {post.title}
                      </span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-full lg:col-span-12 lg:col-start-4">
            <div className="flex flex-col gap-6 pb-9 md:gap-9">
              <h1 className="font-playfair text-[35px] font-semibold leading-[40px] tracking-tight text-textDefault md:text-[56px] md:leading-[56px]">
                {post.title}
              </h1>
              <div className="flex flex-col gap-2">
                <div>
                  <div className="capsize font-sans text-base font-normal leading-snug text-textSubtle">
                    {readTime} minutes reading time
                  </div>
                </div>
                <div>
                  <div className="capsize font-sans text-base font-normal leading-snug text-textSubtle">
                    Published {publishedDate}
                  </div>
                </div>
                {post.author && (
                  <div className="mt-5 flex items-center gap-3">
                    {post.author.image != null && (
                      <div className="h-12 w-12">
                        <div className="rounded-full border border-gray-200 p-0.5">
                          <Image
                            src={urlFor(post.author.image)
                              .width(64)
                              .height(64)
                              .url()}
                            alt={post.author.name}
                            width={48}
                            height={48}
                            className="w-full rounded-full border border-white"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-start gap-1">
                        <div className="capsize font-sans text-lg font-normal leading-snug text-textSubtle">
                          <b>Author: </b>
                          <span style={{ textDecoration: "underline" }}>
                            {post.author.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {post.introduction != null && (
            <div className="col-span-full mb-8 lg:col-span-12 lg:col-start-4">
              <PortableText
                value={post.introduction as never}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="mb-4 font-sans text-[21px] font-medium leading-[24px] text-textSubtle last:mb-0 md:text-[22px] md:leading-[25px]">
                        <span className="fragment-span preamble" data-v2="true">
                          {children}
                        </span>
                      </p>
                    ),
                  },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-sans text-[21px] font-semibold leading-[24px] text-textSubtle md:text-[22px] md:leading-[25px]">
                        {children}
                      </strong>
                    ),
                  },
                }}
              />
            </div>
          )}

          <div className="col-span-full lg:col-span-12 lg:col-start-4">
            <article className="distanz-font-features">
              <PortableText
                value={post.body as never}
                components={portableTextComponents}
              />
            </article>
          </div>
        </div>
      </div>

      <SimilarArticles
        articles={similarArticles as never}
        currentArticleId={post._id}
        maxArticles={4}
      />

    </div>
  );
}
