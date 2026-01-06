export default function ModularScale() {
  // Type scale data based on our actual usage
  const typeScale = [
    { step: -2, px: 11, rem: "0.688", name: "xs", usage: "Overlines, labels" },
    { step: -1, px: 13, rem: "0.813", name: "sm", usage: "Captions, metadata" },
    { step: 0, px: 15, rem: "0.938", name: "base", usage: "Body text default" },
    { step: 1, px: 17, rem: "1.063", name: "lg", usage: "Body text, UI" },
    { step: 2, px: 20, rem: "1.25", name: "xl", usage: "Lead paragraphs" },
    { step: 3, px: 22, rem: "1.375", name: "h3", usage: "Tertiary headings" },
    { step: 4, px: 24, rem: "1.5", name: "2xl", usage: "Subheadings" },
    { step: 5, px: 28, rem: "1.75", name: "h2", usage: "Secondary headings" },
    { step: 6, px: 32, rem: "2", name: "3xl", usage: "Section titles" },
    { step: 7, px: 40, rem: "2.5", name: "h1", usage: "Page titles" },
    { step: 8, px: 48, rem: "3", name: "4xl", usage: "Display headlines" },
    { step: 9, px: 56, rem: "3.5", name: "5xl", usage: "Hero headlines" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Typography
        </p>
        <h1
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
          id="modular-scale"
        >
          Modular scale
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* Type Scale Section */}
      <section>
        <h2
          id="type-scale"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Type scale
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          A harmonious set of type sizes that creates visual rhythm and
          hierarchy. Each step provides clear differentiation while maintaining
          proportional relationships. Base size is 16px (1rem).
        </p>

        {/* Visual type scale specimen */}
        <div className="bg-surfaceSubtle p-6 mb-8">
          {typeScale.map((item) => (
            <div
              key={item.step}
              className="grid grid-cols-[3rem_1fr] items-baseline gap-4 mb-3 last:mb-0"
            >
              <span className="font-sans text-base text-textSubtle">
                {item.step}
              </span>
              <span
                className="font-serif font-normal leading-[1.2]"
                style={{ fontSize: `${item.px}px` }}
              >
                Distanz Running
              </span>
            </div>
          ))}
        </div>

        {/* Reference table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Step
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  px
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  rem
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              {typeScale.map((item) => (
                <tr key={item.step} className="border-b border-borderSubtle">
                  <td className="py-3 pr-4">{item.step}</td>
                  <td className="py-3 px-4">{item.px}</td>
                  <td className="py-3 px-4">{item.rem}</td>
                  <td className="py-3 px-4 font-mono">
                    text-{item.name === "h1" || item.name === "h2" || item.name === "h3" ? `[${item.px}px]` : item.name}
                  </td>
                  <td className="py-3 px-4 text-textSubtle">{item.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Heading Sizes Section */}
      <section>
        <h2
          id="heading-sizes"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Heading sizes
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Standardised heading sizes used throughout the design system. All
          headings use the serif typeface (EB Garamond) with medium weight.
        </p>

        <div className="bg-surfaceSubtle p-6 mb-8 space-y-6">
          <div>
            <p className="font-sans text-sm text-textSubtle mb-1">
              h1 — 40px / font-medium
            </p>
            <h1 className="font-serif text-[40px] leading-[1.15] font-medium">
              Page Title
            </h1>
          </div>
          <hr className="border-t border-borderSubtle" />
          <div>
            <p className="font-sans text-sm text-textSubtle mb-1">
              h2 — 28px / font-medium
            </p>
            <h2 className="font-serif text-[28px] leading-[1.2] font-medium">
              Section Heading
            </h2>
          </div>
          <hr className="border-t border-borderSubtle" />
          <div>
            <p className="font-sans text-sm text-textSubtle mb-1">
              h3 — 22px / font-medium
            </p>
            <h3 className="font-serif text-[22px] leading-[1.3] font-medium">
              Subsection Heading
            </h3>
          </div>
        </div>

        {/* Heading reference table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Element
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Line height
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Weight
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">h1</td>
                <td className="py-3 px-4">40px</td>
                <td className="py-3 px-4">1.15</td>
                <td className="py-3 px-4">500 (medium)</td>
                <td className="py-3 px-4 font-mono">
                  font-serif text-[40px] leading-[1.15] font-medium
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">h2</td>
                <td className="py-3 px-4">28px</td>
                <td className="py-3 px-4">1.2</td>
                <td className="py-3 px-4">500 (medium)</td>
                <td className="py-3 px-4 font-mono">
                  font-serif text-[28px] leading-[1.2] font-medium
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">h3</td>
                <td className="py-3 px-4">22px</td>
                <td className="py-3 px-4">1.3</td>
                <td className="py-3 px-4">500 (medium)</td>
                <td className="py-3 px-4 font-mono">
                  font-serif text-[22px] leading-[1.3] font-medium
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Body Text Section */}
      <section>
        <h2
          id="body-text"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Body text
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Body text sizes for paragraphs, UI elements, and supporting content.
          All body text uses the sans-serif typeface (Inter).
        </p>

        <div className="bg-surfaceSubtle p-6 mb-8 space-y-6">
          <div>
            <p className="font-sans text-sm text-textSubtle mb-1">
              Body — 16px (text-base)
            </p>
            <p className="font-sans text-base leading-[1.5]">
              The primary body text size used for paragraphs and general
              content. Optimized for readability with appropriate line height.
            </p>
          </div>
          <hr className="border-t border-borderSubtle" />
          <div>
            <p className="font-sans text-sm text-textSubtle mb-1">
              Small — 14px (text-sm)
            </p>
            <p className="font-sans text-sm leading-[1.5]">
              Used for captions, metadata, helper text, and secondary
              information that supports the main content.
            </p>
          </div>
          <hr className="border-t border-borderSubtle" />
          <div>
            <p className="font-sans text-sm text-textSubtle mb-1">
              Extra small — 12px (text-xs)
            </p>
            <p className="font-sans text-xs leading-[1.4]">
              Reserved for labels, overlines, and legal text where space is at a
              premium.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
