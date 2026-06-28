// src/sanity/schemaTypes/cookieType.ts
//
// One document per cookie/tracker the site sets — the structured "cookie
// declaration" rendered on the Cookie Policy page and (later) surfaced in the
// consent dialog. Categories align 1:1 with the consent banner's categories so
// the declaration groups match what the user is consenting to.

import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

// Values match the c15t/consent category codes; titles are the user-facing
// labels used in the banner (Essential / Marketing / Analytics / Functional).
const COOKIE_CATEGORIES = [
  { title: 'Essential', value: 'necessary' },
  { title: 'Marketing', value: 'marketing' },
  { title: 'Analytics', value: 'measurement' },
  { title: 'Functional', value: 'functionality' },
] as const

export const cookieType = defineType({
  name: 'cookie',
  title: 'Cookie',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Cookie name',
      type: 'string',
      description: 'e.g. "c15t", "ph_*", "_ga". Use * for wildcard families.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      description: 'Who sets it — e.g. "Distanz Running", "PostHog", "Google".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Maps to the consent banner category that gates this cookie.',
      options: { list: [...COOKIE_CATEGORIES], layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'purpose',
      title: 'Purpose',
      type: 'text',
      rows: 2,
      description: 'Plain-language explanation of what this cookie does.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g. "Session", "180 days", "1 year".',
    }),
    defineField({
      name: 'party',
      title: 'Party',
      type: 'string',
      options: {
        list: [
          { title: 'First-party', value: 'first' },
          { title: 'Third-party', value: 'third' },
        ],
        layout: 'radio',
      },
      initialValue: 'first',
    }),
    defineField({
      name: 'domain',
      title: 'Domain',
      type: 'string',
      description:
        'Optional — the domain that sets it (e.g. ".doubleclick.net" for third-party cookies).',
    }),
  ],
  orderings: [
    {
      title: 'Category, then name',
      name: 'categoryName',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', category: 'category', provider: 'provider' },
    prepare({ title, category, provider }) {
      const label =
        COOKIE_CATEGORIES.find((c) => c.value === category)?.title ?? '—'
      return { title, subtitle: `${label} · ${provider ?? ''}` }
    },
  },
})
