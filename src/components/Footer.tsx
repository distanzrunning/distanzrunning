// src/components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { DarkModeContext } from "./DarkModeProvider";
import { ChevronRight } from "lucide-react";
import { SiInstagram, SiX, SiStrava, SiLinkedin } from "react-icons/si";
import NewsletterSignup from "./ui/NewsletterSignup";

export default function Footer() {
  const { isDark } = useContext(DarkModeContext);

  return (
    <footer aria-label="Site footer" className="bg-canvas">
      {/* Newsletter Signup Section */}
      <NewsletterSignup />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 pt-16 md:pt-20">
        <div className="flex flex-col gap-16 md:flex-row md:justify-between md:gap-32">
          {/* Left: Logo, About, Social Icons */}
          <div className="flex max-w-48 md:max-w-xs flex-col gap-8">
            <Link href="/" className="inline-block">
              <Image
                src={isDark ? "/images/logo_white.svg" : "/images/logo.svg"}
                alt="Distanz Running"
                width={210}
                height={56}
                className="h-12 w-auto"
                priority
              />
            </Link>
            <p className="text-footer-link text-textSubtle">
              A hub for quality in-depth running stories, gear reviews, and race
              guides
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.instagram.com/distanzrunning/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-textSubtle hover:text-textDefault transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <SiInstagram className="w-6 h-6" aria-hidden="true" />
              </Link>
              <Link
                href="https://x.com/distanzrunning"
                target="_blank"
                rel="noopener noreferrer"
                className="text-textSubtle hover:text-textDefault transition-all hover:scale-110"
                aria-label="X / Twitter"
              >
                <SiX className="w-6 h-6" aria-hidden="true" />
              </Link>
              <Link
                href="https://www.strava.com/clubs/distanzrunning"
                target="_blank"
                rel="noopener noreferrer"
                className="text-textSubtle hover:text-textDefault transition-all hover:scale-110"
                aria-label="Strava"
              >
                <SiStrava className="w-6 h-6" aria-hidden="true" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/distanz-running/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-textSubtle hover:text-textDefault transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="w-6 h-6" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right: Category and Company Columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-20 md:flex md:flex-row md:gap-12 md:shrink-0">
            {/* Category Column */}
            <div className="flex flex-col gap-6 md:min-w-[160px]">
              <h3 className="text-footer-heading text-textDefault">Category</h3>
              <ul className="flex flex-col gap-5">
                <li>
                  <Link
                    href="/articles/category/road"
                    className="text-footer-link text-textSubtle hover:text-textDefault transition-colors"
                  >
                    Road
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles/category/track"
                    className="text-footer-link text-textSubtle hover:text-textDefault transition-colors"
                  >
                    Track
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles/category/trail"
                    className="text-footer-link text-textSubtle hover:text-textDefault transition-colors"
                  >
                    Trail
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gear"
                    className="text-footer-link text-textSubtle hover:text-textDefault transition-colors"
                  >
                    Gear
                  </Link>
                </li>
                <li>
                  <Link
                    href="/races"
                    className="text-footer-link text-textSubtle hover:text-textDefault transition-colors"
                  >
                    Races
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="flex flex-col gap-6 md:min-w-[160px]">
              <h3 className="text-footer-heading text-textDefault">Company</h3>
              <ul className="flex flex-col gap-5">
                <li>
                  <Link
                    href="/about"
                    className="text-footer-link text-textSubtle hover:text-textDefault transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partner"
                    className="text-footer-link text-textSubtle hover:text-textDefault transition-colors"
                  >
                    Partner with us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/write"
                    className="text-footer-link text-textSubtle hover:text-textDefault transition-colors"
                  >
                    Write for us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-footer-link text-textSubtle hover:text-textDefault transition-colors"
                  >
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Section - Separate Container */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-footer-link text-textDefault">
            <div className="flex flex-wrap items-center gap-x-2">
              <Link
                href="/terms"
                className="inline-flex items-center gap-1 hover:text-textSubtle hover:underline transition-colors"
              >
                Terms of Service
                <ChevronRight className="w-3 h-3" />
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1 hover:text-textSubtle hover:underline transition-colors"
              >
                Privacy Policy
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div>
              <span className="text-textSubtler">
                © {new Date().getFullYear()} Distanz Running Ltd
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
