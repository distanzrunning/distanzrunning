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
      {banner}
      <div className="flex min-h-screen flex-col bg-canvas">
        <MastheadWrapper />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </>
  );
}
