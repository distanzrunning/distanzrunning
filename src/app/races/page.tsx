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
  raceCategoryName?: string
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
      mainImage,
      "raceCategoryName": raceCategory->title
    }
  `)

  return (
    <div className="py-12 bg-white dark:bg-[#0c0c0d] min-h-screen transition-colors duration-300">
      <div className="w-[96%] sm:w-[90%] max-w-[2000px] mx-auto px-2 sm:px-3">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4 text-neutral-900 dark:text-white">Race Guides</h1>
          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl">
            Find your next race. Explore thousands of the world&apos;s greatest races with detailed race guides, course analysis, insider tips and recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {raceGuides.map((race) => (
            <Link
              key={race._id}
              href={`/races/${race.slug.current}`}
              className="group transition-opacity duration-200 hover:opacity-80"
            >
              <div className="flex flex-col">
                {/* Image Container */}
                <div className="relative w-full">
                  {/* Image Wrapper */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div style={{ paddingBottom: '65%' }} className="relative">
                      {race.mainImage && (
                        <img
                          src={urlFor(race.mainImage).width(800).height(520).url()}
                          alt={race.title}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                      )}
                    </div>
                  </div>

                  {/* Distance/Category Pill - Top Right */}
                  {race.raceCategoryName && (
                    <div className="absolute top-3 right-3 z-[2]">
                      <div className="px-3 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm rounded-full">
                        <p className="font-body text-xs font-medium text-neutral-900 dark:text-white">
                          {race.raceCategoryName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Card */}
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-b-lg px-5 py-5">
                  <div className="flex items-center justify-between gap-3">
                    {/* Title and Location */}
                    <div className="flex flex-col gap-1 flex-1">
                      <h3 className="font-body text-xl font-semibold leading-tight text-neutral-900 dark:text-white line-clamp-2">
                        {race.title}
                      </h3>
                      {race.location && (
                        <p className="font-body text-sm font-normal text-neutral-600 dark:text-neutral-400">
                          {race.location}
                        </p>
                      )}
                    </div>

                    {/* Date Container - Right Side (Rounded) */}
                    <div className="flex flex-col items-center justify-center gap-0 flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-16 h-16">
                      <p className="font-body text-xs font-medium uppercase text-neutral-900 dark:text-white" suppressHydrationWarning>
                        {format(new Date(race.eventDate), 'MMM')}
                      </p>
                      <p className="font-body text-2xl font-semibold leading-tight text-neutral-900 dark:text-white" suppressHydrationWarning>
                        {format(new Date(race.eventDate), 'dd')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}