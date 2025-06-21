// src/sanity/schemaTypes/postType.ts

import { DocumentTextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A short summary of the post for previews (120–160 characters recommended)',
      validation: (Rule) => Rule.max(200),
    }),
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Tags for filtering articles (e.g. news, marathons, Olympics).',
    },
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
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isBreaking',
      title: 'Breaking News',
      type: 'boolean',
      initialValue: false,
      description: 'Mark this post as breaking news to feature it on the homepage.',
    }),
    defineField({
      name: 'featuredPost',
      title: 'Featured Article',
      type: 'boolean',
      initialValue: false,
      description: 'Mark this post as a featured article to display it on the homepage.',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'blockContent',
      description: 'Introduction paragraph that appears after the author section and before the main body.',
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
    },
    prepare(selection) {
      const { author } = selection
      return { 
        ...selection, 
        subtitle: author ? `by ${author}` : undefined 
      }
    },
  },
})