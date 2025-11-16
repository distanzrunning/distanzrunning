// src/sanity/schemaTypes/raceGuideType.ts

import { defineType, defineField } from 'sanity'
import { PinIcon } from '@sanity/icons'
import { ProfileInput } from '../components/ProfileInput'

// Helper function to calculate profile based on net elevation
export function calculateProfile(elevationGain: number = 0, elevationLoss: number = 0): string {
  const netElevation = Math.abs(elevationGain - elevationLoss)

  if (netElevation < 50) return 'flat'
  if (netElevation < 200) return 'rolling'
  if (netElevation < 500) return 'hilly'
  return 'mountainous'
}

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
      name: 'location',
      type: 'string',
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
      name: 'courseMap',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'elevationGraph',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'statsTable',
      type: 'text',
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
      description: 'Automatically calculated based on net elevation (gain - loss)',
      components: {
        input: ProfileInput,
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
      title: 'Average Number of Finishers',
      type: 'number',
    }),
    defineField({
      name: 'price',
      title: 'Entry Price (USD)',
      type: 'number',
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