// src/sanity/schemaTypes/productCategoryType.ts

import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const productCategoryType = defineType({
  name: 'productCategory',
  title: 'Product Category',
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
      name: 'section',
      title: 'Section',
      type: 'string',
      description: 'Which top-level section this category lives under',
      options: {
        list: [
          { title: 'Shoes', value: 'shoes' },
          { title: 'Gear', value: 'gear' },
          { title: 'Nutrition', value: 'nutrition' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      section: 'section',
    },
    prepare({ title, section }) {
      return {
        title,
        subtitle: section ? section.charAt(0).toUpperCase() + section.slice(1) : undefined,
      }
    },
  },
})
