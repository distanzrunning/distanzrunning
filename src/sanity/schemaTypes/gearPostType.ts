// src/sanity/schemaTypes/gearPostType.ts

import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const gearPostType = defineType({
  name: 'gearPost',
  title: 'Gear Post',
  type: 'document',
  icon: TagIcon,
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
      description: 'A short summary of the gear post for previews (120–160 characters recommended)',
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
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }),
      ],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Gear Image',
      type: 'image',
      description: 'Upload a vertical image for the Navbar featured article (recommended size: 600x900px)',
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
      name: 'gearCategory',
      title: 'Gear Category',
      type: 'reference',
      to: [{ type: 'gearCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredGear',
      title: 'Featured Gear Post',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true

          const id = context.document?._id
          if (!id) return true

          const existing = await context.getClient({ apiVersion: '2021-10-21' }).fetch(
            `*[_type == "gearPost" && featuredGear == true && _id != $id][0]._id`,
            { id }
          )

          return !existing || 'Only one featured gear post is allowed.'
        }),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
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