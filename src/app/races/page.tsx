// src/app/races/page.tsx

import { client as sanity } from '@/sanity/lib/client'
import Link from 'next/link'
import { format } from 'date-fns'
import { urlFor } from '@/sanity/lib/image'

type RaceGuide = {
  _id: string
  title: string
  slug: { current: string }
  location: string
  eventDate: string
  mainImage: any
}

export const revalidate = 60 // Incremental Static Regeneration - refresh every 60s

export default async function RaceGuidesPage() {
  const raceGuides: RaceGuide[] = await sanity.fetch(`
    *[_type == "raceGuide"] | order(eventDate asc) {
      _id,
      title,
      slug,
      location,
      eventDate,
      mainImage
    }
  `)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-dark">Race Guides</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {raceGuides.map((race) => (
            <Link
              key={race._id}
              href={`/races/${race.slug.current}`}
              className="group bg-white border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
            >
              {race.mainImage && (
                <img
                  src={urlFor(race.mainImage).width(600).height(400).url()}
                  alt={race.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="text-sm text-muted mb-2">
                  {race.location} — {format(new Date(race.eventDate), 'MMMM d, yyyy')}
                </div>
                <h2 className="text-xl font-bold text-dark group-hover:text-primary transition">
                  {race.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}