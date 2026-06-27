import { PanelCard } from "@/components/ui/PanelCard";

export const metadata = {
  title: "How our CMP works — Stride Admin",
  robots: { index: false, follow: false },
};

function DocCode({ children }: { children: React.ReactNode }) {
  return <code className="inline-code">{children}</code>;
}

function DocSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <PanelCard title={title}>
      <div className="text-copy-14 text-textSubtle">
        {children}
      </div>
    </PanelCard>
  );
}

export default function HowItWorksPage() {
  return (
    <div style={{ padding: "32px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <h1
            className="text-heading-32"
            style={{ margin: 0, color: "hsl(var(--color-textDefault))" }}
          >
            How our CMP works
          </h1>
          <p
            className="text-copy-16"
            style={{ marginTop: 6, marginBottom: 0, color: "hsl(var(--color-textSubtler))" }}
          >
            Internals of Distanz Running&apos;s self-hosted c15t consent
            platform.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          <DocSection title="Architecture">
            Consent runs on <strong>self-hosted c15t v2</strong>. The
            backend (<DocCode>c15tInstance</DocCode> + a Postgres adapter)
            is mounted at <DocCode>/api/c15t</DocCode> and writes to{" "}
            <strong>our own Supabase</strong> — no third-party CMP, no data
            handover. The UI is <strong>headless</strong>: our Stride banner
            and settings dialog drive c15t through its hooks, so the look
            stays on the design system.
          </DocSection>

          <DocSection title="Categories">
            Four consent buckets: <strong>Essential</strong> (always on,{" "}
            <DocCode>necessary</DocCode>), <strong>Marketing</strong>,{" "}
            <strong>Analytics</strong> (<DocCode>measurement</DocCode>), and{" "}
            <strong>Functional</strong> (<DocCode>functionality</DocCode>).
            The user chooses Accept all, Deny, or a custom mix from the
            banner or settings dialog.
          </DocSection>

          <DocSection title="Storage">
            Client preferences + the subject id live in the{" "}
            <DocCode>c15t</DocCode> cookie. The source of truth is an{" "}
            <strong>append-only</strong> audit trail in Supabase:{" "}
            <DocCode>c15t_consent</DocCode> rows (granted purposes, action,
            timestamp, jurisdiction, masked IP) linked to a{" "}
            <DocCode>c15t_subject</DocCode>, with a{" "}
            <DocCode>c15t_auditLog</DocCode>. Tables are{" "}
            <DocCode>c15t_</DocCode>-prefixed and RLS-locked.
          </DocSection>

          <DocSection title="Initialization">
            <DocCode>&lt;C15tPrefetch&gt;</DocCode> in{" "}
            <DocCode>&lt;head&gt;</DocCode> starts the{" "}
            <DocCode>/init</DocCode> call before hydration (static-safe —
            no banner flash, no SSG deopt). The backend resolves the{" "}
            <strong>jurisdiction</strong> (GDPR, UK_GDPR, CCPA, …) and the
            policy from the visitor&apos;s geo headers, so the banner only
            shows where the law requires it.
          </DocSection>

          <DocSection title="Integrations">
            <strong>PostHog</strong> is registered with c15t&apos;s script
            loader and only loads <DocCode>after-consent</DocCode> for the
            Analytics category. <strong>Vercel Analytics</strong> +{" "}
            <strong>Speed Insights</strong> run cookieless and are not
            gated. <strong>Google AdSense</strong> reads Consent Mode v2
            and serves non-personalised ads until consent is granted.
          </DocSection>

          <DocSection title="Google Consent Mode v2">
            <DocCode>gcmDefaultsScript()</DocCode> in{" "}
            <DocCode>&lt;head&gt;</DocCode> primes the seven GCM signals to{" "}
            <DocCode>denied</DocCode> (security_storage stays granted) with{" "}
            <DocCode>wait_for_update</DocCode> before AdSense loads. On a
            decision, <DocCode>ConsentModeSync</DocCode> fires{" "}
            <DocCode>gtag(&apos;consent&apos;,&apos;update&apos;,…)</DocCode>{" "}
            mapped via <DocCode>consentToGcm()</DocCode> in{" "}
            <DocCode>src/lib/c15t/gcm.ts</DocCode>.
          </DocSection>

          <DocSection title="Category → GCM signal map">
            <strong>Marketing</strong> →{" "}
            <DocCode>ad_storage</DocCode>,{" "}
            <DocCode>ad_user_data</DocCode>,{" "}
            <DocCode>ad_personalization</DocCode>.{" "}
            <strong>Analytics</strong> →{" "}
            <DocCode>analytics_storage</DocCode>.{" "}
            <strong>Functional</strong> →{" "}
            <DocCode>functionality_storage</DocCode>,{" "}
            <DocCode>personalization_storage</DocCode>.{" "}
            <strong>Essential</strong> always grants{" "}
            <DocCode>security_storage</DocCode>.
          </DocSection>

          <DocSection title="Updating preferences">
            The footer <strong>Cookies</strong> link and the Privacy page
            re-open the settings dialog. Internally any component calls{" "}
            <DocCode>openSettings()</DocCode> from{" "}
            <DocCode>useConsentSettings()</DocCode>, which maps to c15t&apos;s{" "}
            <DocCode>setActiveUI(&apos;dialog&apos;)</DocCode>.
          </DocSection>

          <DocSection title="Data requests (DSAR)">
            Every visitor gets a <DocCode>sub_…</DocCode> subject id,
            copyable from the settings dialog. For an access or erasure
            request, look the id up in the{" "}
            <a href="/admin/consent" className="text-textDefault underline hover:opacity-80">
              Consent dashboard
            </a>{" "}
            — it shows the full history with CSV export (Article 15) and a
            delete that erases the subject across{" "}
            <DocCode>c15t_consent</DocCode>, <DocCode>c15t_auditLog</DocCode>,
            and <DocCode>c15t_subject</DocCode> (Article 17).
          </DocSection>
        </div>
      </div>
    </div>
  );
}
