// src/app/gear/[gearSlug]/page.tsx

import { client as sanity } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import NewsletterSignup from '@/components/NewsletterSignup'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await sanity.fetch(`*[_type == "gearPost"]{slug}`)
  return posts.map((post: any) => ({ gearSlug: post.slug.current }))
}

export default async function GearPost({ params }: { params: { gearSlug: string } }) {
  const { gearSlug } = await Promise.resolve(params)

  if (!gearSlug) return notFound()

  const post = await sanity.fetch(
    `*[_type == "gearPost" && slug.current == $slug][0]{
      title,
      slug,
      introduction,
      body,
      mainImage,
      publishedAt,
      author->{
        name,
        image
      },
      gearCategory->{
        title,
        slug
      }
    }`,
    { slug: gearSlug }
  )

  if (!post) return notFound()

  const publishedDate = post.publishedAt
    ? format(new Date(post.publishedAt), 'd MMM yyyy')
    : 'Unknown Date'

  const readTime = post.body
    ? Math.ceil(
        post.body.reduce((acc: number, block: any) => {
          if (block._type === 'block' && block.children) {
            const words = block.children.map((child: any) => child.text).join(' ').split(' ').length
            return acc + words
          }
          return acc
        }, 0) / 200
      )
    : 1

  return (
    <div>
      <div className="bg-white quartr-font-features">
        <div className="quartr-article-container quartr-text-spacing">

          {/* Shared Grid Row: Image and Breadcrumbs */}
          <div className="quartr-full-col grid grid-cols-1">
            {/* Image */}
            {post.mainImage && (
              <div className="w-full">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden">
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

            {/* Breadcrumb - Exact Quartr styling with capsize */}
            <div className="pb-6 pt-3 md:pb-9 md:pt-6">
              <div>
                <ul className="flex w-full flex-nowrap items-center gap-x-1 gap-y-1">
                  {post.gearCategory && (
                    <>
                      <li className="break-words py-1">
                        <a href={`/gear/category/${post.gearCategory.slug.current}`}>
                          <div className="font-sans text-textSubtle font-normal text-lg capsize leading-snug">
                            <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                              {post.gearCategory.title}
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
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </li>
                    </>
                  )}
                  <li className="break-words py-1 overflow-hidden">
                    <a href={`/gear/${post.slug.current}`}>
                      <div className="font-sans text-textSubtle font-normal text-lg capsize leading-snug">
                        <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                          {post.title}
                        </span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Title, Reading Time, Date, Author */}
          <div className="col-span-full lg:col-span-12 lg:col-start-4 lg:justify-self-center">
            <div className="flex flex-col gap-6 pb-9 md:gap-9">
              {/* Title using your Playfair font but with Quartr's exact sizing */}
              <h1 className="font-playfair font-semibold tracking-tight text-[35px] leading-[40px] md:text-[56px] md:leading-[56px] text-textDefault">
                {post.title}
              </h1>

              {/* Container for metadata and author */}
              <div className="flex flex-col gap-2">
                {/* Reading time container - exact Quartr styling */}
                <div>
                  <div className="font-sans text-textSubtle font-normal text-base capsize leading-snug">{readTime} minutes reading time</div>
                </div>

                {/* Published date container - exact Quartr styling */}
                <div>
                  <div className="font-sans text-textSubtle font-normal text-base capsize leading-snug">Published {publishedDate}</div>
                </div>

                {/* Author container - exact Quartr styling */}
                {post.author && (
                  <div className="mt-5 flex items-center gap-3">
                    {post.author.image && (
                      <div className="h-12 w-12">
                        <div className="rounded-full border border-gray-200 p-0.5">
                          <Image
                            src={urlFor(post.author.image).width(64).height(64).url()}
                            alt={post.author.name}
                            width={48}
                            height={48}
                            className="w-full rounded-full border-1 border-white"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-start gap-1">
                        <div className="font-sans text-textSubtle font-normal text-lg capsize leading-snug">
                          <b>Author: </b>
                          <span style={{ textDecoration: 'underline' }}>{post.author.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Introduction Section - Exact Quartr styling */}
          {post.introduction && (
            <div className="col-span-full lg:col-span-12 lg:col-start-4 lg:justify-self-center mb-8">
              <PortableText 
                value={post.introduction}
                components={{
                  block: {
                    normal: ({children}) => (
                      <p className="font-sans text-textSubtle font-medium text-[21px] leading-[24px] md:text-[22px] md:leading-[25px] mb-4 last:mb-0">
                        <span className="fragment-span preamble" data-v2="true">
                          {children}
                        </span>
                      </p>
                    ),
                  },
                  marks: {
                    strong: ({children}) => (
                      <strong className="font-sans text-textSubtle font-semibold text-[21px] leading-[24px] md:text-[22px] md:leading-[25px]">
                        {children}
                      </strong>
                    ),
                  },
                }}
              />
            </div>
          )}

          {/* Main Article Body - Exact Quartr styling */}
          <div className="col-span-full lg:col-span-12 lg:col-start-4 lg:justify-self-center">
            <article className="quartr-font-features">
              <PortableText 
                value={post.body}
                components={{
                  block: {
                    normal: ({children}) => (
                      <p className="font-sans font-normal text-[17px] leading-[25px] md:text-[19px] md:leading-[28px] text-textDefault mb-6 last:mb-0">
                        {children}
                      </p>
                    ),
                    h1: ({children}) => (
                      <h1 className="font-sans font-semibold text-3xl capsize leading-tight text-textDefault mt-12 mb-6">
                        {children}
                      </h1>
                    ),
                    h2: ({children}) => (
                      <div className="flex gap-3 group relative justify-start mt-10 mb-5" style={{ scrollMarginTop: '100px' }}>
                        <div className="relative mr-4">
                          <div className="pt-6">
                            <h2 className="font-sans font-semibold text-3xl capsize leading-tight text-textDefault">
                              {children}
                            </h2>
                          </div>
                        </div>
                      </div>
                    ),
                    h3: ({children}) => (
                      <div className="pt-6">
                        <div className="flex gap-3 group relative justify-start mt-6 mb-4" style={{ scrollMarginTop: '100px' }}>
                          <div className="relative mr-4">
                            <h3 className="font-sans font-semibold text-2xl capsize leading-tight text-textDefault">
                              {children}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ),
                    h4: ({children}) => (
                      <h4 className="font-sans font-semibold text-2xl capsize leading-tight text-textDefault mt-6 mb-3">
                        {children}
                      </h4>
                    ),
                    h5: ({children}) => (
                      <h5 className="quik-text quik-size-titleLarge text-textDefault mt-6 mb-3" data-weight="medium">
                        {children}
                      </h5>
                    ),
                    h6: ({children}) => (
                      <h6 className="quik-text quik-size-titleMedium text-textDefault mt-6 mb-3" data-weight="medium">
                        {children}
                      </h6>
                    ),
                    blockquote: ({children}) => (
                      <div className="flex flex-col gap-6 border border-borderNeutralSubtle pl-6 my-8" style={{ borderWidth: '0px 0px 0px 4px' }}>
                        <div className="font-sans font-normal text-[17px] leading-[25px] md:text-[19px] md:leading-[28px] text-textDefault italic">
                          {children}
                        </div>
                      </div>
                    ),
                  },
                  marks: {
                    strong: ({children}) => (
                      <b className="fragment-b font-semibold" data-v2="true">
                        {children}
                      </b>
                    ),
                    em: ({children}) => (
                      <i className="fragment-i italic" data-v2="true">
                        {children}
                      </i>
                    ),
                    link: ({children, value}) => (
                      <a
                        href={value.href}
                        className="fragment-a text-primary font-medium underline transition-colors hover:opacity-70"
                        target={value.blank ? '_blank' : undefined}
                        rel={value.blank ? 'noopener noreferrer' : undefined}
                        data-v2="true"
                      >
                        {children}
                      </a>
                    ),
                  },
                  list: {
                    bullet: ({children}) => (
                      <ul className="fragment-ul mb-6" data-v2="true">
                        {children}
                      </ul>
                    ),
                    number: ({children}) => (
                      <ol className="fragment-ol list-decimal pl-5 mb-6 space-y-8">
                        {children}
                      </ol>
                    ),
                  },
                  listItem: {
                    bullet: ({children}) => (
                      <li className="fragment-li mb-6 last:mb-0">
                        <div className="font-sans font-normal text-[17px] leading-[25px] md:text-[19px] md:leading-[28px] text-textDefault">
                          {children}
                        </div>
                      </li>
                    ),
                    number: ({children}) => (
                      <li className="fragment-li font-sans font-normal text-[17px] leading-[25px] md:text-[19px] md:leading-[28px] text-textDefault mb-8 pl-1">
                        {children}
                      </li>
                    ),
                  },
                  types: {
                    image: ({value}) => (
                      <div className="my-8">
                        <Image
                          src={urlFor(value).width(800).url()}
                          alt={value.alt || ''}
                          width={800}
                          height={600}
                          className="rounded-lg w-full h-auto"
                        />
                        {value.caption && (
                          <p className="font-sans text-textSubtle font-normal text-base capsize leading-snug text-center mt-2">
                            {value.caption}
                          </p>
                        )}
                      </div>
                    ),
                  },
                }}
              />
            </article>
          </div>

        </div>
      </div>

      <div className="pt-16">
        <NewsletterSignup />
      </div>
    </div>
  )
}