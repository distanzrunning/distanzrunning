"use client";

import { Section } from "../ContentWithTOC";
import { ComponentRef } from "../ComponentRef";
import { InlineCode } from "@/components/ui/InlineCode";

export default function InlineCodeComponent() {
  return (
    <>
      <Section>
        <h2
          id="default"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          Default
        </h2>
        <p
          className="mt-2 leading-6 xl:mt-4"
          style={{ color: "var(--ds-gray-900)" }}
        >
          Use <InlineCode>InlineCode</InlineCode> in body copy for short
          tokens — environment variable names like{" "}
          <InlineCode>VERCEL_ENV</InlineCode>, paths like{" "}
          <InlineCode>src/app/page.tsx</InlineCode>, flag names like{" "}
          <InlineCode>--no-verify</InlineCode>, and short identifiers.
        </p>
        <div className="mt-4 xl:mt-7">
          <div
            className="rounded-lg p-6"
            style={{
              background: "var(--ds-background-100)",
              border: "1px solid var(--ds-gray-400)",
            }}
          >
            <p
              className="text-copy-16"
              style={{ color: "var(--ds-gray-1000)" }}
            >
              Set <InlineCode>NEXT_PUBLIC_API_URL</InlineCode> in{" "}
              <InlineCode>.env.local</InlineCode> before running{" "}
              <InlineCode>pnpm dev</InlineCode>.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <h2
          id="when-to-use"
          className="text-heading-24 text-textDefault scroll-mt-32"
        >
          When to use
        </h2>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Short inline tokens in prose: identifiers, flag names,
            paths, env var names, key combinations.
          </li>
          <li>
            For a runnable shell command with a copy button, use{" "}
            <ComponentRef name="Snippet" />.
          </li>
          <li>
            For multi-line source you want users to read or copy, use{" "}
            <ComponentRef name="Code Block" />.
          </li>
        </ul>
      </Section>
    </>
  );
}
