// Static placeholder content for the homepage layout mockups (1a/1b/1c).
// Real Stride components, invented editorial content, no imageUrl (cards fall
// back to the gray-100 placeholder). Swap for Sanity queries once a layout is
// chosen. NOT wired to production.

export interface MockArticle {
  href: string;
  kicker: string;
  title: string;
  excerpt: string;
  publishedAt: string;
}

export interface MockRace {
  href: string;
  title: string;
  eventDate: string;
  location: string;
  category: string;
}

export const FEATURED: MockArticle = {
  href: "#",
  kicker: "Featured · Race Guide",
  title: "Inside the Berlin Marathon's record-breaking course",
  excerpt:
    "How a flat loop through the German capital became the fastest 26.2 miles in the world — and who's lining up to chase the record this autumn.",
  publishedAt: "2026-04-14",
};

export const FEATURED_INTERVIEW: MockArticle = {
  href: "#",
  kicker: "Featured · Interview",
  title: "Eliud Kipchoge on the art of the negative split",
  excerpt:
    "The greatest marathoner of his generation on patience, pace discipline, and why the second half is the only half that matters.",
  publishedAt: "2026-04-13",
};

export const ARTICLES: MockArticle[] = [
  {
    href: "#",
    kicker: "Training",
    title: "The 16-week build that finally got me under three hours",
    excerpt: "A masters runner's methodical return to the marathon.",
    publishedAt: "2026-04-12",
  },
  {
    href: "#",
    kicker: "Gear",
    title: "Every super-shoe of 2026, ranked and road-tested",
    excerpt: "We put the season's carbon plates through 400 miles.",
    publishedAt: "2026-04-11",
  },
  {
    href: "#",
    kicker: "Culture",
    title: "The quiet rise of the midnight running club",
    excerpt: "Why a generation is lacing up after dark.",
    publishedAt: "2026-04-10",
  },
  {
    href: "#",
    kicker: "Results",
    title: "Boston 2026: five takeaways from a brutal Newton headwind",
    excerpt: "The race that rewarded the patient and punished the bold.",
    publishedAt: "2026-04-09",
  },
  {
    href: "#",
    kicker: "Training",
    title: "Zone 2, demystified: a field guide to easy running",
    excerpt: "Slower than you think, and twice as valuable.",
    publishedAt: "2026-04-08",
  },
  {
    href: "#",
    kicker: "Gear",
    title: "The case for a second pair of everyday trainers",
    excerpt: "Rotation isn't vanity — it's durability.",
    publishedAt: "2026-04-07",
  },
];

export const RACES: MockRace[] = [
  {
    href: "#",
    title: "Tokyo Marathon",
    eventDate: "2027-03-07",
    location: "Tokyo, Japan",
    category: "Marathon",
  },
  {
    href: "#",
    title: "London Marathon",
    eventDate: "2027-04-25",
    location: "London, UK",
    category: "Marathon",
  },
  {
    href: "#",
    title: "Great Manchester Run",
    eventDate: "2027-05-16",
    location: "Manchester, UK",
    category: "10K",
  },
];

export const SECTIONS = [
  "Racing",
  "Training",
  "Gear",
  "Culture",
  "Interviews",
  "Results",
];
