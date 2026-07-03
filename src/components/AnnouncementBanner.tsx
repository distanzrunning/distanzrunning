"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  NewsletterModal,
  preloadNewsletterHero,
} from "@/components/ui/NewsletterModal";

// Full-width announcement bar above the masthead, in the 404 Media mould:
// a promo line that opens the Shakeout newsletter modal, with a dismiss button.
// Sits on the page canvas (blends with the masthead); the hover affordance is
// scoped to the "Shakeout" word (underline). Closing it hides the banner for
// DISMISS_DAYS (an expiry timestamp in localStorage), after which it resurfaces.

const DISMISS_KEY = "distanz-announcement-dismissed";
// How long the banner stays hidden after the user closes it.
const DISMISS_DAYS = 7;
// Signature of the current banner content. Dismissal is stored against it, so
// changing/updating the banner re-shows it even to users who dismissed the old
// one. Bump on content change. (Once the banner is CMS-managed this becomes the
// document's revision id.)
const BANNER_VERSION = "shakeout-signup-v1";

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return;
    const [version, until] = raw.split("|");
    if (version === BANNER_VERSION && Number(until) > Date.now()) {
      setDismissed(true);
    }
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(DISMISS_KEY, `${BANNER_VERSION}|${until}`);
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
        className="relative w-full border-b border-borderSubtle bg-canvas"
      >
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          onMouseEnter={preloadNewsletterHero}
          onFocus={preloadNewsletterHero}
          className="block w-full px-12 py-2.5 text-center text-copy-14 text-textSubtle"
        >
          Subscribe to the{" "}
          <span className="font-serif text-[18px] italic text-textDefault underline-offset-[3px] hover:underline">
            Shakeout
          </span>{" "}
          newsletter
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[6px] text-textSubtle transition-colors hover:bg-[var(--ds-gray-100)] hover:text-textDefault"
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
