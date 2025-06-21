// src/sanity/schemaTypes/gearCategoryType.ts

import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const gearCategoryType = defineType({
  name: 'gearCategory',
  title: 'Gear Category',
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
      name: 'description',
      type: 'text',
    }),
  ],
})