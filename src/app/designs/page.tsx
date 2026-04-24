// src/app/designs/page.tsx
//
// Picker page for the parallel homepage design mocks. Renders inside
// LayoutContent's SiteHeader chrome (see LayoutContent.tsx). Each card
// is a plain link into the mock. Variant C is reserved for later.

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = {
  id: string;
  title: string;
  href: string;
  description: string;
  available: boolean;
};

const variants: ReadonlyArray<Variant> = [
  {
    id: "A",
    title: "SiteHeader shell (in-progress)",
    href: "/designs/a",
    description:
      "Current direction — SiteHeader on top of the PageFrame canvas, homepage body inside.",
    available: true,
  },
  {
    id: "B",
    title: "Claude Design — full editorial",
    href: "/designs/b",
    description:
      "The Claude Design export — own navbar, breaking ticker, stats band, newsletter card, and footer.",
    available: true,
  },
  {
    id: "C",
    title: "Sidebar layout",
    href: "#",
    description: "Left sidebar nav, no header or footer. Reserved — not yet built.",
    available: false,
  },
];

export default function DesignsIndex() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 md:px-8">
      <div className="mb-10 max-w-2xl">
        <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[color:var(--ds-gray-700)]">
          Homepage exploration
        </div>
        <h1 className="mb-4 font-headline text-[48px] font-medium leading-[1.05] tracking-[-0.02em] text-[color:var(--ds-gray-1000)]">
          Three homepage directions
        </h1>
        <p className="text-[16px] leading-[1.45] text-[color:var(--ds-gray-900)]">
          Pick a variant to preview. Body content is identical across A and B so
          the comparison is about chrome and layout, not copy.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {variants.map((v) => {
          const inner = (
            <div
              className={`group flex h-full flex-col rounded-xl border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] p-6 transition-colors ${
                v.available
                  ? "hover:border-[color:var(--ds-gray-700)]"
                  : "opacity-60"
              }`}
            >
              <div className="mb-4 inline-flex size-8 items-center justify-center rounded-sm bg-[color:var(--ds-gray-1000)] font-mono text-[13px] font-semibold text-[color:var(--ds-background-100)]">
                {v.id}
              </div>
              <h2 className="mb-2 text-[18px] font-[550] leading-[1.3] tracking-[-0.005em] text-[color:var(--ds-gray-1000)]">
                {v.title}
              </h2>
              <p className="mb-6 text-[13px] leading-[1.45] text-[color:var(--ds-gray-900)]">
                {v.description}
              </p>
              <div className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--ds-gray-1000)]">
                {v.available ? (
                  <>
                    Open preview
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </>
                ) : (
                  <span className="text-[color:var(--ds-gray-700)]">Coming soon</span>
                )}
              </div>
            </div>
          );

          return v.available ? (
            <Link key={v.id} href={v.href} className="block">
              {inner}
            </Link>
          ) : (
            <div key={v.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
