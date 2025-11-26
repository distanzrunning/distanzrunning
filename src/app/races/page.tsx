// src/app/races/page.tsx

import { client as sanity } from '@/sanity/lib/client'
import { RaceGuidesClient } from './RaceGuidesClient'

export type RaceGuide = {
  _id: string
  title: string
  slug: { current: string }
  city?: string
  stateRegion?: string
  country?: string
  eventDate: string
  mainImage: any
  raceCategoryName?: string
  distance?: number
  surface?: string
  surfaceBreakdown?: string
  profile?: string
  elevationGain?: number
  elevationLoss?: number
  averageTemperature?: number
  price?: number
  currency?: string
  tags?: string[]
  mensCourseRecord?: string
  womensCourseRecord?: string
  finishers?: number
}

export const revalidate = 60 // Incremental Static Regeneration - refresh every 60s

export default async function RaceGuidesPage() {
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
      averageTemperature,
      price,
      currency,
      tags,
      "raceCategoryName": raceCategory->title
    }
  `)

  return <RaceGuidesClient races={raceGuides} />
}
