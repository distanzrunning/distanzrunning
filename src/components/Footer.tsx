// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Distanz <span className="text-primary">Running</span></h3>
            <p className="text-gray-300 text-sm">
              The latest running news, marathon guides and gear reviews.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Content</h3>
            <ul className="space-y-2">
              <li><Link href="/articles" className="text-gray-300 hover:text-primary text-sm">Articles</Link></li>
              <li><Link href="/gear" className="text-gray-300 hover:text-primary text-sm">Gear</Link></li>
              <li><Link href="/races" className="text-gray-300 hover:text-primary text-sm">Race Guides</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-primary text-sm">About</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-primary text-sm">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-300 hover:text-primary text-sm">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-primary text-sm">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Distanz Running. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}