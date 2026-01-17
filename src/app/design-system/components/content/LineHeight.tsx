export default function LineHeight() {
  // Computed values based on our type scale
  const computedValues = [
    { size: 11, name: "xs", multiplier: 1.4, lineHeight: 15 },
    { size: 13, name: "sm", multiplier: 1.4, lineHeight: 18 },
    { size: 15, name: "base", multiplier: 1.5, lineHeight: 23 },
    { size: 16, name: "base", multiplier: 1.5, lineHeight: 24 },
    { size: 17, name: "lg", multiplier: 1.4, lineHeight: 24 },
    { size: 20, name: "xl", multiplier: 1.4, lineHeight: 28 },
    { size: 22, name: "h3", multiplier: 1.3, lineHeight: 29 },
    { size: 24, name: "2xl", multiplier: 1.25, lineHeight: 30 },
    { size: 28, name: "h2", multiplier: 1.2, lineHeight: 34 },
    { size: 32, name: "3xl", multiplier: 1.2, lineHeight: 38 },
    { size: 40, name: "h1", multiplier: 1.15, lineHeight: 46 },
    { size: 48, name: "4xl", multiplier: 1.1, lineHeight: 53 },
    { size: 56, name: "5xl", multiplier: 1.1, lineHeight: 62 },
  ];

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Typography
        </p>
        <h1
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
          id="line-height"
        >
          Line-height
        </h1>
      </div>

      <hr className="border-t-4 border-gray-1000" />

      {/* Multipliers Section */}
      <section>
        <h2
          id="multipliers"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Multipliers
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <p className="text-base text-gray-900 mb-6">
          Line-height (leading) multipliers provide vertical rhythm across all
          font sizes, ensuring text and headings are readable and legible.
          Larger text uses tighter line heights while smaller text uses looser
          spacing for improved readability.
        </p>

        {/* Primary multipliers table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Multiplier
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">1.5</td>
                <td className="py-3 px-4">
                  Body text, paragraphs (optimal for reading)
                </td>
                <td className="py-3 px-4 font-mono">leading-normal</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">1.4</td>
                <td className="py-3 px-4">Small to medium text (≤20px)</td>
                <td className="py-3 px-4 font-mono">leading-relaxed</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">1.3</td>
                <td className="py-3 px-4">Subheadings, UI text</td>
                <td className="py-3 px-4 font-mono">leading-snug</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">1.2</td>
                <td className="py-3 px-4">Large headings (≥28px)</td>
                <td className="py-3 px-4 font-mono">leading-tight</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">1.15</td>
                <td className="py-3 px-4">Display headlines (≥40px)</td>
                <td className="py-3 px-4 font-mono">leading-[1.15]</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4">1.1</td>
                <td className="py-3 px-4">Hero text, very large display</td>
                <td className="py-3 px-4 font-mono">leading-none</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual comparison */}
        <h3
          id="visual-comparison"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Visual comparison
        </h3>

        <div className="[background:var(--ds-gray-100)] p-6 mb-8 space-y-6">
          <div>
            <p className="font-sans text-sm text-gray-900 mb-2">
              Line-height: 1.5 (body text)
            </p>
            <p className="font-sans text-base leading-[1.5]">
              Running is more than a sport—it&apos;s a way of life. Every step
              forward is a testament to dedication, discipline, and the pursuit
              of personal excellence. The road stretches endlessly ahead.
            </p>
          </div>
          <hr className="border-t border-gray-300" />
          <div>
            <p className="font-sans text-sm text-gray-900 mb-2">
              Line-height: 1.3 (compact)
            </p>
            <p className="font-sans text-base leading-[1.3]">
              Running is more than a sport—it&apos;s a way of life. Every step
              forward is a testament to dedication, discipline, and the pursuit
              of personal excellence. The road stretches endlessly ahead.
            </p>
          </div>
          <hr className="border-t border-gray-300" />
          <div>
            <p className="font-sans text-sm text-gray-900 mb-2">
              Line-height: 1.15 (headline)
            </p>
            <p className="font-serif text-[32px] leading-[1.15] font-medium">
              The Ultimate Guide to Marathon Training and Race Day Strategy
            </p>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-400" />

      {/* Computed Values Section */}
      <section>
        <h2
          id="computed-values"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Computed values
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <p className="text-base text-gray-900 mb-6">
          Use whole pixel values when designing with static assets. The
          line-height values below are the result of multiplying font size by
          the appropriate multiplier.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Font size (px)
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Multiplier
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Line-height (px)
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind leading
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              {computedValues.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="py-3 pr-4">{item.size}</td>
                  <td className="py-3 px-4 font-mono">
                    text-
                    {item.name === "h1" ||
                    item.name === "h2" ||
                    item.name === "h3"
                      ? `[${item.size}px]`
                      : item.name}
                  </td>
                  <td className="py-3 px-4">{item.multiplier}</td>
                  <td className="py-3 px-4">{item.lineHeight}</td>
                  <td className="py-3 px-4 font-mono">
                    leading-[{item.multiplier}]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t border-gray-400" />

      {/* Reference Section */}
      <section>
        <h2
          id="reference"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Reference
        </h2>

        <hr className="border-t border-gray-400 mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Tailwind class
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4 font-mono">leading-none</td>
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4 text-gray-900">Single line, icons</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4 font-mono">leading-tight</td>
                <td className="py-3 px-4">1.25</td>
                <td className="py-3 px-4 text-gray-900">Large headings</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4 font-mono">leading-snug</td>
                <td className="py-3 px-4">1.375</td>
                <td className="py-3 px-4 text-gray-900">
                  Subheadings, compact text
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4 font-mono">leading-normal</td>
                <td className="py-3 px-4">1.5</td>
                <td className="py-3 px-4 text-gray-900">
                  Body text, paragraphs
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4 font-mono">leading-relaxed</td>
                <td className="py-3 px-4">1.625</td>
                <td className="py-3 px-4 text-gray-900">Long-form content</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-3 pr-4 font-mono">leading-loose</td>
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4 text-gray-900">
                  Wide spacing, editorial
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
