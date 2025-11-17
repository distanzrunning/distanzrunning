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
      name: 'surface',
      title: 'Surface',
      type: 'string',
      options: {
        list: [
          { title: 'Road', value: 'road' },
          { title: 'Trail', value: 'trail' },
          { title: 'Track', value: 'track' },
          { title: 'Mixed', value: 'mixed' },
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
      name: 'worldAthleticsLabel',
      title: 'World Athletics Label',
      type: 'string',
      options: {
        list: [
          { title: 'Platinum', value: 'platinum' },
          { title: 'Gold', value: 'gold' },
          { title: 'Silver', value: 'silver' },
          { title: 'Bronze', value: 'bronze' },
          { title: 'Elite', value: 'elite' },
          { title: 'None', value: 'none' },
        ],
      },
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
        ],
      },
      initialValue: 'USD',
    }),
    defineField({
      name: 'avgTemperature',
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