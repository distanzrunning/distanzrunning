import {
  DocCode,
  DocPage,
  DocSection,
  DocTable,
} from "@/components/admin/Doc";

export const metadata = {
  title: "How our CMP works — Stride Admin",
  robots: { index: false, follow: false },
};

const TOC = [
  { id: "architecture", label: "Architecture" },
  { id: "categories", label: "Consent categories" },
  { id: "storage", label: "Storage & audit" },
  { id: "initialization", label: "Initialization" },
  { id: "integrations", label: "Integrations" },
  { id: "gcm", label: "Google Consent Mode" },
  { id: "preferences", label: "Updating preferences" },
  { id: "dsar", label: "Data requests" },
];

export default function HowItWorksPage() {
  return (
    <DocPage
      category="Consent"
      title="How our CMP works"
      toc={TOC}
      lede={
        <>
          Distanz runs a <strong>self-hosted c15t v2</strong> consent platform.
          The banner, storage, audit trail, and tracker gating all live on our
          own infrastructure — no third-party CMP and no data handover. This page
          documents how the pieces fit together.
        </>
      }
    >
      <DocSection id="architecture" title="Architecture">
        <p>
          The consent backend (<DocCode>c15tInstance</DocCode> + a Postgres
          adapter) is mounted at <DocCode>/api/c15t</DocCode> and persists to{" "}
          <strong>our own Supabase</strong>. The UI is <strong>headless</strong>:
          our Stride banner and settings dialog are rendered from the design
          system and driven by c15t&apos;s hooks (
          <DocCode>useHeadlessConsentUI</DocCode>,{" "}
          <DocCode>useConsentManager</DocCode>), so consent looks like the rest of
          the product while c15t handles policy, jurisdiction, and storage.
        </p>
      </DocSection>

      <DocSection id="categories" title="Consent categories">
        <p>
          Four buckets. <strong>Essential</strong> is always on; the visitor
          chooses Accept all, Deny, or a custom mix from the banner or settings
          dialog.
        </p>
        <DocTable
          columns={["Label", "c15t code", "Covers"]}
          rows={[
            [
              <strong key="e">Essential</strong>,
              <DocCode key="c">necessary</DocCode>,
              "Security and core site function. Cannot be disabled.",
            ],
            [
              <strong key="m">Marketing</strong>,
              <DocCode key="c">marketing</DocCode>,
              "Advertising and personalised promotions.",
            ],
            [
              <strong key="a">Analytics</strong>,
              <DocCode key="c">measurement</DocCode>,
              "Usage statistics and performance (PostHog).",
            ],
            [
              <strong key="f">Functional</strong>,
              <DocCode key="c">functionality</DocCode>,
              "Enhanced features and preferences.",
            ],
          ]}
        />
      </DocSection>

      <DocSection id="storage" title="Storage & audit">
        <p>
          The visitor&apos;s preferences and subject id live in the{" "}
          <DocCode>c15t</DocCode> cookie. The source of truth is an{" "}
          <strong>append-only</strong> audit trail in Supabase — every decision
          inserts a new row, never mutating the last. Tables are{" "}
          <DocCode>c15t_</DocCode>-prefixed and RLS-locked (only the server role
          reads/writes); IP addresses are masked at write time.
        </p>
        <DocTable
          columns={["Table", "Holds"]}
          rows={[
            [
              <DocCode key="t">c15t_subject</DocCode>,
              "One per browser (sub_… id), anonymous unless identified.",
            ],
            [
              <DocCode key="t">c15t_consent</DocCode>,
              "Each decision: granted purposes, action, timestamp, jurisdiction, masked IP, UI source.",
            ],
            [
              <DocCode key="t">c15t_consentPurpose</DocCode>,
              "The category codes a consent row references.",
            ],
            [
              <DocCode key="t">c15t_auditLog</DocCode>,
              "Immutable record of consent-related actions.",
            ],
          ]}
        />
      </DocSection>

      <DocSection id="initialization" title="Initialization & jurisdiction">
        <p>
          <DocCode>&lt;C15tPrefetch&gt;</DocCode> in the document head starts the{" "}
          <DocCode>/init</DocCode> request before hydration. It&apos;s
          static-safe (an inline script, not <DocCode>next/headers</DocCode>), so
          it doesn&apos;t deopt our prerendered pages, and the provider consumes
          the prefetched result — no banner flash and no lazy client waterfall.
        </p>
        <p>
          <DocCode>/init</DocCode> resolves the visitor&apos;s{" "}
          <strong>jurisdiction</strong> (GDPR, UK_GDPR, CCPA, …) and the matching
          policy from their geo headers, so the banner only appears where the law
          requires opt-in — that&apos;s why a US visitor may not see it while a
          UK one does.
        </p>
      </DocSection>

      <DocSection id="integrations" title="Integrations">
        <p>
          <strong>PostHog</strong> is registered with c15t&apos;s script loader
          and only loads <DocCode>after-consent</DocCode> for the Analytics
          category — it makes no network request until then. Internal-traffic
          exclusion (our own IP, localhost) lives in PostHog&apos;s project
          settings, not app code.
        </p>
        <p>
          <strong>Vercel Analytics</strong> and <strong>Speed Insights</strong>{" "}
          run cookieless and are not gated. <strong>Google AdSense</strong> reads
          Consent Mode v2 (below) and serves non-personalised ads until consent
          is granted.
        </p>
      </DocSection>

      <DocSection id="gcm" title="Google Consent Mode v2">
        <p>
          <DocCode>gcmDefaultsScript()</DocCode> in the head primes the seven GCM
          signals to <DocCode>denied</DocCode> (security stays granted) with{" "}
          <DocCode>wait_for_update</DocCode> before AdSense loads. On a decision,{" "}
          <DocCode>ConsentModeSync</DocCode> fires{" "}
          <DocCode>gtag(&apos;consent&apos;,&apos;update&apos;,…)</DocCode> mapped
          via <DocCode>consentToGcm()</DocCode> in{" "}
          <DocCode>src/lib/c15t/gcm.ts</DocCode>.
        </p>
        <DocTable
          columns={["Category", "Google signals"]}
          rows={[
            [
              <strong key="m">Marketing</strong>,
              <>
                <DocCode>ad_storage</DocCode>, <DocCode>ad_user_data</DocCode>,{" "}
                <DocCode>ad_personalization</DocCode>
              </>,
            ],
            [
              <strong key="a">Analytics</strong>,
              <DocCode key="s">analytics_storage</DocCode>,
            ],
            [
              <strong key="f">Functional</strong>,
              <>
                <DocCode>functionality_storage</DocCode>,{" "}
                <DocCode>personalization_storage</DocCode>
              </>,
            ],
            [
              <strong key="e">Essential</strong>,
              <DocCode key="s">security_storage</DocCode>,
            ],
          ]}
        />
      </DocSection>

      <DocSection id="preferences" title="Updating preferences">
        <p>
          The footer <strong>Cookies</strong> link and the Privacy page re-open
          the settings dialog. Internally any component calls{" "}
          <DocCode>openSettings()</DocCode> from{" "}
          <DocCode>useConsentSettings()</DocCode>, which maps to c15t&apos;s{" "}
          <DocCode>setActiveUI(&apos;dialog&apos;)</DocCode>.
        </p>
      </DocSection>

      <DocSection id="dsar" title="Data requests (DSAR)">
        <p>
          Every visitor gets a <DocCode>sub_…</DocCode> subject id, copyable from
          the settings dialog once they&apos;ve decided. For an access or erasure
          request, look the id up in the{" "}
          <a href="/admin/consent">Consent dashboard</a> — it shows the full
          history with CSV export (GDPR Article 15) and a delete that erases the
          subject across <DocCode>c15t_consent</DocCode>,{" "}
          <DocCode>c15t_auditLog</DocCode>, and <DocCode>c15t_subject</DocCode>{" "}
          (Article 17).
        </p>
      </DocSection>
    </DocPage>
  );
}
