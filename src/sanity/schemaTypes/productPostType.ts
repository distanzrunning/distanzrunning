// src/sanity/schemaTypes/productPostType.ts

import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const productPostType = defineType({
  name: 'productPost',
  title: 'Product Post',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A short summary for previews (120–160 characters recommended)',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alternative Text' }),
      ],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Vertical image for navbar featured article (recommended size: 600x900px)',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alternative Text' }),
      ],
    }),
    defineField({
      name: 'productCategory',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredInSection',
      title: 'Featured in its section',
      type: 'boolean',
      initialValue: false,
      description:
        'Only one post per section (Shoes / Gear / Nutrition) can be featured at a time.',
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true

          const id = context.document?._id
          if (!id) return true

          // Resolve this doc's section via its category reference so the
          // uniqueness check is scoped within the same section.
          const client = context.getClient({ apiVersion: '2021-10-21' })
          const categoryRef = (context.document as { productCategory?: { _ref?: string } })
            ?.productCategory?._ref
          if (!categoryRef) return true

          const section = await client.fetch<string | null>(
            `*[_type == "productCategory" && _id == $ref][0].section`,
            { ref: categoryRef }
          )
          if (!section) return true

          const existing = await client.fetch<string | null>(
            `*[_type == "productPost"
               && featuredInSection == true
               && _id != $id
               && productCategory->section == $section][0]._id`,
            { id, section }
          )

          return (
            !existing ||
            `Only one featured post is allowed per section. A ${section} post is already featured.`
          )
        }),
    }),
    defineField({
      name: 'isBreaking',
      title: 'Show in Breaking News Section',
      type: 'boolean',
      initialValue: false,
      description: 'Show this post in the homepage breaking news section',
    }),
    defineField({
      name: 'featuredOnHomepage',
      title: 'Featured on Homepage Hero',
      type: 'boolean',
      initialValue: false,
      description: 'Show this product in the homepage hero carousel.',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'blockContent',
      description: 'Introduction paragraph shown after the author section and before the body.',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      section: 'productCategory.section',
    },
    prepare({ title, author, media, section }) {
      const labels = [section, author && `by ${author}`].filter(Boolean)
      return {
        title,
        media,
        subtitle: labels.length ? labels.join(' · ') : undefined,
      }
    },
  },
})
