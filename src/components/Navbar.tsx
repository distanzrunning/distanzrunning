// src/components/Navbar.tsx
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-3' : 'bg-white py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className={`transition-transform duration-300 ${
            scrolled ? 'transform-none' : '-translate-x-4 opacity-80'
          }`}>
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-dark">Distanz <span className="text-primary">Running</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/articles" className="text-sm font-medium text-dark hover:text-primary">
              Articles
            </Link>
            <Link href="/articles/category/road" className="text-sm font-medium text-dark hover:text-primary">
              Road
            </Link>
            <Link href="/articles/category/track" className="text-sm font-medium text-dark hover:text-primary">
              Track
            </Link>
            <Link href="/articles/category/trail" className="text-sm font-medium text-dark hover:text-primary">
              Trail
            </Link>
            <Link href="/gear" className="text-sm font-medium text-dark hover:text-primary">
              Gear
            </Link>
            <Link href="/races" className="text-sm font-medium text-dark hover:text-primary">
              Race Guides
            </Link>
          </div>
          
          <div className={`transition-transform duration-300 ${
            scrolled ? 'transform-none' : 'translate-x-4 opacity-80'
          }`}>
            <Link href="/newsletter">
              <button className="rounded-md bg-dark px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary transition-colors duration-300">
                Newsletter
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}