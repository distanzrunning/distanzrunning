// src/app/blog/[slug]/page.tsx
import { sanity } from '@/lib/sanity'
import { urlFor } from '@/lib/image'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await sanity.fetch(`*[_type == "post"]{slug}`)
  return posts.map((post: any) => ({ slug: post.slug.current }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // In Next.js 15, we need to properly await params
  const { slug } = await Promise.resolve(params)
  
  const post = await sanity.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      body,
      mainImage,
      publishedAt,
      author->{
        name,
        image
      }
    }`,
    { slug }
  )

  if (!post) return notFound()

  const publishedDate = format(new Date(post.publishedAt), 'MMMM d, yyyy')
  const readTime = post.body ? Math.ceil(post.body.reduce((acc: number, block: any) => {
    if (block._type === 'block' && block.children) {
      const words = block.children.map((child: any) => child.text).join(' ').split(' ').length;
      return acc + words;
    }
    return acc;
  }, 0) / 200) : 1;

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <article>
          {post.mainImage && (
            <img
              src={urlFor(post.mainImage).width(1200).url()}
              alt={post.title}
              className="rounded-xl w-full h-[400px] object-cover mb-8"
            />
          )}

          <div className="text-sm text-gray-500 mb-2">
            {publishedDate} • {readTime} min read
          </div>

          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

          {post.author?.name && (
            <div className="flex items-center gap-3 mb-8 py-4 border-b border-gray-200">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(40).height(40).url()}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <p className="text-sm font-medium">{post.author.name}</p>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <PortableText value={post.body} />
          </div>
        </article>
      </div>
    </div>
  );
}