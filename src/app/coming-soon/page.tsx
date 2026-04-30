// Holding page served on the production domain (distanzrunning.com)
// while the rebuilt site lives behind the login gate at the staging
// preview URL. Middleware rewrites every prod-host request to this
// route, so any URL on the public domain lands here until launch.

import type { Metadata } from "next";
import Logo from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Distanz Running — coming soon",
  description:
    "A new home for running stories, gear reviews, and race guides. Coming soon.",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-[var(--ds-background-100)] px-6 py-16 text-[color:var(--ds-gray-1000)] dark:bg-[var(--ds-background-200)]">
      <Logo className="h-16 w-auto sm:h-20" />
      <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-electric-pink">
          Coming soon
        </span>
        <h1 className="text-balance font-serif text-heading-32 md:text-heading-40 lg:text-heading-48">
          A new home for running stories, gear reviews, and race guides.
        </h1>
      </div>
    </div>
  );
}
