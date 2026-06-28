import {
  DocCode,
  DocCodeBlock,
  DocPage,
  DocSection,
  DocTable,
} from "@/components/admin/Doc";

export const metadata = {
  title: "How feedback works — Stride Admin",
  robots: { index: false, follow: false },
};

const TOC = [
  { id: "components", label: "UI components" },
  { id: "submission", label: "Submission" },
  { id: "storage", label: "Storage" },
  { id: "privacy", label: "Anonymity & email" },
  { id: "safeguards", label: "Abuse safeguards" },
  { id: "wiring", label: "Wiring into a page" },
];

export default function HowFeedbackWorksPage() {
  return (
    <DocPage
      toc={TOC}
      lede={
        <>
          A lightweight, self-hosted feedback capture pipeline: a few drop-in UI
          components post to an API route that writes anonymised submissions to
          Supabase. This page documents how it works end to end.
        </>
      }
    >
      <DocSection id="components" title="UI components">
        <p>
          Three variants live in <DocCode>@/components/ui/Feedback</DocCode>:{" "}
          <DocCode>Feedback</DocCode> (popover), <DocCode>FeedbackInline</DocCode>{" "}
          (expandable inline pill), and <DocCode>FeedbackWithSelect</DocCode>{" "}
          (popover with a topic dropdown). Every variant captures one of four
          emoji states plus a free-form message.
        </p>
      </DocSection>

      <DocSection id="submission" title="Submission">
        <p>
          With no <DocCode>onSubmit</DocCode> prop, the components call{" "}
          <DocCode>submitFeedback()</DocCode> from <DocCode>@/lib/feedback</DocCode>
          , which POSTs JSON to <DocCode>/api/feedback</DocCode>. The helper
          auto-fills <DocCode>pagePath</DocCode> (current URL) and{" "}
          <DocCode>anonId</DocCode> — read from the <DocCode>c15t</DocCode> consent
          cookie&apos;s subject id (<DocCode>sub_…</DocCode>), so feedback links to
          the same subject as the visitor&apos;s consent record. If they
          haven&apos;t interacted with consent yet, <DocCode>anonId</DocCode> is
          simply omitted.
        </p>
      </DocSection>

      <DocSection id="storage" title="Storage">
        <p>
          Submissions land in Supabase <DocCode>feedback_records</DocCode>. RLS is
          on; only the service role (server) can write or read.
        </p>
        <DocTable
          columns={["Column", "Holds"]}
          rows={[
            [<DocCode key="c">emotion</DocCode>, "One of four emoji states."],
            [<DocCode key="c">feedback</DocCode>, "Free-form message."],
            [<DocCode key="c">topic</DocCode>, "Optional topic selection."],
            [<DocCode key="c">email</DocCode>, "Optional follow-up address."],
            [
              <DocCode key="c">anon_id</DocCode>,
              "c15t subject id, when available.",
            ],
            [<DocCode key="c">page_path</DocCode>, "Where it was submitted."],
            [
              <>
                <DocCode>user_agent</DocCode>, <DocCode>ip_hash</DocCode>,{" "}
                <DocCode>country</DocCode>
              </>,
              "Request metadata (IP is salted-hashed, never stored raw).",
            ],
            [<DocCode key="c">created_at</DocCode>, "Timestamp."],
          ]}
        />
      </DocSection>

      <DocSection id="privacy" title="Anonymity & optional email">
        <p>
          All fields are anonymous by default. The form offers an optional email
          input — when supplied we store it so you can reply. Email format is
          validated, but not verified.
        </p>
      </DocSection>

      <DocSection id="safeguards" title="Abuse safeguards">
        <p>
          Payload sizes are capped: <DocCode>feedback</DocCode> 4000 chars,{" "}
          <DocCode>topic</DocCode> 100, <DocCode>email</DocCode> 254,{" "}
          <DocCode>pagePath</DocCode> 500, <DocCode>anonId</DocCode> 64;{" "}
          <DocCode>user_agent</DocCode> is clipped to 512.{" "}
          <DocCode>ip_hash</DocCode> is <DocCode>sha256(salt + ip)</DocCode> so no
          raw IP is stored. Rate limiting and spam filtering are{" "}
          <strong>not</strong> implemented yet — add them when the form goes live
          on the public site.
        </p>
      </DocSection>

      <DocSection id="wiring" title="Wiring into a page">
        <p>
          No props needed — the component defaults to posting to{" "}
          <DocCode>/api/feedback</DocCode>. Pass <DocCode>onSubmit</DocCode> if you
          need custom handling.
        </p>
        <DocCodeBlock>{`import { FeedbackInline } from "@/components/ui/Feedback";

<FeedbackInline />`}</DocCodeBlock>
      </DocSection>
    </DocPage>
  );
}
