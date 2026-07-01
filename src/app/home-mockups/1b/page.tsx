import MockHeader from "../_mock/MockHeader";
import { MockFooter, SectionLabel, HeavyRule, Kicker } from "../_mock/pieces";
import { FEATURED_INTERVIEW, ARTICLES, RACES } from "../_mock/data";
import ArticleCard from "@/components/ArticleCard";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Homepage 1b — Distanz",
  robots: { index: false, follow: false },
};

export default function Homepage1b() {
  return (
    <main className="bg-canvas">
      <MockHeader />

      {/* Split hero */}
      <div className="mx-auto max-w-6xl px-6">
        <section className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[1.55fr_1fr]">
          {/* Lead */}
          <article>
            <div className="aspect-[16/9] w-full rounded-md bg-[color:var(--ds-gray-100)]" />
            <div className="mt-4 flex flex-col gap-2">
              <Kicker>{FEATURED_INTERVIEW.kicker}</Kicker>
              <a href={FEATURED_INTERVIEW.href} className="no-underline">
                <h2 className="text-heading-32 text-balance text-textDefault">
                  {FEATURED_INTERVIEW.title}
                </h2>
              </a>
              <p className="text-copy-16 text-textSubtle">
                {FEATURED_INTERVIEW.excerpt}
              </p>
            </div>
          </article>

          {/* Secondary stack */}
          <div className="flex flex-col">
            {ARTICLES.slice(0, 3).map((article, i) => (
              <div key={article.title}>
                {i > 0 && (
                  <hr className="border-t border-borderSubtle" />
                )}
                <a
                  href={article.href}
                  className="flex gap-3 py-3 no-underline first:pt-0"
                >
                  <div className="h-16 w-24 flex-none rounded-md bg-[color:var(--ds-gray-100)]" />
                  <div className="flex flex-col gap-1">
                    <Kicker>{article.kicker}</Kicker>
                    <span className="text-copy-14 line-clamp-2 font-medium text-textDefault">
                      {article.title}
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <HeavyRule />
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6">
        <section className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[1fr_280px]">
          {/* Latest */}
          <div>
            <SectionLabel title="Latest" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {ARTICLES.slice(0, 4).map((article) => (
                <ArticleCard
                  key={article.title}
                  href={article.href}
                  title={article.title}
                  publishedAt={article.publishedAt}
                  kicker={article.kicker}
                  excerpt={article.excerpt}
                />
              ))}
            </div>
          </div>

          {/* Races sidebar */}
          <aside>
            <div className="rounded-xl border border-borderDefault bg-surface p-5">
              <h2 className="text-heading-16 text-textDefault">
                Upcoming races
              </h2>
              <div className="mt-2">
                {RACES.map((race) => (
                  <a
                    key={race.title}
                    href={race.href}
                    className="flex items-center gap-3 border-t border-borderSubtle py-3 no-underline first:border-t-0"
                  >
                    <div className="h-9 w-12 flex-none rounded bg-[color:var(--ds-gray-200)]" />
                    <div className="flex flex-col">
                      <span className="text-copy-14 font-medium text-textDefault">
                        {race.title}
                      </span>
                      <span className="text-copy-13 text-textSubtle">
                        {race.location}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
              <Button
                variant="secondary"
                size="small"
                className="mt-3 w-full"
              >
                Full calendar
              </Button>
            </div>
          </aside>
        </section>
      </div>

      {/* Newsletter — full width */}
      <NewsletterSignup theme="black" />

      <MockFooter />
    </main>
  );
}
