import { InstagramPost } from '@/components/InstagramPost'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instagram Post Generator | Distanz Running',
  description: 'Generate Instagram posts for marathon majors',
}

export default function InstagramPostPage() {
  // You can change this to generate posts for different marathons
  const marathonId = 'nyc' // Options: tokyo, boston, london, berlin, chicago, nyc, sydney

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Instagram Post Generator</h1>
          <p className="text-neutral-600">
            Screenshot these to create Instagram posts. Each post is 1080x1350px (4:5 ratio).
          </p>
          <p className="text-neutral-600 mt-2">
            <strong>Tips for screenshots:</strong>
          </p>
          <ul className="list-disc list-inside text-neutral-600 mt-2">
            <li>Use a screenshot tool to capture exactly 1080x1350px</li>
            <li>Or right-click and "Save Image As" if your browser supports it</li>
            <li>Change the <code className="bg-neutral-200 px-2 py-1 rounded">marathonId</code> in the code to generate posts for different marathons</li>
          </ul>
        </div>

        <div className="flex flex-col gap-8 items-center">
          {/* Map Post */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Post 1: Map & Logo</h2>
            <div className="inline-block border-4 border-neutral-800">
              <InstagramPost marathonId={marathonId} type="map" />
            </div>
          </div>

          {/* Stats Post */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Post 2: Key Stats</h2>
            <div className="inline-block border-4 border-neutral-800">
              <InstagramPost marathonId={marathonId} type="stats" />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white p-6 rounded-lg border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">How to Generate Posts for Different Marathons</h3>
          <p className="text-neutral-600 mb-4">Edit this file: <code className="bg-neutral-100 px-2 py-1 rounded">src/app/instagram-post/page.tsx</code></p>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-700 mb-2"><strong>Available Marathon IDs:</strong></p>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
              <li><code>tokyo</code> - Tokyo Marathon (Mar 01)</li>
              <li><code>boston</code> - Boston Marathon (Apr 20)</li>
              <li><code>london</code> - London Marathon (Apr 26)</li>
              <li><code>sydney</code> - Sydney Marathon (Aug 30)</li>
              <li><code>berlin</code> - Berlin Marathon (Sep 27)</li>
              <li><code>chicago</code> - Chicago Marathon (Oct 11)</li>
              <li><code>nyc</code> - New York City Marathon (Nov 02) ← Currently Selected</li>
            </ul>
            <p className="text-sm text-neutral-700 mt-4 mb-2"><strong>Post Types:</strong></p>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
              <li><code>map</code> - Shows the marathon route with logo and branding</li>
              <li><code>stats</code> - Shows key statistics in a grid layout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
