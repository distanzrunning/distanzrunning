// src/components/LayoutContent.tsx
//
// Server component. Reads the current pathname from the
// x-pathname header (set in middleware.ts) and picks the right
// chrome before the HTML ever leaves the server. Doing this on
// the server (vs. a client component using `usePathname()`,
// which returns null during static rendering) avoids a flash
// between layouts on first paint.
//
// The Masthead (two-tier sticky nav) is the public chrome for every
// page, homepage included — passed in as the `header` prop from
// layout.tsx via MastheadWrapper. It must have exactly ONE mount site
// (here): this layout persists across client-side navigations, so any
// page that also mounted its own header would double-stack it after a
// soft nav (and pathname-dependent chrome branches go stale the same
// way — keep the public chrome identical for every public route).

import { headers } from "next/headers";
import { ReactNode } from "react";
import AnnouncementBanner from "./AnnouncementBanner";
import { getAnnouncement } from "@/lib/announcement";

interface LayoutContentProps {
  children: ReactNode;
  header: ReactNode;
}

export default async function LayoutContent({
  children,
  header,
}: LayoutContentProps) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/";

  const isPreviewMode = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";

  // Suppress site chrome on routes that own their own layout:
  //   /login         — staging gate
  //   /admin/*       — admin SPA (dashboard + design system + studio)
  //   /coming-soon   — pre-launch holding page on the production domain
  const isLoginPage = pathname === "/login";
  const isAdmin = pathname.startsWith("/admin");
  const isComingSoon = pathname === "/coming-soon";

  // Login / admin / coming-soon own their layout — no chrome, no announcement.
  if (isPreviewMode || isLoginPage || isAdmin || isComingSoon) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Site-wide announcement bar (admin-managed) sits above everything on public
  // content pages. Cached read; renders only when enabled with a message.
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
        {header}
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </>
  );
}
