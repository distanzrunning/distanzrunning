// src/app/races/[raceSlug]/page.tsx

import { sanity } from '@/lib/sanity'
import { urlFor } from '@/lib/image'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

export const revalidate = 60 // optional

export async function generateStaticParams() {
  const races = await sanity.fetch(`*[_type == "raceGuide"]{slug}`)
  return races.map((race: any) => ({ raceSlug: race.slug.current }))
}

export default async function RacePage({ params }: { params: { raceSlug: string } }) {
  const { raceSlug } = await Promise.resolve(params) // ✅ Fix for Next.js 15

  if (!raceSlug) return notFound()

  const race = await sanity.fetch(
    `*[_type == "raceGuide" && slug.current == $slug][0]{
      title,
      location,
      eventDate,
      mainImage
    }`,
    { slug: raceSlug }
  )

  if (!race) return notFound()

  const formattedDate = race.eventDate ? format(new Date(race.eventDate), 'MMMM d, yyyy') : 'Unknown Date'

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article>
          {race.mainImage && (
            <img
              src={urlFor(race.mainImage).width(1200).url()}
              alt={race.title}
              className="rounded-xl w-full h-[400px] object-cover mb-8"
            />
          )}

          <h1 className="text-4xl font-bold mb-4">{race.title}</h1>

          {race.location && (
            <div className="text-lg text-muted mb-2">
              📍 {race.location}
            </div>
          )}

          {formattedDate && (
            <div className="text-lg text-muted mb-8">
              📅 {formattedDate}
            </div>
          )}

          {/* Future: Interactive map, elevation graph, stats */}
          <div className="text-muted">
            <p>Full race guide content coming soon!</p>
          </div>
        </article>
      </div>
    </div>
  )
}