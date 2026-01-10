export default function ModularScale() {
  // Type scale data aligned with design-tokens.ts
  // Body text uses fixed sizes; headings use fluid typography (min–max shown)
  const typeScale = [
    {
      step: -2,
      size: "11px",
      rem: "0.688",
      name: "xs",
      usage: "Overlines, labels",
      fluid: false,
    },
    {
      step: -1,
      size: "12px",
      rem: "0.75",
      name: "sm",
      usage: "Captions, metadata",
      fluid: false,
    },
    {
      step: 0,
      size: "16px",
      rem: "1",
      name: "base",
      usage: "Body text default",
      fluid: false,
    },
    {
      step: 1,
      size: "18px",
      rem: "1.125",
      name: "body-lg",
      usage: "Lead paragraphs",
      fluid: false,
    },
    {
      step: 2,
      size: "20px",
      rem: "1.25",
      name: "xl",
      usage: "Feature body text",
      fluid: false,
    },
    {
      step: 3,
      size: "18–24px",
      rem: "1.5",
      name: "h6",
      usage: "Minor headings",
      fluid: true,
    },
    {
      step: 4,
      size: "20–28px",
      rem: "1.75",
      name: "h5",
      usage: "Subheadings",
      fluid: true,
    },
    {
      step: 5,
      size: "24–38px",
      rem: "2.375",
      name: "h4",
      usage: "Tertiary headings",
      fluid: true,
    },
    {
      step: 6,
      size: "28–44px",
      rem: "2.75",
      name: "h3",
      usage: "Subsection headings",
      fluid: true,
    },
    {
      step: 7,
      size: "32–58px",
      rem: "3.625",
      name: "h2",
      usage: "Section headings",
      fluid: true,
    },
    {
      step: 8,
      size: "36–68px",
      rem: "4.25",
      name: "h1",
      usage: "Page titles",
      fluid: true,
    },
    {
      step: 9,
      size: "40–72px",
      rem: "4.5",
      name: "display",
      usage: "Display headlines",
      fluid: true,
    },
    {
      step: 10,
      size: "48–84px",
      rem: "5.25",
      name: "display-large",
      usage: "Hero headlines",
      fluid: true,
    },
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
          hierarchy. Body text uses fixed sizes based on 16px (1rem). Headings
          use fluid typography that scales smoothly between mobile and desktop
          viewports.
        </p>

        {/* Reference table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Step
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Type
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
                  <td className="py-3 px-4">{item.size}</td>
                  <td className="py-3 px-4">
                    {item.fluid ? (
                      <span className="text-electric-pink">Fluid</span>
                    ) : (
                      <span className="text-textSubtle">Fixed</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono">text-{item.name}</td>
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
          headings use the serif typeface (EB Garamond) with medium weight and
          fluid typography that scales between mobile and desktop.
        </p>

        <div className="bg-surfaceSubtle p-6 mb-8 space-y-6">
          <div>
            <p className="font-sans text-sm text-textSubtle mb-1">
              h1 — 36–68px (fluid) / font-medium
            </p>
            <h1 className="font-serif text-h1 font-medium">Page Title</h1>
          </div>
          <hr className="border-t border-borderSubtle" />
          <div>
            <p className="font-sans text-sm text-textSubtle mb-1">
              h2 — 32–58px (fluid) / font-medium
            </p>
            <h2 className="font-serif text-h2 font-medium">Section Heading</h2>
          </div>
          <hr className="border-t border-borderSubtle" />
          <div>
            <p className="font-sans text-sm text-textSubtle mb-1">
              h3 — 28–44px (fluid) / font-medium
            </p>
            <h3 className="font-serif text-h3 font-medium">
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
                  Size (fluid)
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Line height
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">h1</td>
                <td className="py-3 px-4">36–68px</td>
                <td className="py-3 px-4">1.1</td>
                <td className="py-3 px-4 font-mono">
                  font-serif text-h1 font-medium
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">h2</td>
                <td className="py-3 px-4">32–58px</td>
                <td className="py-3 px-4">1.15</td>
                <td className="py-3 px-4 font-mono">
                  font-serif text-h2 font-medium
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">h3</td>
                <td className="py-3 px-4">28–44px</td>
                <td className="py-3 px-4">1.2</td>
                <td className="py-3 px-4 font-mono">
                  font-serif text-h3 font-medium
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">h4</td>
                <td className="py-3 px-4">24–38px</td>
                <td className="py-3 px-4">1.2</td>
                <td className="py-3 px-4 font-mono">
                  font-serif text-h4 font-medium
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">h5</td>
                <td className="py-3 px-4">20–28px</td>
                <td className="py-3 px-4">1.2</td>
                <td className="py-3 px-4 font-mono">
                  font-serif text-h5 font-medium
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">h6</td>
                <td className="py-3 px-4">18–24px</td>
                <td className="py-3 px-4">1.2</td>
                <td className="py-3 px-4 font-mono">
                  font-serif text-h6 font-medium
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
              Body Large — 18px (text-body-lg)
            </p>
            <p className="font-sans text-body-lg leading-[1.6]">
              Used for lead paragraphs and introductions. Provides emphasis
              while maintaining excellent readability.
            </p>
          </div>
          <hr className="border-t border-borderSubtle" />
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
              Body Small — 14px (text-body-sm)
            </p>
            <p className="font-sans text-body-sm leading-[1.5]">
              Used for captions, metadata, helper text, and secondary
              information that supports the main content.
            </p>
          </div>
          <hr className="border-t border-borderSubtle" />
          <div>
            <p className="font-sans text-sm text-textSubtle mb-1">
              Small — 12px (text-sm)
            </p>
            <p className="font-sans text-sm leading-[1.4]">
              Reserved for labels, overlines, and legal text where space is at a
              premium.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
