// src/components/Footer.tsx
import Link from 'next/link'
import {
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXTwitter,
  faStrava,
} from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Top Section */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <img
                src="/images/logo.svg"
                alt="Distanz Running Logo"
                className="h-8 md:h-10 w-auto"
              />
              <span className="sr-only">Distanz Running</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              The latest running news, marathon guides and gear reviews for passionate runners.
            </p>
          </div>


          {/* Mobile Layout: Group columns into 2s */}
          <div className="grid grid-cols-2 md:hidden gap-10 mt-10">
            <div>
              <h4 className="text-base font-semibold tracking-wide mb-4 border-t-2 border-black pt-4">Stories</h4>
              <ul className="space-y-2">
                <li><Link href="/articles/category/road" className="hover:text-primary text-sm">Road</Link></li>
                <li><Link href="/articles/category/track" className="hover:text-primary text-sm">Track</Link></li>
                <li><Link href="/articles/category/trail" className="hover:text-primary text-sm">Trail</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold tracking-wide mb-4 border-t-2 border-black pt-4">Gear</h4>
              <ul className="space-y-2">
                <li><Link href="/gear/category/race-day-shoes" className="hover:text-primary text-sm">Race Day Shoes</Link></li>
                <li><Link href="/gear/category/max-cushion-shoes" className="hover:text-primary text-sm">Max Cushion Shoes</Link></li>
                <li><Link href="/gear/category/daily-trainers" className="hover:text-primary text-sm">Daily Trainers</Link></li>
                <li><Link href="/gear/category/tempo-shoes" className="hover:text-primary text-sm">Tempo Shoes</Link></li>
                <li><Link href="/gear/category/gps-watches" className="hover:text-primary text-sm">GPS Watches</Link></li>
                <li><Link href="/gear/category/nutrition" className="hover:text-primary text-sm">Nutrition</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold tracking-wide mb-4 border-t-2 border-black pt-4">Races</h4>
              <ul className="space-y-2">
                <li><Link href="/races" className="hover:text-primary text-sm">Race Profiles</Link></li>
                <li><Link href="/races/database" className="hover:text-primary text-sm">Race Database</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold tracking-wide mb-4 border-t-2 border-black pt-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-primary text-sm">About</Link></li>
                <li><Link href="/contact" className="hover:text-primary text-sm">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Desktop Layout Only */}
          <div className="hidden md:block">
            <h4 className="text-base font-semibold tracking-wide mb-4 border-t-2 border-black pt-4">Stories</h4>
            <ul className="space-y-2">
              <li><Link href="/articles/category/road" className="hover:text-primary text-sm">Road</Link></li>
              <li><Link href="/articles/category/track" className="hover:text-primary text-sm">Track</Link></li>
              <li><Link href="/articles/category/trail" className="hover:text-primary text-sm">Trail</Link></li>
            </ul>
          </div>
          <div className="hidden md:block">
            <h4 className="text-base font-semibold tracking-wide mb-4 border-t-2 border-black pt-4">Gear</h4>
            <ul className="space-y-2">
              <li><Link href="/gear/category/race-day-shoes" className="hover:text-primary text-sm">Race Day Shoes</Link></li>
              <li><Link href="/gear/category/max-cushion-shoes" className="hover:text-primary text-sm">Max Cushion Shoes</Link></li>
              <li><Link href="/gear/category/daily-trainers" className="hover:text-primary text-sm">Daily Trainers</Link></li>
              <li><Link href="/gear/category/tempo-shoes" className="hover:text-primary text-sm">Tempo Shoes</Link></li>
              <li><Link href="/gear/category/gps-watches" className="hover:text-primary text-sm">GPS Watches</Link></li>
              <li><Link href="/gear/category/nutrition" className="hover:text-primary text-sm">Nutrition</Link></li>
            </ul>
          </div>
          <div className="hidden md:block">
            <h4 className="text-base font-semibold tracking-wide mb-4 border-t-2 border-black pt-4">Races</h4>
            <ul className="space-y-2">
              <li><Link href="/races" className="hover:text-primary text-sm">Race Profiles</Link></li>
              <li><Link href="/races/database" className="hover:text-primary text-sm">Race Database</Link></li>
            </ul>
          </div>
          <div className="hidden md:block">
            <h4 className="text-base font-semibold tracking-wide mb-4 border-t-2 border-black pt-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary text-sm">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary text-sm">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-sm">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          </div>

          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Link href="https://x.com" target="_blank" aria-label="X / Twitter" className="hover:text-primary">
              <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="hover:text-primary">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="https://www.instagram.com/distanzrunning/" target="_blank" aria-label="Instagram" className="hover:text-primary">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="https://strava.com" target="_blank" aria-label="Strava" className="hover:text-primary">
              <FontAwesomeIcon icon={faStrava} className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4 md:mt-0">© {new Date().getFullYear()} Distanz Running. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}