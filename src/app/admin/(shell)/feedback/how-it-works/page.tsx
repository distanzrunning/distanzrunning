export const metadata = {
  title: "How feedback works — Stride Admin",
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

export default function HowFeedbackWorksPage() {
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
            How feedback works
          </h1>
          <p
            style={{
              marginTop: 6,
              marginBottom: 0,
              fontSize: 13,
              color: "var(--ds-gray-700)",
            }}
          >
            Internals of the self-built feedback capture pipeline.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          <DocSection title="UI components">
            Three variants live in{" "}
            <DocCode>@/components/ui/Feedback</DocCode>:{" "}
            <DocCode>Feedback</DocCode> (popover),{" "}
            <DocCode>FeedbackInline</DocCode> (expandable inline pill), and{" "}
            <DocCode>FeedbackWithSelect</DocCode> (popover with a topic
            dropdown). Every variant captures one of four emoji states
            plus a free-form message.
          </DocSection>

          <DocSection title="Submission">
            If no <DocCode>onSubmit</DocCode> prop is passed the components
            call <DocCode>submitFeedback()</DocCode> from{" "}
            <DocCode>@/lib/feedback</DocCode>, which POSTs JSON to{" "}
            <DocCode>/api/feedback</DocCode>. The helper auto-fills{" "}
            <DocCode>anonId</DocCode> (from the shared consent
            localStorage key) and{" "}
            <DocCode>pagePath</DocCode> (current URL).
          </DocSection>

          <DocSection title="Storage">
            Submissions land in Supabase{" "}
            <DocCode>feedback_records</DocCode>. Columns:{" "}
            <DocCode>emotion</DocCode>, <DocCode>feedback</DocCode>,{" "}
            <DocCode>topic</DocCode>, <DocCode>email</DocCode>,{" "}
            <DocCode>anon_id</DocCode>, <DocCode>page_path</DocCode>,{" "}
            <DocCode>user_agent</DocCode>, <DocCode>ip_hash</DocCode>,{" "}
            <DocCode>country</DocCode>, <DocCode>created_at</DocCode>.
            RLS is on; only the service role (server) can write or read.
          </DocSection>

          <DocSection title="Anonymity + optional email">
            All fields are anonymous by default. The form offers an
            optional email input — when supplied we store it so you can
            reply. Email format is validated, but not verified.
          </DocSection>

          <DocSection title="Abuse safeguards">
            Payload size is capped:{" "}
            <DocCode>feedback</DocCode> 4000 chars,{" "}
            <DocCode>topic</DocCode> 100,{" "}
            <DocCode>email</DocCode> 254,{" "}
            <DocCode>pagePath</DocCode> 500,{" "}
            <DocCode>anonId</DocCode> 64.{" "}
            <DocCode>user_agent</DocCode> is clipped to 512 chars.{" "}
            <DocCode>ip_hash</DocCode> is sha256(salt + ip) so no raw IP
            is stored. Rate limiting and spam filtering are{" "}
            <strong>not</strong> implemented yet — add when the form
            goes live on the public site.
          </DocSection>

          <DocSection title="Wiring into a page">
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                margin: 0,
                padding: 12,
                borderRadius: 8,
                background: "var(--ds-gray-100)",
                color: "var(--ds-gray-1000)",
                border: "1px solid var(--ds-gray-alpha-400)",
                overflowX: "auto",
              }}
            >{`import { FeedbackInline } from "@/components/ui/Feedback";

<FeedbackInline />`}</pre>
            No props needed — the component defaults to posting to{" "}
            <DocCode>/api/feedback</DocCode>. Pass{" "}
            <DocCode>onSubmit</DocCode> if you need custom handling.
          </DocSection>
        </div>
      </div>
    </div>
  );
}
