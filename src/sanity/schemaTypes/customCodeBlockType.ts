// src/sanity/schemaTypes/customCodeBlockType.ts

import { defineField, defineType } from 'sanity'
import { CodeIcon } from '@sanity/icons'

export const customCodeBlockType = defineType({
  name: 'customCodeBlock',
  title: 'Custom Content Block',
  type: 'object',
  icon: CodeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Block Title (optional)',
      type: 'string',
      description: 'Optional title to help you identify this block in the editor',
    }),
    defineField({
      name: 'blockType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Custom Table', value: 'table' },
          { title: 'Map/Iframe', value: 'map' },
          { title: 'Custom HTML', value: 'html' },
          { title: 'Statistics Block', value: 'stats' },
          { title: 'Race Results', value: 'results' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'table',
      description: 'What type of content are you adding? This helps with organization.',
    }),
    defineField({
      name: 'htmlContent',
      title: 'HTML/JSX Content',
      type: 'text',
      rows: 10,
      description: 'Enter your custom HTML content here. You can use HTML tags, inline styles, and classes.',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes (optional)',
      type: 'text',
      description: 'Private notes about this block (not shown on frontend)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      blockType: 'blockType',
      htmlContent: 'htmlContent',
    },
    prepare({ title, blockType, htmlContent }) {
      const blockTypeLabels: Record<string, string> = {
        table: 'Custom Table',
        map: 'Map/Iframe',
        html: 'Custom HTML',
        stats: 'Statistics Block',
        results: 'Race Results',
        other: 'Other'
      }
      
      const blockTypeLabel = blockTypeLabels[blockType] || 'Custom Content'
      const preview = htmlContent ? htmlContent.substring(0, 100) + '...' : 'No content'
      
      return {
        title: title || blockTypeLabel,
        subtitle: preview,
        media: CodeIcon,
      }
    },
  },
})