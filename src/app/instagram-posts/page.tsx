'use client'

import React, { useEffect, useState } from 'react'
import { InstagramPost } from '@/components/InstagramPost'
import { marathonData } from '@/constants/marathonData'

export default function InstagramPostsPage() {
  const [selectedMarathonId, setSelectedMarathonId] = useState(marathonData[0].id)

  // Hide navbar and footer for clean screenshot experience
  useEffect(() => {
    // Find and hide navbar
    const navbar = document.querySelector('nav')
    const footer = document.querySelector('footer')
    const body = document.body

    const originalBodyBackground = body.style.background

    if (navbar) navbar.style.display = 'none'
    if (footer) footer.style.display = 'none'
    body.style.background = '#f5f5f5' // neutral-100 background

    // Cleanup: restore navbar and footer when leaving this page
    return () => {
      if (navbar) navbar.style.display = ''
      if (footer) footer.style.display = ''
      body.style.background = originalBodyBackground
    }
  }, [])

  const selectedMarathon = marathonData.find(m => m.id === selectedMarathonId) || marathonData[0]

  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Marathon Majors Instagram Posts
          </h1>
          <p className="text-lg text-neutral-600 mb-6">
            7 marathons × 2 posts each = 14 Instagram-ready images (1080×1350px, 4:5 ratio)
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block mb-8">
            <p className="text-sm text-blue-900">
              <strong>How to save:</strong> Right-click each image → "Save Image As" or use screenshot tools to capture at exact dimensions
            </p>
          </div>

          {/* Marathon Selector */}
          <div className="mt-8">
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              Select Marathon:
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {marathonData.map((marathon) => (
                <button
                  key={marathon.id}
                  onClick={() => setSelectedMarathonId(marathon.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedMarathonId === marathon.id
                      ? 'bg-pink-600 text-white shadow-lg scale-105'
                      : 'bg-white text-neutral-700 border border-neutral-300 hover:border-pink-400 hover:shadow-md'
                  }`}
                >
                  {marathon.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div>
          <div className="border-t-4 border-neutral-300 pt-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
              {selectedMarathon.name} Marathon
            </h2>

            <div className="flex gap-6 justify-center items-start">
              {/* Map Post */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-neutral-300">
                  <InstagramPost marathon={selectedMarathon} type="map" />
                </div>
                <p className="text-center text-sm font-semibold text-neutral-700">
                  Post 1: Route Map
                </p>
              </div>

              {/* Stats Post */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-neutral-300">
                  <InstagramPost marathon={selectedMarathon} type="stats" />
                </div>
                <p className="text-center text-sm font-semibold text-neutral-700">
                  Post 2: Key Stats
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Instructions */}
        <div className="mt-16 bg-neutral-800 text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Posting Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-neutral-200">
            <li>Save both images for each marathon (map + stats)</li>
            <li>Upload to Instagram as a carousel post (swipe post)</li>
            <li>Each image is exactly 1080×1350px (Instagram's 4:5 ratio)</li>
            <li>Add captions with marathon details, date, and hashtags</li>
            <li>Tag relevant marathon accounts and running communities</li>
          </ol>

          <div className="mt-6 pt-6 border-t border-neutral-700">
            <p className="text-sm text-neutral-400">
              <strong>Design:</strong> Matches the MarathonShowcase component styling with consistent Quartr branding
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
