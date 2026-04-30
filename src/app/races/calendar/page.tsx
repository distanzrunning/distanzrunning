// src/app/races/calendar/page.tsx

import { client as sanity } from '@/sanity/lib/client'
import { RaceCalendarClient } from './RaceCalendarClient'
import type { RaceGuide } from '../page'

export const metadata = {
  title: 'Race Calendar | Distanz Running',
  description: 'Explore upcoming races on an interactive calendar. Find your next race and plan your running schedule.',
}

export const revalidate = 60 // Incremental Static Regeneration - refresh every 60s

export default async function RaceCalendarPage() {
  const raceGuides: RaceGuide[] = await sanity.fetch(`
    *[_type == "raceGuide"] | order(eventDate asc) {
      _id,
      title,
      slug,
      city,
      stateRegion,
      country,
      eventDate,
      mainImage,
      distance,
      surface,
      surfaceBreakdown,
      profile,
      elevationGain,
      elevationLoss,
      averageTemperature,
      price,
      currency,
      tags,
      mensCourseRecord,
      mensCourseRecordAthlete,
      mensCourseRecordCountry,
      womensCourseRecord,
      womensCourseRecordAthlete,
      womensCourseRecordCountry,
      finishers,
      officialWebsite,
      gpxFile {
        asset-> {
          _id,
          url
        }
      },
      "raceCategoryName": raceCategory->title
    }
  `)

  return <RaceCalendarClient races={raceGuides} />
}
