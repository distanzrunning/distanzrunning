// src/app/(public)/(site)/layout.tsx
//
// Public content chrome — the admin-managed announcement banner above a
// full-height canvas column holding the Masthead and the page. Every
// public content page lives in this group; /login, /coming-soon and
// /admin sit outside it, so no pathname sniffing is needed to suppress
// the chrome there.
//
// The Masthead (two-tier sticky nav) must have exactly ONE mount site
// (here): this layout persists across client-side navigations, so any
// page that also mounted its own header would double-stack it after a
// soft nav.
import { ReactNode } from "react";

import MastheadWrapper from "@/components/MastheadWrapper";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { getAnnouncement } from "@/lib/announcement";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Design-preview deploys render pages bare — no chrome, no banner.
  if (process.env.NEXT_PUBLIC_PREVIEW_MODE === "true") {
    return <main className="min-h-screen">{children}</main>;
  }

  // Site-wide announcement bar (admin-managed) sits above everything on
  // public content pages. Cached, never-throwing read; renders only when
  // enabled with a message.
  const announcement = await getAnnouncement();
  const banner =
    announcement?.enabled && announcement.text.trim() ? (
      <AnnouncementBanner config={announcement} />
    ) : null;

  // Bare canvas below the Masthead — no PageFrame (the old framed page
  // surface was removed in the teardown; pages own their surfaces as they
  // are rebuilt). The wrapper keeps the header + content on one full-height
  // canvas column.
  return (
    <>
      {/* Skip link — the page's FIRST focusable element (before the
          banner's links and the header controls), so one Tab + Enter
          jumps keyboard users past the chrome. Visually hidden until
          focused, then a surface chip pinned over the header. */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:inline-flex focus:items-center focus:rounded-md focus:border focus:border-borderSubtle focus:bg-surface focus:px-4 focus:py-2 focus:text-copy-14 focus:text-textDefault focus:outline-none focus:ring-2 focus:ring-[var(--ds-focus-color)]"
      >
        Skip to content
      </a>
      {banner}
      <div className="flex min-h-screen flex-col bg-canvas">
        <MastheadWrapper />
        {/* tabIndex={-1} so activating the skip link truly moves focus
            here in every browser (Safari won't otherwise); outline-none
            suppresses the focus ring this would paint on click. */}
        <main
          id="content"
          tabIndex={-1}
          className="flex flex-1 flex-col outline-none"
        >
          {children}
        </main>
      </div>
    </>
  );
}
