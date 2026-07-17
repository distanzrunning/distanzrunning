// src/lib/social-links.ts
//
// Single source of truth for the brand's social profiles — rendered by
// the Footer's Social column and the mobile menu's "Follow us" group.

export type SocialLink = {
  label: string;
  href: string;
};

export const socialLinks: ReadonlyArray<SocialLink> = [
  { label: "Instagram", href: "https://instagram.com/distanzrunning" },
  { label: "X (Twitter)", href: "https://x.com/distanzrunning" },
  { label: "Strava", href: "https://strava.com/clubs/distanzrunning" },
  { label: "LinkedIn", href: "https://linkedin.com/company/distanzrunning" },
];
