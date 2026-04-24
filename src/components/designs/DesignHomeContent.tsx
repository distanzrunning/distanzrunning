// src/components/designs/DesignHomeContent.tsx
//
// Shared homepage body for the /designs/a and /designs/b variants.
// Ports the content blocks from the Claude Design UI kit
// (ui_kits/website/index.html): featured hero, card grid, dark stats
// band, newsletter card. Variant A drops this inside SiteHeader +
// PageFrame; variant B wraps it with its own navbar/ticker/footer.
//
// Images here are CSS-gradient placeholders matching the mock.
// Real Sanity content can swap in later.

import { ArrowRight } from "lucide-react";

type Card = {
  tag: string;
  title: string;
  date: string;
  imageClass: string;
};

const cards: ReadonlyArray<Card> = [
  {
    tag: "GEAR",
    title: "Nike Alphafly 3, 300 miles later.",
    date: "2026-04-08",
    imageClass: "bg-gradient-to-br from-[#8b2c2c] via-[#c74242] to-[#e6c8a1]",
  },
  {
    tag: "ROAD",
    title: "How Boston's masters women rewrote the record book.",
    date: "2026-04-15",
    imageClass: "bg-gradient-to-br from-[#2a3b4c] via-[#4a6a8c] to-[#aeb6c0]",
  },
  {
    tag: "TRAINING",
    title: "A week inside the Iten training camps.",
    date: "2026-04-03",
    imageClass: "bg-gradient-to-br from-[#1a3d2a] via-[#3d6d4a] to-[#cfd8a2]",
  },
  {
    tag: "SHOES",
    title: "The quiet return of the racing flat.",
    date: "2026-03-28",
    imageClass: "bg-gradient-to-br from-[#4a2a5c] via-[#7a3e8c] to-[#e0a8c8]",
  },
  {
    tag: "WATCHES",
    title: "Your watch is lying about your lactate threshold.",
    date: "2026-03-24",
    imageClass: "bg-gradient-to-br from-[#3a3a3a] via-[#6a6a6a] to-[#b8b8b8]",
  },
  {
    tag: "RACES",
    title: "Sydney Marathon's platinum label, explained.",
    date: "2026-03-19",
    imageClass: "bg-gradient-to-br from-[#2a4a6a] via-[#4a7ab0] to-[#a8c8e0]",
  },
  {
    tag: "NUTRITION",
    title: "Carb science has moved on. Most runners haven't.",
    date: "2026-03-14",
    imageClass: "bg-gradient-to-br from-[#a85a2a] via-[#d88a52] to-[#f2c8a2]",
  },
  {
    tag: "TRACK",
    title: "Track is back, and the shoes are confusing.",
    date: "2026-03-10",
    imageClass: "bg-gradient-to-br from-[#1c1c1c] via-[#3a3a3a] to-[#888]",
  },
];

