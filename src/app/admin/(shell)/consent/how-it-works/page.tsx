export const metadata = {
  title: "How our CMP works — Stride Admin",
  robots: { index: false, follow: false },
};

function DocCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        padding: "1px 5px",
        borderRadius: 4,
        background: "var(--ds-gray-100)",
        color: "var(--ds-gray-1000)",
        border: "1px solid var(--ds-gray-alpha-400)",
      }}
    >
      {children}
    </code>
  );
}

function DocSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: 20,
        border: "1px solid var(--ds-gray-400)",
        borderRadius: 12,
        background: "var(--ds-background-100)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: "var(--ds-gray-1000)",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--ds-gray-900)",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <div style={{ padding: "32px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              lineHeight: "32px",
              margin: 0,
              color: "var(--ds-gray-1000)",
            }}
          >
            How our CMP works
          </h1>
          <p
            style={{
              marginTop: 6,
              marginBottom: 0,
              fontSize: 13,
              color: "var(--ds-gray-700)",
            }}
          >
            Internals of Distanz Running&apos;s self-built consent
            management platform.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          <DocSection title="Categories">
            Four consent buckets: <strong>Essential</strong> (always on),{" "}
            <strong>Marketing</strong>, <strong>Analytics</strong>, and{" "}
            <strong>Functional</strong>. The user chooses Accept all,
            Reject all, or a custom mix from the banner or settings modal.
          </DocSection>

          <DocSection title="Storage">
            Preferences persist in <DocCode>localStorage</DocCode> under
            the key <DocCode>distanz-consent</DocCode>, alongside a
            version field that lets us re-prompt if the category list ever
            changes. Each decision is also written to Supabase (
            <DocCode>consent_records</DocCode>) for audit and for the
            Dashboard view.
          </DocSection>

          <DocSection title="Events">
            A <DocCode>distanz-consent-change</DocCode> window event fires
            on every update, so non-React scripts (e.g. anything mounted
            in <DocCode>layout.tsx</DocCode>) can react without
            subscribing to a React context.
          </DocSection>

          <DocSection title="Integrations">
            Today the site only loads <strong>PostHog</strong> — gated on
            the Analytics category. Preparational work is planned: Google
            Consent Mode v2 defaults, <DocCode>window.dataLayer</DocCode>{" "}
            pushes for future Google Tag Manager (client or server-side),
            and category → GCM signal mappings.
          </DocSection>

          <DocSection title="Updating preferences">
            Users can re-open the settings modal at any time via a trigger
            on the Cookie Policy page (planned). Internally any component
            can call <DocCode>openSettings()</DocCode> from the{" "}
            <DocCode>useConsent()</DocCode> hook.
          </DocSection>

          <DocSection title="Future direction">
            If Distanz ever runs heavy advertising or needs IAB TCF 2.2
            compliance, we can swap in a headless third-party CMP (Didomi,
            Usercentrics headless, CookieScript) behind the existing{" "}
            <DocCode>useConsent()</DocCode> API — our banner and modal
            components stay the same.
          </DocSection>
        </div>
      </div>
    </div>
  );
}
