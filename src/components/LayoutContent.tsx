// src/components/LayoutContent.tsx
//
// Server component. Reads the current pathname from the
// x-pathname header (set in middleware.ts) and picks the right
// chrome before the HTML ever leaves the server. Doing this on
// the server (vs. a client component using `usePathname()`,
// which returns null during static rendering) avoids a flash
// between layouts on first paint.
//
// SiteHeader is now the only public chrome. Previously the app
// also rendered a legacy NavbarAlt for routes that hadn't been
// migrated to the new DS — that branch is gone, every public
// page renders SiteHeader unconditionally.

import { headers } from "next/headers";
import { ReactNode } from "react";
import PageFrame from "./ui/PageFrame";
import AnnouncementBanner from "./AnnouncementBanner";
import { getAnnouncement } from "@/lib/announcement";

interface LayoutContentProps {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}

export default async function LayoutContent({
  children,
  header,
  footer,
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
  // The homepage is being rebuilt from scratch and owns its own header, so it
  // renders bare (no production SiteHeader/Footer) like the app-shell routes.
  const isHome = pathname === "/";

  // Hide footer on the calendar page (fullscreen app-like view)
  const isCalendarPage = pathname === "/races/calendar";

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

  // The homepage owns its own header (Masthead) — render bare, banner on top.
  if (isHome) {
    return (
      <>
        {banner}
        <main className="min-h-screen">{children}</main>
      </>
    );
  }

  // Chrome background (the canvas around PageFrame):
  // Page canvas sits on bg-200 (recessed) in both modes — matches the
  // admin shell pattern; elevated chrome (SiteHeader pill, future
  // cards/panels) pops above it on bg-100.
  const chromeClass = "flex min-h-screen flex-col bg-canvas";

  return (
    <>
      {banner}
      <div className={chromeClass}>
        {header}
        <PageFrame as="main" className="flex flex-1 flex-col">
          {children}
        </PageFrame>
        {!isCalendarPage && footer}
      </div>
    </>
  );
}
