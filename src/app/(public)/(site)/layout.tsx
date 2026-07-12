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
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
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
          jumps keyboard users past the chrome. Revealed on
          focus-VISIBLE only: the App Router programmatically focuses
          the page's first focusable element after a soft navigation,
          which matches :focus but not :focus-visible — plain focus:
          variants made the chip flash on every mouse click-through. */}
      <a
        href="#content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:inline-flex focus-visible:items-center focus-visible:rounded-md focus-visible:border focus-visible:border-borderSubtle focus-visible:bg-surface focus-visible:px-4 focus-visible:py-2 focus-visible:text-copy-14 focus-visible:text-textDefault focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)]"
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
        {/* Pre-footer newsletter band — full-bleed with hairline
            edges, flush against the footer: this section carries the
            TOP border only; the footer's own border-t is the band's
            bottom edge (a border-b here would double it). */}
        <section
          aria-label="Newsletter signup"
          className="border-t border-borderSubtle"
        >
          <div className="mx-auto w-full max-w-content px-6 py-12 lg:py-16">
            <NewsletterSignup chrome="band" source="pre_footer" />
          </div>
        </section>
        {/* Footer bookends the canvas column — main's flex-1 pins it
            to the viewport bottom on short pages. */}
        <Footer />
      </div>
    </>
  );
}
