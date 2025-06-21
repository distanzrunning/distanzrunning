// src/sanity/schemaTypes/tableType.ts

import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons' // Import a proper icon

export const tableType = defineType({
  name: 'customTable',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Table Title (optional)',
      type: 'string',
      description: 'Optional title that appears above the table',
    }),
    defineField({
      name: 'headers',
      title: 'Column Headers',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add the column headers for your table',
      validation: (Rule) => Rule.required().min(1).error('At least one header is required'),
    }),
    defineField({
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          title: 'Row',
          fields: [
            {
              name: 'cells',
              title: 'Row Data',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Enter the data for each cell in this row',
            },
          ],
          preview: {
            select: {
              cells: 'cells',
            },
            prepare({ cells }) {
              return {
                title: cells ? cells.join(' | ') : 'Empty row',
              }
            },
          },
        },
      ],
      description: 'Add rows of data to your table',
      validation: (Rule) => Rule.required().min(1).error('At least one row is required'),
    }),
    defineField({
      name: 'caption',
      title: 'Table Caption (optional)',
      type: 'string',
      description: 'Optional caption that appears below the table',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      headers: 'headers',
      rows: 'rows',
    },
    prepare({ title, headers, rows }) {
      const headerCount = headers ? headers.length : 0
      const rowCount = rows ? rows.length : 0
      
      return {
        title: title || 'Data Table',
        subtitle: `${headerCount} columns, ${rowCount} rows`,
        media: DocumentIcon, // Use proper icon instead of emoji
      }
    },
  },
})