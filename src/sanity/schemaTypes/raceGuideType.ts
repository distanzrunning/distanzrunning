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
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'stateRegion',
      title: 'State/Region',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
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
      name: 'raceCategory',
      title: 'Race Category',
      type: 'reference',
      to: [{ type: 'raceCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'distance',
      title: 'Distance (km)',
      type: 'number',
      description: 'Exact race distance in kilometers (e.g., 42.195 for marathon, 21.0975 for half marathon)',
    }),
    defineField({
      name: 'surface',
      title: 'Surface',
      type: 'string',
      options: {
        list: [
          { title: 'Road', value: 'Road' },
          { title: 'Trail', value: 'Trail' },
          { title: 'Track', value: 'Track' },
          { title: 'Mixed', value: 'Mixed' },
        ],
      },
    }),
    defineField({
      name: 'surfaceBreakdown',
      title: 'Surface Breakdown',
      type: 'string',
      description: 'Detailed surface composition of the course',
      options: {
        list: [
          { title: '100% Paved', value: '100% Paved' },
          { title: 'Unpaved', value: 'Unpaved' },
          { title: 'Mixed', value: 'Mixed' },
        ],
      },
    }),
    defineField({
      name: 'profile',
      title: 'Profile',
      type: 'string',
      description: 'Course elevation profile - consider both distance and net elevation when classifying',
      options: {
        list: [
          { title: 'Flat', value: 'flat' },
          { title: 'Rolling', value: 'rolling' },
          { title: 'Hilly', value: 'hilly' },
          { title: 'Mountainous', value: 'mountainous' },
        ],
      },
    }),
    defineField({
      name: 'elevationGain',
      title: 'Elevation Gain (meters)',
      type: 'number',
    }),
    defineField({
      name: 'elevationLoss',
      title: 'Elevation Loss (meters)',
      type: 'number',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add multiple tags to categorize this race (e.g., "World Athletics Gold", "Major Marathon", "Fast Course")',
    }),
    defineField({
      name: 'finishers',
      title: 'Number of Finishers 2025',
      type: 'number',
    }),
    defineField({
      name: 'price',
      title: 'Entry Price',
      type: 'number',
      description: 'Entry price in the local currency',
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      description: 'Currency of the entry price',
      options: {
        list: [
          { title: 'USD - US Dollar', value: 'USD' },
          { title: 'EUR - Euro', value: 'EUR' },
          { title: 'GBP - British Pound', value: 'GBP' },
          { title: 'JPY - Japanese Yen', value: 'JPY' },
          { title: 'AUD - Australian Dollar', value: 'AUD' },
          { title: 'CAD - Canadian Dollar', value: 'CAD' },
          { title: 'CHF - Swiss Franc', value: 'CHF' },
          { title: 'CNY - Chinese Yuan', value: 'CNY' },
          { title: 'SEK - Swedish Krona', value: 'SEK' },
          { title: 'DKK - Danish Krone', value: 'DKK' },
          { title: 'NZD - New Zealand Dollar', value: 'NZD' },
          { title: 'MXN - Mexican Peso', value: 'MXN' },
          { title: 'SGD - Singapore Dollar', value: 'SGD' },
          { title: 'HKD - Hong Kong Dollar', value: 'HKD' },
          { title: 'NOK - Norwegian Krone', value: 'NOK' },
          { title: 'KRW - South Korean Won', value: 'KRW' },
          { title: 'TRY - Turkish Lira', value: 'TRY' },
          { title: 'INR - Indian Rupee', value: 'INR' },
          { title: 'BRL - Brazilian Real', value: 'BRL' },
          { title: 'ZAR - South African Rand', value: 'ZAR' },
          { title: 'THB - Thai Baht', value: 'THB' },
          { title: 'QAR - Qatari Riyal', value: 'QAR' },
        ],
      },
      initialValue: 'USD',
    }),
    defineField({
      name: 'averageTemperature',
      title: 'Average Temperature (°C)',
      type: 'number',
    }),
    defineField({
      name: 'mensCourseRecord',
      title: "Men's Course Record",
      type: 'string',
      description: 'Format: HH:MM:SS',
    }),
    defineField({
      name: 'womensCourseRecord',
      title: "Women's Course Record",
      type: 'string',
      description: 'Format: HH:MM:SS',
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