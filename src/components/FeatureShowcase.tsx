'use client'

import Image from 'next/image'

type Feature = {
  title: string
  description: string
  image: string
  imageAlt: string
}

const features: Feature[] = [
  {
    title: "Running News",
    description: "Stay up to date with the latest running news, race results, and athlete profiles from around the world.",
    image: "/images/running_news.jpg",
    imageAlt: "Running News"
  },
  {
    title: "Gear Reviews",
    description: "In-depth reviews and comparisons of the latest running shoes, apparel, and accessories to help you make informed decisions.",
    image: "/images/gear_reviews.jpg",
    imageAlt: "Gear Reviews"
  },
  {
    title: "Interactive Race Guides",
    description: "Explore detailed race guides with interactive maps, elevation profiles, and insider tips for your next marathon.",
    image: "/images/races_logos.webp",
    imageAlt: "Interactive Race Guides"
  }
]

export default function FeatureShowcase() {
  return (
    <section className="w-full overflow-x-clip pb-24">
      <div className="pt-0 pb-24 max-w-[calc(1024px+2rem)] mx-auto flex w-full flex-col gap-6 px-4">
        {/* Grid container with auto-rows */}
        <div className="flex auto-rows-[minmax(300px,auto)] grid-cols-6 flex-col gap-2.5 md:grid">

          {/* Running News - Full width top section (spans 6 columns, 2 rows) */}
          <div
            className="relative z-0 overflow-hidden rounded-xl bg-neutralBgSubtle"
            style={{ gridColumn: 'span 6 / span 6', gridRow: 'span 2 / span 2' }}
          >
            <div className="flex h-full w-full flex-col lg:flex-row">
              {/* Text content */}
              <div className="flex flex-col gap-3 lg:basis-2/5 px-8 py-8 md:px-16 md:pt-16">
                <h3 className="text-h3-quartr md:text-h2-quartr text-textDefault">
                  {features[0].title}
                </h3>
                <p className="text-body-quartr text-textSubtle">
                  {features[0].description}
                </p>
              </div>

              {/* Image - Desktop */}
              <div className="relative lg:basis-3/5 h-64 lg:h-auto hidden lg:block">
                <Image
                  src={features[0].image}
                  alt={features[0].imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 0vw, 60vw"
                />
              </div>

              {/* Image - Mobile */}
              <div className="relative w-full h-64 lg:hidden">
                <Image
                  src={features[0].image}
                  alt={features[0].imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 0vw"
                />
              </div>
            </div>
          </div>

          {/* Gear Reviews - Bottom left (spans 3 columns, 1 row) */}
          <div
            className="relative z-0 overflow-hidden rounded-xl bg-neutralBgSubtle"
            style={{ gridColumn: 'span 3 / span 3', gridRow: 'span 1 / span 1' }}
          >
            <div className="flex h-full w-full flex-col">
              {/* Text content */}
              <div className="flex flex-col gap-3 px-8 py-8 md:px-16 md:pt-16">
                <h3 className="text-h3-quartr text-textDefault">
                  {features[1].title}
                </h3>
                <p className="text-body-quartr text-textSubtle">
                  {features[1].description}
                </p>
              </div>

              {/* Image */}
              <div className="relative flex-1 min-h-[200px]">
                <Image
                  src={features[1].image}
                  alt={features[1].imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Interactive Race Guides - Bottom right (spans 3 columns) */}
          <div
            className="relative z-0 overflow-hidden rounded-xl bg-neutralBgSubtle"
            style={{ gridColumn: 'span 3 / span 3' }}
          >
            <div className="flex h-full w-full flex-col">
              {/* Text content */}
              <div className="flex flex-col gap-3 px-8 py-8 md:px-16 md:pt-16">
                <h3 className="text-h3-quartr text-textDefault">
                  {features[2].title}
                </h3>
                <p className="text-body-quartr text-textSubtle">
                  {features[2].description}
                </p>
              </div>

              {/* Image */}
              <div className="relative flex-1 min-h-[200px]">
                <Image
                  src={features[2].image}
                  alt={features[2].imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
