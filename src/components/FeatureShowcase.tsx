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
    <section className="w-full overflow-x-clip px-6">
      <div className="pb-48 max-w-6xl mx-auto flex w-full flex-col gap-24">

        {/* Title Section - Indented */}
        <div className="w-full pl-0 md:pl-16 lg:pl-24">
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-4 max-w-screen-md">
              <div className="flex flex-col gap-6">
                {/* Badge/Pill */}
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 self-start rounded-full border border-borderNeutralSubtle backdrop-blur-md px-2.5 py-1.5 md:px-3 md:py-2">
                    <span className="text-xs md:text-sm text-textDefault font-medium">
                      Features
                    </span>
                  </div>
                </div>
              </div>

              {/* Headline and Description */}
              <div className="flex flex-col gap-4">
                <h2 className="text-[1.75rem] leading-tight md:text-[2.25rem] md:leading-tight text-pretty md:text-balance text-textDefault font-semibold">
                  Everything you need to stay ahead
                </h2>
                <p className="text-base md:text-lg text-textSubtle leading-relaxed">
                  From breaking news to detailed race guides and expert gear reviews, we provide the insights and tools every runner needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid container with auto-rows */}
        <div className="flex auto-rows-[minmax(300px,auto)] grid-cols-6 flex-col gap-2.5 md:grid">

          {/* Running News - Full width top section (spans 6 columns, 1 row) */}
          <div
            className="relative z-0 overflow-hidden rounded-xl bg-neutralBgSubtle min-h-[400px]"
            style={{ gridColumn: 'span 6 / span 6' }}
          >
            <div className="flex h-full w-full flex-col lg:flex-row">
              {/* Text content */}
              <div className="flex flex-col gap-3 lg:basis-2/5 px-8 py-8 md:px-16 md:py-16">
                <h3 className="text-xl md:text-2xl leading-tight text-textDefault font-semibold">
                  {features[0].title}
                </h3>
                <p className="text-base md:text-lg text-textSubtle leading-relaxed">
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
                  priority={true}
                />
                {/* Gradient fade from left - placed after image to be on top */}
                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-neutralBgSubtle to-transparent pointer-events-none" />
              </div>

              {/* Image - Mobile */}
              <div className="relative w-full h-64 lg:hidden">
                <Image
                  src={features[0].image}
                  alt={features[0].imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 0vw"
                  priority={true}
                />
                {/* Gradient fade from top on mobile - placed after image to be on top */}
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-neutralBgSubtle to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Gear Reviews - Bottom left (spans 3 columns) */}
          <div
            className="relative z-0 overflow-hidden rounded-xl bg-neutralBgSubtle"
            style={{ gridColumn: 'span 3 / span 3' }}
          >
            <div className="flex h-full w-full flex-col">
              {/* Text content */}
              <div className="flex flex-col gap-3 px-8 py-8 md:px-16 md:py-16 z-10">
                <h3 className="text-xl md:text-2xl leading-tight text-textDefault font-semibold">
                  {features[1].title}
                </h3>
                <p className="text-base md:text-lg text-textSubtle leading-relaxed">
                  {features[1].description}
                </p>
              </div>

              {/* Image - Desktop */}
              <div className="relative flex-1 min-h-[200px] -z-10 hidden md:block">
                <Image
                  src={features[1].image}
                  alt={features[1].imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 0vw, 50vw"
                  priority={false}
                />
                {/* Gradient fade from top - placed after image to be on top */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-neutralBgSubtle to-transparent pointer-events-none" />
              </div>

              {/* Image - Mobile */}
              <div className="relative w-full h-64 -z-10 md:hidden">
                <Image
                  src={features[1].image}
                  alt={features[1].imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 0vw"
                  priority={false}
                />
                {/* Gradient fade from top - placed after image to be on top */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-neutralBgSubtle to-transparent pointer-events-none" />
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
              <div className="flex flex-col gap-3 px-8 py-8 md:px-16 md:py-16 z-10">
                <h3 className="text-xl md:text-2xl leading-tight text-textDefault font-semibold">
                  {features[2].title}
                </h3>
                <p className="text-base md:text-lg text-textSubtle leading-relaxed">
                  {features[2].description}
                </p>
              </div>

              {/* Image - Desktop */}
              <div className="relative flex-1 min-h-[200px] -z-10 hidden md:block">
                <Image
                  src={features[2].image}
                  alt={features[2].imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 0vw, 50vw"
                  priority={false}
                />
                {/* Gradient fade from top - placed after image to be on top */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-neutralBgSubtle to-transparent pointer-events-none" />
              </div>

              {/* Image - Mobile */}
              <div className="relative w-full h-64 -z-10 md:hidden">
                <Image
                  src={features[2].image}
                  alt={features[2].imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 0vw"
                  priority={false}
                />
                {/* Gradient fade from top - placed after image to be on top */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-neutralBgSubtle to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
