// src/sanity/schemaTypes/homepageSettingsType.ts
//
// Singleton settings document for the homepage. Only one of these
// ever exists (id = "homepageSettings", enforced via the structure
// tool config). The featuredSlides array is the source of truth for
// the homepage hero carousel — drag to reorder, references resolve
// to whatever doc type is referenced.

import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const homepageSettingsType = defineType({
  name: 'homepageSettings',
  title: 'Homepage',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'featuredSlides',
      title: 'Featured Hero Slides',
      type: 'array',
      description:
        'Slides shown in the homepage hero carousel. Drag to reorder.',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'post' },
            { type: 'productPost' },
            { type: 'raceGuide' },
          ],
        },
      ],
      validation: (Rule) => Rule.unique().max(8),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Settings',
        subtitle: 'Featured hero carousel',
      }
    },
  },
})
