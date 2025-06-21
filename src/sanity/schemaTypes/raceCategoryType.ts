// src/sanity/schemaTypes/raceCategoryType.ts

import { TagIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export const raceCategoryType = defineType({
  name: 'raceCategory',
  title: 'Race Category',
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
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})