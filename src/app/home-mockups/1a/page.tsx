import MockHeader from "../_mock/MockHeader";
import { MockFooter, SectionLabel, HeavyRule } from "../_mock/pieces";
import { FEATURED, ARTICLES, RACES } from "../_mock/data";
import ArticleCard from "@/components/ArticleCard";
import RaceCard from "@/components/RaceCard";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

export const metadata = {
  title: "Homepage 1a — Distanz",
  robots: { index: false, follow: false },
};

// Option 1a — "Big cinematic hero". One full-width lead story (centered),
// a 3-col Latest grid, an upcoming-races row, and a dark newsletter band.
// Built with real Stride components + placeholder content. NOT wired to prod.
export default function HomeMockup1a() {
  return (
    <main className="bg-canvas">
      <MockHeader />

      {/* HERO — big cinematic image + centered story stack */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="aspect-[16/7] w-full rounded-md bg-[color:var(--ds-gray-100)]" />
        <div className="mx-auto mt-6 max-w-[640px] text-center">
          <span className="text-heading-14 uppercase tracking-[0.06em] text-textSubtle">
            {FEATURED.kicker}
          </span>
          <h1 className="text-heading-40 mt-3 text-balance text-textDefault">
            {FEATURED.title}
          </h1>
          <p className="text-copy-16 mt-3 text-textSubtle">{FEATURED.excerpt}</p>
          <a
            href={FEATURED.href}
            className="text-copy-16 mt-4 inline-block text-link underline underline-offset-2"
          >
            Read the story →
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <HeavyRule />
      </div>

      {/* LATEST — 3-col grid */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <SectionLabel
          title="Latest"
          action={
            <a
              href="#"
              className="text-copy-13 text-textSubtle no-underline hover:text-textDefault"
            >
              View all
            </a>
          }
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ARTICLES.slice(0, 3).map((a) => (
            <ArticleCard
              key={a.title}
              href={a.href}
              title={a.title}
              publishedAt={a.publishedAt}
              kicker={a.kicker}
              excerpt={a.excerpt}
            />
          ))}
        </div>
      </div>

      {/* UPCOMING RACES */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <SectionLabel title="Upcoming races" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {RACES.map((r) => (
            <RaceCard
              key={r.title}
              href={r.href}
              title={r.title}
              eventDate={r.eventDate}
              location={r.location}
              category={r.category}
              variant="default"
            />
          ))}
        </div>
      </div>

      {/* NEWSLETTER — full-width dark band */}
      <div className="py-12">
        <NewsletterSignup theme="black" />
      </div>

      <MockFooter />
    </main>
  );
}
