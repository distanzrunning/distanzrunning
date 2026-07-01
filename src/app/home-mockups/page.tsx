import Link from "next/link";

export const metadata = {
  title: "Homepage mockups — Distanz",
  robots: { index: false, follow: false },
};

const OPTIONS = [
  {
    id: "1a",
    name: "Big cinematic hero",
    desc: "One full-width lead story, centered. Latest 3-col grid, upcoming-races list, dark newsletter band.",
  },
  {
    id: "1b",
    name: "Split hero + sidebar",
    desc: "Lead story left + secondary stack right. 2-col Latest grid with a races sidebar card. Horizontal newsletter.",
  },
  {
    id: "1c",
    name: "Minimal / big-type",
    desc: "Full-bleed hero with an overlaid serif headline. Single-column feed, race-calendar strip, minimal newsletter.",
  },
];

export default function HomeMockupsIndex() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-heading-32 text-textDefault">Homepage mockups</h1>
      <p className="text-copy-16 mt-2 text-textSubtle">
        Three layout directions from the wireframes, built with real Stride
        components and placeholder content. Open each, then pick one to take to
        polish.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        {OPTIONS.map((o) => (
          <Link
            key={o.id}
            href={`/home-mockups/${o.id}`}
            className="group flex flex-col gap-1 rounded-xl border border-borderDefault bg-surface p-5 no-underline transition-colors hover:bg-[var(--ds-gray-100)]"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-heading-16 text-textDefault">{o.name}</span>
              <span className="text-copy-13 font-mono text-textSubtler">
                {o.id}
              </span>
            </div>
            <span className="text-copy-14 text-textSubtle">{o.desc}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
