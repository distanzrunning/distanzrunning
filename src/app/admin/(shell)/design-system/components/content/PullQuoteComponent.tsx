"use client";

import { useState } from "react";
import PullQuote from "@/components/ui/PullQuote";

// VS Code Dark-style syntax highlighting for JSX
function highlightCode(code: string) {
  const parts = code.split(/(<\/?[A-Z][a-zA-Z]*|>|[a-z]+(?==))/g);

  return parts.map((part, i) => {
    if (/^<\/?[A-Z]/.test(part)) {
      return (
        <span key={i} className="text-[#569CD6]">
          {part}
        </span>
      );
    }
    if (part === ">") {
      return (
        <span key={i} className="text-[#569CD6]">
          {part}
        </span>
      );
    }
    if (/^[a-z]+$/.test(part) && parts[i + 1] !== ">") {
      return (
        <span key={i} className="text-[#9CDCFE]">
          {part}
        </span>
      );
    }
    if (part && !part.startsWith("<") && part !== ">") {
      return (
        <span key={i} className="text-[#CE9178]">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface VariantShowcaseProps {
  title: string;
  id: string;
  initialText: string;
}

function VariantShowcase({ title, id, initialText }: VariantShowcaseProps) {
  const [text, setText] = useState(initialText);

  // Extract text from code when user edits
  const handleCodeChange = (newCode: string) => {
    const match = newCode.match(/>([^<]*)</);
    if (match) {
      setText(match[1]);
    }
  };

  const codeValue = `<PullQuote>${text}</PullQuote>`;

  return (
    <div className="mb-8">
      <h3
        id={id}
        className="text-heading-20 mb-3 scroll-mt-32"
      >
        {title}
      </h3>

      {/* Preview area */}
      <div className="rounded-t-lg border border-b-0 border-borderSubtle overflow-hidden">
        <div className="p-8 bg-white dark:bg-gray-1000">
          <PullQuote>{text}</PullQuote>
        </div>
      </div>

      {/* Editable code box */}
      <div className="relative rounded-b-lg border border-borderSubtle bg-surfaceSubtle dark:bg-neutral-900 overflow-hidden focus-within:border-borderDefault focus-within:ring-1 focus-within:ring-borderNeutral transition-all">
        <div className="absolute inset-0 p-4 pointer-events-none">
          <pre className="text-sm font-mono whitespace-pre-wrap break-words">
            <code>{highlightCode(codeValue)}</code>
          </pre>
        </div>
        <textarea
          value={codeValue}
          onChange={(e) => handleCodeChange(e.target.value)}
          spellCheck={false}
          className="w-full p-4 text-sm font-mono bg-transparent text-transparent caret-textDefault resize-none focus:outline-none whitespace-pre-wrap break-words"
          rows={3}
        />
      </div>
    </div>
  );
}

export default function PullQuoteComponent() {
  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <p className="text-copy-14 tracking-wide text-textSubtle mb-2">Content</p>
        <h1
          id="pull-quote"
          className="text-heading-40 mb-0"
        >
          Pull-quote
        </h1>
      </div>

      <p className="text-copy-16 text-textSubtle max-w-3xl">
        A brief, attention-grabbing quotation taken from the main text.
      </p>

      <hr className="border-t-4 border-textDefault" />

      {/* Variants Section */}
      <section>
        <h2
          id="variants"
          className="sr-only text-heading-24 mb-2 scroll-mt-32"
        >
          Variants
        </h2>

        {/* Default */}
        <VariantShowcase
          title="Default"
          id="variants-default"
          initialText="Never in the history of journalism has so much been read for so long by so few"
        />
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Anatomy Section */}
      <section>
        <h2
          id="anatomy"
          className="text-heading-24 mb-2 scroll-mt-32"
        >
          Anatomy
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 text-heading-14">
                  Property
                </th>
                <th className="text-left py-3 px-4 text-heading-14">
                  Value
                </th>
                <th className="text-left py-3 px-4 text-heading-14">
                  Token
                </th>
              </tr>
            </thead>
            <tbody className="text-copy-14">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Border width (top/bottom)</td>
                <td className="py-3 px-4">4px</td>
                <td className="py-3 px-4 font-mono">border-t-4 border-b-4</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Vertical margin</td>
                <td className="py-3 px-4">40px</td>
                <td className="py-3 px-4 font-mono">my-10</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Vertical padding</td>
                <td className="py-3 px-4">24px</td>
                <td className="py-3 px-4 font-mono">py-6</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Horizontal padding</td>
                <td className="py-3 px-4">16px / 32px</td>
                <td className="py-3 px-4 font-mono">px-4 md:px-8</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Text alignment</td>
                <td className="py-3 px-4">Center</td>
                <td className="py-3 px-4 font-mono">text-center</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Font family</td>
                <td className="py-3 px-4">EB Garamond</td>
                <td className="py-3 px-4 font-mono">font-serif</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Font size (mobile)</td>
                <td className="py-3 px-4">24px</td>
                <td className="py-3 px-4 font-mono">text-[24px]</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Font size (desktop)</td>
                <td className="py-3 px-4">28px</td>
                <td className="py-3 px-4 font-mono">md:text-[28px]</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Line height (mobile)</td>
                <td className="py-3 px-4">32px</td>
                <td className="py-3 px-4 font-mono">leading-[32px]</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Line height (desktop)</td>
                <td className="py-3 px-4">38px</td>
                <td className="py-3 px-4 font-mono">md:leading-[38px]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Colour Reference Section */}
      <section>
        <h2
          id="colours"
          className="text-heading-24 mb-2 scroll-mt-32"
        >
          Colour reference
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 text-heading-14">
                  Element
                </th>
                <th className="text-left py-3 px-4 text-heading-14">
                  Light mode
                </th>
                <th className="text-left py-3 px-4 text-heading-14">
                  Dark mode
                </th>
              </tr>
            </thead>
            <tbody className="text-copy-14">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Border</td>
                <td className="py-3 px-4 font-mono">textDefault</td>
                <td className="py-3 px-4 font-mono">textDefault</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Text</td>
                <td className="py-3 px-4 font-mono">textDefault</td>
                <td className="py-3 px-4 font-mono">textDefault</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Guidelines Section */}
      <section>
        <h2
          id="guidelines"
          className="text-heading-24 mb-2 scroll-mt-32"
        >
          Guidelines
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <h3
          id="guidelines-blockquote-vs-pullquote"
          className="text-heading-20 mb-3 scroll-mt-32"
        >
          Blockquote vs Pull-quote
        </h3>

        <div className="space-y-4 text-copy-16 text-textSubtle max-w-3xl">
          <p>
            <strong>Blockquote:</strong> Used to quote text from an external
            source. Features a left border accent and is typically used inline
            with body text.
          </p>
          <p>
            <strong>Pull-quote:</strong> Highlights a key statement from within
            the same article. Larger, centered, with top and bottom borders to
            create visual separation and draw reader attention.
          </p>
        </div>
      </section>
    </div>
  );
}
