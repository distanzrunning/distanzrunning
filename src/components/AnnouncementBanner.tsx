"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  NewsletterModal,
  preloadNewsletterHero,
} from "@/components/ui/NewsletterModal";

// Full-width announcement bar above the masthead, in the 404 Media mould:
// a promo line that opens the Shakeout newsletter modal, with a dismiss button.
// Theme-aware inverse (ink background / surface text) so it stands out in both
// light and dark, rather than a fixed-dark bar that would blend into dark mode.
// Dismissal persists in localStorage so it doesn't nag on every visit.

const DISMISS_KEY = "distanz-shakeout-banner-dismissed";

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // storage may be unavailable (private mode) — dismiss for the session only
    }
  };

  if (dismissed) return null;

  return (
    <>
      <div
        role="region"
        aria-label="Announcement"
        className="relative w-full bg-[hsl(var(--color-textDefault))] text-[hsl(var(--color-surface))]"
      >
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          onMouseEnter={preloadNewsletterHero}
          onFocus={preloadNewsletterHero}
          className="block w-full px-12 py-2.5 text-center text-copy-14 transition-opacity hover:opacity-80"
        >
          Subscribe to the{" "}
          <span className="font-serif text-[15px] italic">Shakeout</span>{" "}
          newsletter
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[6px] opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <NewsletterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        source="announcement_banner"
      />
    </>
  );
}
