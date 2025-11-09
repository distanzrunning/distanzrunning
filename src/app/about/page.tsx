import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us | Distanz Running - Your Hub for Running Stories, Gear Reviews & Race Guides',
  description: 'Distanz Running is creating a comprehensive hub for runners worldwide. Discover in-depth stories, expert gear reviews, and detailed race guides from marathon majors to trail ultras.',
  keywords: 'running blog, running gear reviews, race guides, marathon training, running stories, carbon-plated shoes, running community',
  openGraph: {
    title: 'About Distanz Running - Expert Running Content & Community',
    description: 'Your comprehensive hub for running stories, gear analysis, and race guides. From carbon-plated shoes to marathon majors.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
            Your Hub for Running Stories, Gear & Races
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl mx-auto">
            We're creating a comprehensive hub for runners with in-depth stories and analysis from the world of running, gear reviews, and race guides.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6 font-playfair">
            Our Mission
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              At Distanz Running, we believe every runner deserves access to reliable, in-depth information that helps them make better decisions and achieve their goals.
            </p>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Whether you're hunting for the perfect carbon-plated race shoe, planning your first marathon major, or seeking inspiration from the latest running stories, we're here to guide you every step of the way.
            </p>
          </div>
        </section>

        {/* What We Cover Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-8 font-playfair">
            What We Cover
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Stories */}
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                Stories & Analysis
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                From road racing to track & field to trail running, we deliver compelling stories and expert analysis from the world of distance running.
              </p>
            </div>

            {/* Gear */}
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                Gear Reviews
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Honest, detailed reviews of running shoes, GPS watches, nutrition, and more—helping you find the right gear for your training and racing.
              </p>
            </div>

            {/* Races */}
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                Race Guides
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Comprehensive guides to races worldwide, from the marathon majors to hidden gem trail ultras, with course maps, tips, and insights.
              </p>
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6 font-playfair">
            Our Approach
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              We're not just another running blog. Every piece of content we publish is thoroughly researched, tested, and crafted to provide genuine value to the running community.
            </p>
            <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
              <li className="flex items-start gap-3">
                <span className="text-electric-pink mt-1">✓</span>
                <span><strong>Expert Testing:</strong> Our gear reviews are based on real-world testing, not just manufacturer specs.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-electric-pink mt-1">✓</span>
                <span><strong>In-Depth Analysis:</strong> We go beyond surface-level coverage to deliver insights you won't find elsewhere.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-electric-pink mt-1">✓</span>
                <span><strong>Runner-First:</strong> Every decision we make puts the needs of runners first, not advertisers or sponsors.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="bg-neutral-900 dark:bg-neutral-800 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-playfair">
            Join the Distanz Community
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Get the latest running stories, gear reviews, and race guides delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/newsletter"
              className="inline-flex items-center justify-center px-8 py-3 bg-electric-pink hover:bg-electric-pink/90 text-white font-semibold rounded-lg transition-colors"
            >
              Subscribe to Newsletter
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-semibold rounded-lg transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
