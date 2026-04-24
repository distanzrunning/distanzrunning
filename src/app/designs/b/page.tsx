// src/app/designs/b/page.tsx
//
// Variant B — the Claude Design homepage port. Renders bare (see
// LayoutContent's isDesignVariantBare branch) so it can own its full
// page chrome: sticky navbar, breaking ticker, hero + grid + stats +
// newsletter (shared DesignHomeContent), and a full editorial footer.

import Link from "next/link";
import DesignHomeContent from "@/components/designs/DesignHomeContent";
import { SiInstagram, SiX, SiStrava, SiLinkedin } from "react-icons/si";

const navLinks = [
  { label: "Gear", href: "#", hasMenu: true },
  { label: "Races", href: "#", hasMenu: true },
  { label: "Training", href: "#", hasMenu: false },
  { label: "News", href: "#", hasMenu: false },
  { label: "Guides", href: "#", hasMenu: false },
];

const tickerItems = [
  { label: "BERLIN", body: "Kipchoge confirmed for 2026 autumn campaign" },
  { label: "BOSTON", body: "Course records fall in masters women's field" },
  { label: "GEAR", body: "Alphafly 3 long-term review · 300 miles in" },
];

const footerCols: ReadonlyArray<{ heading: string; items: string[] }> = [
  { heading: "Category", items: ["Road", "Track", "Trail", "Training", "Gear"] },
  { heading: "Company", items: ["About", "Contact", "Careers", "Press"] },
  { heading: "Legal", items: ["Privacy", "Terms", "Cookies"] },
];

export default function DesignVariantB() {
  return (
    <div className="min-h-screen bg-[color:var(--ds-background-100)] text-[color:var(--ds-gray-1000)]">
      {/* ---------- Navbar ---------- */}
      <div className="sticky top-0 z-50 border-b border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-8">
          <Link href="/designs" className="inline-flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-full-black.svg"
              alt="Distanz Running"
              className="block h-8 w-auto dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-full-white.svg"
              alt=""
              className="hidden h-8 w-auto dark:block"
            />
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--ds-gray-1000)] transition-colors hover:text-[color:var(--ds-gray-900)]"
              >
                {l.label}
                {l.hasMenu && (
                  <span
                    aria-hidden
                    className="inline-block size-1.5 -translate-y-0.5 rotate-45 border-b border-r border-current"
                  />
                )}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="inline-flex h-8 items-center rounded-md bg-[color:var(--ds-gray-1000)] px-3.5 text-[13px] font-medium text-[color:var(--ds-background-100)] transition-colors hover:bg-[color:var(--ds-gray-900)]"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* ---------- Breaking ticker ---------- */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 border-b border-[color:var(--ds-gray-400)] px-6 py-3 md:px-8">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[4px] bg-[#EE0000] px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.08em] text-white">
          <span className="size-1.5 animate-pulse rounded-full bg-white" aria-hidden />
          BREAKING
        </span>
        <div className="flex gap-7 overflow-hidden text-[13px] text-[color:var(--ds-gray-1000)]">
          {tickerItems.map((item) => (
            <span key={item.label} className="whitespace-nowrap">
              <strong className="mr-1.5 font-mono text-[11px] font-medium text-[color:var(--ds-gray-900)]">
                {item.label}
              </strong>
              {item.body}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Shared content ---------- */}
      <DesignHomeContent />

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] px-6 pb-10 pt-14 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-20">
          <div className="flex max-w-[320px] flex-col gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-full-black.svg"
              alt="Distanz Running"
              className="block h-9 w-auto dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-full-white.svg"
              alt=""
              className="hidden h-9 w-auto dark:block"
            />
            <p className="text-[14px] leading-[1.5] text-[color:var(--ds-gray-900)]">
              A hub for quality in-depth running stories, gear reviews, and
              race guides.
            </p>
            <div className="flex gap-3.5">
              {[
                { Icon: SiInstagram, label: "Instagram" },
                { Icon: SiX, label: "X" },
                { Icon: SiStrava, label: "Strava" },
                { Icon: SiLinkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-[color:var(--ds-gray-900)] transition-all hover:scale-110 hover:text-[color:var(--ds-gray-1000)]"
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>
          <div className="ml-auto grid gap-12 md:grid-cols-3">
            {footerCols.map((col) => (
              <div key={col.heading}>
                <h4 className="mb-4 text-[13px] font-[550] text-[color:var(--ds-gray-1000)]">
                  {col.heading}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[13px] text-[color:var(--ds-gray-900)] transition-colors hover:text-[color:var(--ds-gray-1000)]"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between border-t border-[color:var(--ds-gray-400)] pt-6 font-mono text-[11px] text-[color:var(--ds-gray-700)]">
          <span>© 2026 Distanz Running</span>
          <span>Made for runners. Dublin · Melbourne.</span>
        </div>
      </footer>
    </div>
  );
}
