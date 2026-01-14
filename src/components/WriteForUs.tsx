// src/components/WriteForUs.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function WriteForUs() {
  // Set to true when using actual ad network integration
  const isActualAd = false;

  return (
    <section className="w-full overflow-x-clip py-8 md:py-12">
      {/* Ad Container - Standard Display Ad Placement */}
      <div className="flex flex-col items-center">
        {/* Display Ad Label - Only show for actual ads */}
        {isActualAd && (
          <div className="text-[10px] uppercase tracking-wider text-textSubtler mb-2">
            Advertisement
          </div>
        )}

        {/* Ad Slot - Responsive Container */}
        {/* Desktop: 970x250 (Billboard) or 728x90 (Leaderboard) */}
        {/* Mobile: 300x300 (Square) */}
        <div className="w-full max-w-[970px] mx-auto">
          {/* Placeholder: "Write for Us" message */}
          <div className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-surfaceSubtle border border-borderSubtle">
            {/* Mobile: 300x300 Square */}
            <div className="block md:hidden w-full max-w-[300px] mx-auto">
              <div className="flex aspect-square items-center justify-center p-6">
                <div className="flex flex-col gap-3 items-center text-center">
                  <h4 className="font-body text-lg sm:text-xl font-semibold text-textDefault">
                    Want to create running content?
                  </h4>
                  <Link
                    href="/write"
                    className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-asphalt-10 dark:bg-asphalt-90 text-textInverted hover:bg-asphalt-20 dark:hover:bg-asphalt-80 transition-colors duration-200 font-semibold text-sm"
                  >
                    <span>Write for us</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop: 970x250 (Billboard) or 728x90 (Leaderboard) */}
            <div className="hidden md:block w-full">
              <div className="flex min-h-[90px] lg:min-h-[250px] items-center justify-center p-8">
                <div className="flex flex-col gap-4 items-center text-center">
                  <h4 className="font-body text-xl lg:text-2xl font-semibold text-textDefault">
                    Want to create running content?
                  </h4>
                  <p className="text-sm lg:text-base text-textSubtle">
                    We want to hear from you.
                  </p>
                  <Link
                    href="/write"
                    className="inline-flex items-center gap-2 px-5 h-11 rounded-lg bg-asphalt-10 dark:bg-asphalt-90 text-textInverted hover:bg-asphalt-20 dark:hover:bg-asphalt-80 transition-colors duration-200 font-semibold text-sm"
                  >
                    <span>Get in touch</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
