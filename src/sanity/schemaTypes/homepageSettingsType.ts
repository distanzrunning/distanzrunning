// src/sanity/schemaTypes/homepageSettingsType.ts
//
// Singleton settings document for the homepage. Only one of these
// ever exists (id = "homepageSettings", enforced via the structure
// tool config). The featuredSlides array is the curated "Featured
// articles" list: the FIRST item is the homepage hero (heroArticleQuery
// reads [0]); following items feed the next homepage sections as
// they're built. The field keeps its historical name (featuredSlides,
// from the retired hero-carousel rendition) to avoid a data migration —
// only the editor-facing labels changed.

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
      title: 'Featured articles',
      type: 'array',
      description:
        'The first item is the homepage hero; following items feed the next homepage sections. Drag to reorder.',
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
    defineField({
      name: 'breakingNewsItems',
      title: 'Breaking News',
      type: 'array',
      description:
        'Articles shown in the homepage Breaking News row. Drag to reorder. Three are visible on desktop.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'post' }],
        },
      ],
      validation: (Rule) => Rule.unique().max(6),
    }),
    defineField({
      name: 'featuredGearItems',
      title: "Editor's picks — Shoes & Gear",
      type: 'array',
      description:
        "Articles shown in the homepage Editor's picks row. The first item is the spotlight (large featured slot); the next three appear in the right-hand column. Drag to reorder. If left empty, the row auto-populates with the four most recent product posts.",
      of: [
        {
          type: 'reference',
          to: [{ type: 'productPost' }],
        },
      ],
      validation: (Rule) => Rule.unique().max(4),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Settings',
        subtitle: 'Featured articles & homepage curation',
      }
    },
  },
})
