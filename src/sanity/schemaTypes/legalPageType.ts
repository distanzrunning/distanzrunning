// src/sanity/schemaTypes/legalPageType.ts
//
// Legal / policy pages managed in the CMS — Privacy Policy, Cookie Policy,
// Terms, etc. A slug-based collection (rather than singletons) so new policies
// can be added without schema changes. The Cookie Policy sets
// `showCookieTable` to append the live cookie declaration (from `cookie` docs)
// below the prose body when the frontend renders it.

import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export const legalPageType = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'URL path, e.g. "privacy" or "cookie-policy".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'date',
      description: 'Shown as the effective date on the page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showCookieTable',
      title: 'Show cookie declaration table',
      type: 'boolean',
      initialValue: false,
      description:
        'Appends the live cookie declaration (from Cookies) below the body — turn on for the Cookie Policy.',
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', updated: 'lastUpdated' },
    prepare({ title, slug, updated }) {
      return {
        title,
        subtitle: [slug ? `/${slug}` : null, updated].filter(Boolean).join(' · '),
      }
    },
  },
})
