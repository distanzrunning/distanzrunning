"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Section } from "../ContentWithTOC";

const FAQ_ITEMS = [
  {
    value: "what-is",
    question: "What's the Stride Accordion built on?",
    answer:
      "It wraps Base UI's Accordion primitive, the same one shadcn ships from. Base UI handles focus management, keyboard navigation, and ARIA wiring; we apply Distanz tokens for the visual treatment.",
  },
  {
    value: "single-or-multi",
    question: "Can multiple panels stay open at once?",
    answer:
      "Yes. Pass multiple to the root Accordion to allow any number of panels to expand independently. Defaults to single-panel mode otherwise.",
  },
  {
    value: "styling",
    question: "How do I theme it for a specific section?",
    answer:
      "Override className on any sub-component — Accordion, AccordionItem, AccordionTrigger, or AccordionContent — and the cn() helper merges your classes with the defaults.",
  },
];

export default function AccordionComponent() {
  return (
    <>
      <Section>
        <div id="overview" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            Default
          </h2>
          <p
            className="text-copy-16"
            style={{
              color: "var(--ds-gray-900)",
              marginBottom: 24,
            }}
          >
            Single-panel disclosure list. Click a row to expand,
            click it again to collapse.
          </p>
          <div
            style={{
              border: "1px solid var(--ds-gray-400)",
              borderRadius: 6,
              padding: "0 16px",
              maxWidth: 640,
            }}
          >
            <Accordion>
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Section>

      <Section>
        <div id="multi" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            Multiple panels open
          </h2>
          <p
            className="text-copy-16"
            style={{
              color: "var(--ds-gray-900)",
              marginBottom: 24,
            }}
          >
            Pass{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              multiple
            </code>{" "}
            to allow any number of panels to expand at once.
          </p>
          <div
            style={{
              border: "1px solid var(--ds-gray-400)",
              borderRadius: 6,
              padding: "0 16px",
              maxWidth: 640,
            }}
          >
            <Accordion multiple>
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Section>

      <Section>
        <div id="built-on" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            Built on shadcn + Base UI
          </h2>
          <p
            className="text-copy-16"
            style={{
              color: "var(--ds-gray-900)",
              marginBottom: 16,
            }}
          >
            This component is the canonical example of the
            shadcn-derived workflow:
          </p>
          <ol
            className="text-copy-14"
            style={{
              color: "var(--ds-gray-900)",
              paddingLeft: 20,
              margin: 0,
            }}
          >
            <li style={{ marginBottom: 6 }}>
              <code
                className="text-label-13-mono"
                style={{
                  background: "var(--ds-gray-100)",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                npx shadcn add accordion
              </code>{" "}
              landed the Base UI primitive in{" "}
              <code
                className="text-label-13-mono"
                style={{
                  background: "var(--ds-gray-100)",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                src/components/ui
              </code>
              .
            </li>
            <li style={{ marginBottom: 6 }}>
              Renamed to PascalCase, swapped shadcn&apos;s default
              semantic classes for Distanz tokens, simplified the
              Tailwind v4 utilities to Tailwind v3 + DS slots.
            </li>
            <li>
              Published as a registry item so anyone (or any AI
              tool with MCP) can install the branded version via{" "}
              <code
                className="text-label-13-mono"
                style={{
                  background: "var(--ds-gray-100)",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                npx shadcn add @distanz/accordion
              </code>
              .
            </li>
          </ol>
        </div>
      </Section>
    </>
  );
}
