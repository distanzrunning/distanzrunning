import { format } from "date-fns";

import MockHeader from "../_mock/MockHeader";
import { MockFooter, SectionLabel, HeavyRule, Kicker } from "../_mock/pieces";
import { FEATURED, ARTICLES, RACES } from "../_mock/data";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

export const metadata = {
  title: "Homepage 1c — Distanz",
  robots: { index: false, follow: false },
};

// Option 1c — "Minimal / big-type, editorial". Leans hardest into the
// black-and-white editorial brand: the EB Garamond serif appears ONLY on the
// hero headline and the newsletter pull-line (the two Stride editorial slots).
export default function HomeMockup1c() {
  return (
    <main className="bg-canvas">
      <MockHeader />
      <HeavyRule />

      {/* Full-bleed hero with overlaid serif type */}
      <section className="relative h-[420px] w-full overflow-hidden bg-[color:var(--ds-gray-200)]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute bottom-0 left-0 z-10 flex max-w-[720px] flex-col gap-3 p-8 md:p-12">
          <span className="text-heading-14 uppercase tracking-[0.06em] text-white/70">
            {FEATURED.kicker}
          </span>
          <h1 className="text-heading-40 font-serif text-balance text-white">
            {FEATURED.title}
          </h1>
          <p className="text-copy-16 max-w-[52ch] text-white/80">
            {FEATURED.excerpt}
          </p>
        </div>
      </section>

      {/* The feed — single column */}
      <div className="mx-auto max-w-[680px] px-6 py-10">
        <SectionLabel title="The feed" />
        {ARTICLES.map((a) => (
          <a
            key={a.title}
            href={a.href}
            className="grid grid-cols-[1fr_150px] gap-5 border-t border-borderSubtle py-5 no-underline"
          >
            <div className="flex flex-col gap-2">
              <span className="text-heading-14 uppercase tracking-[0.06em] text-textSubtle">
                {a.kicker} · {format(new Date(a.publishedAt), "d MMM")}
              </span>
              <h2 className="text-heading-20 text-balance text-textDefault">
                {a.title}
              </h2>
              <p className="text-copy-14 text-textSubtle">{a.excerpt}</p>
            </div>
            <div className="h-[92px] w-full rounded-md bg-[color:var(--ds-gray-100)]" />
          </a>
        ))}
      </div>

      {/* Race calendar strip — recessed band */}
      <section className="border-y border-borderSubtle bg-surface">
        <div className="mx-auto max-w-[680px] px-6 py-8">
          <h2 className="text-heading-16 mb-4 text-textDefault">
            Race calendar
          </h2>
          <div className="flex flex-wrap gap-4">
            {RACES.map((r) => (
              <a
                key={r.title}
                href={r.href}
                className="flex min-w-[150px] flex-1 flex-col gap-2 rounded-xl border border-borderDefault bg-surface p-4 no-underline"
              >
                <Kicker>{r.category}</Kicker>
                <span className="text-copy-14 font-medium text-textDefault">
                  {r.title}
                </span>
                <span className="text-copy-13 text-textSubtle">
                  {r.location}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter — minimal, centered */}
      <div className="mx-auto flex max-w-[680px] flex-col items-center gap-4 px-6 py-12 text-center">
        <p className="text-heading-32 font-serif text-balance text-textDefault">
          Run farther with us.
        </p>
        <NewsletterSignup theme="white" />
      </div>

      <HeavyRule />
      <MockFooter />
    </main>
  );
}
