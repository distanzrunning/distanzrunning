// Optimized social media links component
// Extracted for better code splitting and reusability

type SocialLink = {
  href: string;
  label: string;
  icon: JSX.Element;
}

const socialLinks: SocialLink[] = [
  {
    href: "https://x.com/DistanzRunning",
    label: "X / Twitter",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 512 512">
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
      </svg>
    )
  },
  {
    href: "https://www.linkedin.com/company/distanz-running",
    label: "LinkedIn",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    )
  },
  {
    href: "https://www.instagram.com/distanzrunning/",
    label: "Instagram",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    )
  },
  {
    href: "https://www.strava.com/clubs/distanzrunning",
    label: "Strava",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 384 512">
        <path d="M158.4 0L7 292h89.2l62.2-116.1L220.1 292h88.5zm150.2 292l-43.9 88.2-44.6-88.2h-67.6l112.2 220 111.5-220z"/>
      </svg>
    )
  }
];

export default function SocialLinks() {
  return (
    <>
      <p className="text-base md:text-lg text-textSubtle mb-6">
        Follow us for updates
      </p>

      <div className="flex items-center gap-4 justify-center mb-12">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="group p-2 text-textSubtle hover:text-textDefault transition-colors duration-200"
          >
            {social.icon}
          </a>
        ))}
      </div>

      <p className="text-sm text-textSubtle">
        © 2025 Distanz Running. All rights reserved.
      </p>
    </>
  );
}
