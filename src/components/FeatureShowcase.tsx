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
    image: "/images/placeholder-news.jpg", // Replace with your image
    imageAlt: "Running News"
  },
  {
    title: "Gear Reviews",
    description: "In-depth reviews and comparisons of the latest running shoes, apparel, and accessories to help you make informed decisions.",
    image: "/images/placeholder-gear.jpg", // Replace with your image
    imageAlt: "Gear Reviews"
  },
  {
    title: "Interactive Race Guides",
    description: "Explore detailed race guides with interactive maps, elevation profiles, and insider tips for your next marathon.",
    image: "/images/placeholder-race.jpg", // Replace with your image
    imageAlt: "Interactive Race Guides"
  }
]

export default function FeatureShowcase() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 auto-rows-auto">

          {/* Running News - Full width top section */}
          <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 group">
            <div className="flex flex-col lg:flex-row h-full min-h-[400px] md:min-h-[500px]">
              {/* Text content */}
              <div className="flex flex-col justify-center gap-4 px-8 py-10 md:px-12 md:py-16 lg:w-2/5 z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white transition-colors duration-300">
                  {features[0].title}
                </h3>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed transition-colors duration-300">
                  {features[0].description}
                </p>
              </div>

              {/* Image */}
              <div className="relative lg:w-3/5 h-64 lg:h-auto">
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-50 dark:from-neutral-900 via-transparent to-transparent pointer-events-none z-10" />
                <Image
                  src={features[0].image}
                  alt={features[0].imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </div>
          </div>

          {/* Gear Reviews - Bottom left */}
          <div className="relative overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 group">
            <div className="flex flex-col h-full min-h-[400px]">
              {/* Text content */}
              <div className="flex flex-col gap-4 px-8 py-10 md:px-12 md:py-12 z-10">
                <h3 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white transition-colors duration-300">
                  {features[1].title}
                </h3>
                <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed transition-colors duration-300">
                  {features[1].description}
                </p>
              </div>

              {/* Image */}
              <div className="relative flex-1 min-h-[200px]">
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 dark:from-neutral-900 via-transparent to-transparent pointer-events-none z-10" />
                <Image
                  src={features[1].image}
                  alt={features[1].imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Interactive Race Guides - Bottom right */}
          <div className="relative overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 group">
            <div className="flex flex-col h-full min-h-[400px]">
              {/* Text content */}
              <div className="flex flex-col gap-4 px-8 py-10 md:px-12 md:py-12 z-10">
                <h3 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white transition-colors duration-300">
                  {features[2].title}
                </h3>
                <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed transition-colors duration-300">
                  {features[2].description}
                </p>
              </div>

              {/* Image */}
              <div className="relative flex-1 min-h-[200px]">
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 dark:from-neutral-900 via-transparent to-transparent pointer-events-none z-10" />
                <Image
                  src={features[2].image}
                  alt={features[2].imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
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
