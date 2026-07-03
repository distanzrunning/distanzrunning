"use client";

import { useEffect, useState } from "react";
import {
  NewsletterModal,
  preloadNewsletterHero,
} from "@/components/ui/NewsletterModal";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import type { AnnouncementConfig } from "@/lib/announcement";

// Public, site-wide announcement banner. Content is admin-managed (passed in
// from a cached server read). Closing it hides the bar for DISMISS_DAYS, keyed
// to the config's updatedAt so editing the banner re-shows it. With no link
// target it opens the Shakeout newsletter modal; with one it links out.

const DISMISS_KEY = "distanz-announcement-dismissed";
const DISMISS_DAYS = 7;

export default function AnnouncementBanner({
  config,
}: {
  config: AnnouncementConfig;
}) {
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return;
    const [version, until] = raw.split("|");
    if (version === config.updatedAt && Number(until) > Date.now()) {
      setDismissed(true);
    }
  }, [config.updatedAt]);

  const dismiss = () => {
    setDismissed(true);
    try {
      const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(DISMISS_KEY, `${config.updatedAt}|${until}`);
    } catch {
      // storage may be unavailable (private mode) — dismiss for the session only
    }
  };

  if (dismissed) return null;

  const hasLink = Boolean(config.linkHref);

  return (
    <>
      <AnnouncementBar
        text={config.text}
        serifWordIndices={config.serifWordIndices}
        color={config.color}
        href={config.linkHref ?? undefined}
        onActivate={hasLink ? undefined : () => setModalOpen(true)}
        onActivateHover={hasLink ? undefined : preloadNewsletterHero}
        onClose={dismiss}
      />
      {!hasLink && (
        <NewsletterModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          source="announcement_banner"
        />
      )}
    </>
  );
}
