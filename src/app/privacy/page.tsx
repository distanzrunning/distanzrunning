import type { Metadata } from "next";

import { CookiePreferencesButton } from "./CookiePreferencesButton";

export const metadata: Metadata = {
  title: "Privacy Policy — Distanz Running",
  description:
    "How Distanz Running collects, uses, and protects your personal information.",
};

// Stub privacy policy. Sections + headings follow a standard GDPR
// privacy policy structure so the page can be filled in with real
// legal copy without restructuring. Replace each section's body
// before launch; the "Cookies" section's CookiePreferencesButton
// is the load-bearing piece — keep it.

const SECTION_HEADING_CLASS = "text-heading-24";
const SECTION_HEADING_STYLE = { color: "var(--ds-gray-1000)" } as const;
const BODY_CLASS = "text-copy-16";
const BODY_STYLE = { color: "var(--ds-gray-1000)" } as const;
const SUBTLE_STYLE = { color: "var(--ds-gray-900)" } as const;

export default function PrivacyPage() {
  const lastUpdated = "TBD";
  return (
    <article
      style={{
        maxWidth: 720,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 48,
        paddingBottom: 48,
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h1
          className="text-heading-40"
          style={{ margin: 0, color: "var(--ds-gray-1000)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-copy-14" style={SUBTLE_STYLE}>
          Last updated: {lastUpdated}
        </p>
      </header>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 className={SECTION_HEADING_CLASS} style={SECTION_HEADING_STYLE}>
          Introduction
        </h2>
        <p className={BODY_CLASS} style={BODY_STYLE}>
          Placeholder copy. This policy explains how Distanz Running collects,
          uses, and protects information about visitors to distanzrunning.com.
        </p>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 className={SECTION_HEADING_CLASS} style={SECTION_HEADING_STYLE}>
          Information we collect
        </h2>
        <p className={BODY_CLASS} style={BODY_STYLE}>
          Placeholder copy. Replace with the categories of personal data
          actually collected (analytics IDs, IP addresses, email addresses
          for newsletter signup, etc.).
        </p>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 className={SECTION_HEADING_CLASS} style={SECTION_HEADING_STYLE}>
          How we use your information
        </h2>
        <p className={BODY_CLASS} style={BODY_STYLE}>
          Placeholder copy. Replace with the purposes (service operation,
          analytics, newsletter delivery) and the legal bases under GDPR
          Article 6 each one relies on.
        </p>
      </section>

      <section
        id="cookies"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          scrollMarginTop: 64,
        }}
      >
        <h2 className={SECTION_HEADING_CLASS} style={SECTION_HEADING_STYLE}>
          Cookies
        </h2>
        <p className={BODY_CLASS} style={BODY_STYLE}>
          We use cookies to remember your preferences, measure how the site
          is used, and (with your consent) personalise content. You can
          review or change your choices at any time:
        </p>
        <div>
          <CookiePreferencesButton />
        </div>
        <p className="text-copy-14" style={SUBTLE_STYLE}>
          Essential cookies are always enabled — they keep the site working.
          Marketing, Analytics, and Functional cookies only load if you opt
          in.
        </p>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 className={SECTION_HEADING_CLASS} style={SECTION_HEADING_STYLE}>
          Your rights
        </h2>
        <p className={BODY_CLASS} style={BODY_STYLE}>
          Placeholder copy. Under the GDPR you have the right to access,
          rectify, erase, restrict, and port your personal data, and to
          withdraw consent at any time without affecting prior processing.
          Replace with concrete contact details + the data-controller name.
        </p>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 className={SECTION_HEADING_CLASS} style={SECTION_HEADING_STYLE}>
          Contact
        </h2>
        <p className={BODY_CLASS} style={BODY_STYLE}>
          Placeholder copy. For privacy requests, email{" "}
          <a
            href="mailto:info@distanzrunning.com"
            style={{ color: "var(--ds-blue-700)" }}
          >
            info@distanzrunning.com
          </a>
          .
        </p>
      </section>
    </article>
  );
}