export default function DesignHomeContent() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8">
      {/* ---------- Featured hero ---------- */}
      <section
        className="grid gap-10 border-b border-[color:var(--ds-gray-400)] pb-10 md:grid-cols-[1.4fr_1fr]"
      >
        <div
          className="relative aspect-[16/10] overflow-hidden rounded-lg"
          style={{
            background:
              "linear-gradient(135deg, #1c2a3a 0%, #334d6e 50%, #c89a5a 100%)",
          }}
        >
          <span
            className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-[4px] bg-white/95 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#171717]"
          >
            Race Guide · Berlin 2026
          </span>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.35))",
            }}
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-2.5 h-[4px] w-12 bg-[#E43C81]" aria-hidden />
          <div className="mb-2.5 flex items-center gap-2 text-[10px] font-medium tracking-[0.02em] text-[color:var(--ds-gray-900)]">
            <span className="rounded-[2px] bg-[color:var(--ds-gray-200)] px-1.5 py-0.5 text-[color:var(--ds-gray-1000)]">
              ROAD
            </span>
            <span>2026-04-21 · 9 min read</span>
          </div>
          <h1 className="mb-4 text-balance font-headline text-[52px] font-medium leading-[1.03] tracking-[-0.02em] text-[color:var(--ds-gray-1000)]">
            Berlin is still the fastest marathon in the world — and 2026 could
            be its loudest year yet.
          </h1>
          <p className="mb-6 max-w-[44ch] font-headline text-[18px] leading-[1.45] text-[color:var(--ds-gray-1000)]">
            Three sub-2:02 contenders, a new elite women&apos;s start wave, and
            a course that hasn&apos;t changed for a reason. Here&apos;s what to
            watch on the last Sunday in September.
          </p>
          <div className="flex items-center gap-2.5 text-[13px] text-[color:var(--ds-gray-900)]">
            <div
              className="size-7 rounded-full"
              style={{
                background: "linear-gradient(135deg, #E43C81, #0070F3)",
              }}
              aria-hidden
            />
            <div>
              <span className="font-medium text-[color:var(--ds-gray-1000)]">
                Rosa Delacroix
              </span>{" "}
              · Senior Editor
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Section head ---------- */}
      <div className="mt-10 flex items-end justify-between border-b border-[color:var(--ds-gray-400)] pb-4">
        <h2 className="font-headline text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--ds-gray-1000)]">
          Latest stories
        </h2>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-[color:var(--ds-gray-1000)] transition-colors hover:text-[color:var(--ds-gray-900)]"
        >
          Browse all
          <ArrowRight className="size-3.5" aria-hidden />
        </a>
      </div>

      {/* ---------- Card grid ---------- */}
      <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="group flex cursor-pointer flex-col"
          >
            <div
              className={`aspect-[16/9] overflow-hidden rounded-lg transition-transform duration-200 ease-out group-hover:-translate-y-0.5 ${card.imageClass}`}
            />
            <h3 className="mt-4 mb-3 text-balance text-[21px] font-[550] leading-[1.2] tracking-[-0.005em] text-[color:var(--ds-gray-1000)]">
              {card.title}
            </h3>
            <div className="mt-auto flex items-center gap-2.5 text-[10px] font-medium text-[color:var(--ds-gray-900)]">
              <span className="rounded-[2px] bg-[color:var(--ds-gray-200)] px-1.5 py-0.5 text-[color:var(--ds-gray-900)]">
                {card.tag}
              </span>
              <span className="font-mono">{card.date}</span>
            </div>
          </article>
        ))}
      </div>

      {/* ---------- Dark stats band ---------- */}
      <div className="-mx-6 mt-12 bg-[#0A0A0A] px-6 py-12 text-[#EDEDED] md:-mx-8 md:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <h3 className="font-headline text-[34px] font-medium leading-[1.1] tracking-[-0.02em]">
            <span className="mb-2.5 block font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#878787]">
              Race Profile · Sep 27 2026
            </span>
            Berlin Marathon
          </h3>
          <StatCell label="Distance" value="42.195" unit="km" />
          <StatCell label="Elevation" value="+211" unit="m" />
          <StatCell label="Start field" value="47,912" />
          <StatCell label="Course record" value="2:01:09" />
        </div>
      </div>

      {/* ---------- Newsletter ---------- */}
      <div
        className="mt-12 grid items-center gap-12 rounded-2xl border border-[color:var(--ds-gray-400)] p-12 md:grid-cols-2"
        style={{
          background:
            "linear-gradient(180deg, var(--ds-background-100), var(--ds-background-200))",
        }}
      >
        <div>
          <h3 className="mb-2 font-headline text-[38px] font-normal leading-[1.1] tracking-[-0.04em] text-[color:var(--ds-gray-1000)]">
            Subscribe to <i>Shakeout</i>
          </h3>
          <p className="max-w-[44ch] text-[15px] font-medium leading-[1.4] text-[color:var(--ds-gray-1000)]">
            A curated set of running stories, gear reviews, and race guides
            every other week.
          </p>
        </div>
        <div>
          <form
            className="flex gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email"
              className="h-12 flex-1 rounded-md border border-[color:var(--ds-gray-400)] bg-[color:var(--ds-background-100)] px-3.5 text-[14px] text-[color:var(--ds-gray-1000)] outline-none focus:border-[color:var(--ds-gray-1000)]"
            />
            <button
              type="submit"
              className="h-12 rounded-md bg-[color:var(--ds-gray-1000)] px-[22px] text-[14px] font-medium text-[color:var(--ds-background-100)] transition-colors hover:bg-[color:var(--ds-gray-900)]"
            >
              Subscribe
            </button>
          </form>
          <div className="mt-2.5 text-[12px] leading-[1.5] text-[color:var(--ds-gray-700)]">
            This site is protected by reCAPTCHA and the Google Privacy Policy
            and Terms of Service apply.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[#878787]">
        {label}
      </div>
      <div className="font-mono text-[28px] font-medium leading-none text-[#EDEDED]">
        {value}
        {unit && (
          <small className="ml-1 text-[13px] font-normal text-[#878787]">
            {unit}
          </small>
        )}
      </div>
    </div>
  );
}
