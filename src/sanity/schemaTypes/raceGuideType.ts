// src/sanity/schemaTypes/raceGuideType.ts

import { defineType, defineField } from 'sanity'
import { PinIcon } from '@sanity/icons'

export const raceGuideType = defineType({
  name: 'raceGuide',
  title: 'Race Guide',
  type: 'document',
  icon: PinIcon,
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
      name: 'location',
      type: 'string',
    }),
    defineField({
      name: 'eventDate',
      type: 'datetime',
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'courseMap',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'elevationGraph',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'statsTable',
      type: 'text',
    }),
    defineField({
      name: 'raceCategory',
      title: 'Race Category',
      type: 'reference',
      to: [{ type: 'raceCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredRace',
      title: 'Featured Race Guide',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value) return true

          const id = context.document?._id
          if (!id) return true

          const existing = await context.getClient({ apiVersion: '2021-10-21' }).fetch(
            `*[_type == "raceGuide" && featuredRace == true && _id != $id][0]._id`,
            { id }
          )

          return !existing || 'Only one featured race guide is allowed.'
        }),
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
  ],
})