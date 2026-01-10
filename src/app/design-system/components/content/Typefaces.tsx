export default function Typefaces() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Typography
        </p>
        <h1
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
          id="typefaces"
        >
          Typefaces
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* EB Garamond Section */}
      <section>
        <h2
          id="eb-garamond"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          EB Garamond
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        {/* EB Garamond Regular */}
        <h3
          id="eb-garamond-regular"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          EB Garamond
        </h3>
        <p className="text-base text-textSubtle mb-4">
          Primarily for headlines, display text, and editorial emphasis. A
          classic serif with elegant proportions inspired by the work of Claude
          Garamond.
        </p>

        {/* Type specimen */}
        <div className="bg-surfaceSubtle p-6 mb-4">
          <p
            className="font-serif text-[40px] font-normal leading-[1.2] mb-4"
            style={{ fontFamily: "var(--font-family-serif)" }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="font-serif text-[28px] font-normal leading-[1.2] mb-4"
            style={{ fontFamily: "var(--font-family-serif)" }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="font-serif text-[16px] font-normal leading-[1.4] mb-0"
            style={{ fontFamily: "var(--font-family-serif)" }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        {/* Font details table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Font
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Weight
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Style
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Token
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Regular</td>
                <td className="py-3 px-4">400</td>
                <td className="py-3 px-4">normal</td>
                <td className="py-3 px-4 font-mono" rowSpan={6}>
                  --font-family-serif
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Regular Italic</td>
                <td className="py-3 px-4">400</td>
                <td className="py-3 px-4">italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Medium</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">normal</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Medium Italic</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">SemiBold</td>
                <td className="py-3 px-4">600</td>
                <td className="py-3 px-4">normal</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">SemiBold Italic</td>
                <td className="py-3 px-4">600</td>
                <td className="py-3 px-4">italic</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Italic specimen */}
        <h3
          id="eb-garamond-italic"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          EB Garamond Italic
        </h3>
        <p className="text-base text-textSubtle mb-4">
          For emphasis within body text and pull quotes where Garamond is used.
        </p>

        <div className="bg-surfaceSubtle p-6 mb-8">
          <p
            className="font-serif text-[28px] font-normal italic leading-[1.2] mb-4"
            style={{ fontFamily: "var(--font-family-serif)" }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="font-serif text-[16px] font-normal italic leading-[1.4] mb-0"
            style={{ fontFamily: "var(--font-family-serif)" }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Inter Section */}
      <section>
        <h2
          id="inter"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Inter
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        {/* Inter Variable */}
        <h3
          id="inter-variable"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Inter Variable
        </h3>
        <p className="text-base text-textSubtle mb-4">
          Primary typeface for body text, UI elements, navigation, metadata, and
          captions. A variable font optimized for screen readability with a
          complete weight spectrum from 100-900.
        </p>

        {/* Type specimen */}
        <div className="bg-surfaceSubtle p-6 mb-4">
          <p
            className="font-sans text-[32px] font-normal leading-[1.2] mb-4"
            style={{ fontFamily: "var(--font-family-sans)" }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="font-sans text-[20px] font-normal leading-[1.3] mb-4"
            style={{ fontFamily: "var(--font-family-sans)" }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="font-sans text-[14px] font-normal leading-[1.4] mb-0"
            style={{ fontFamily: "var(--font-family-sans)" }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        {/* Figures specimen */}
        <div className="bg-surfaceSubtle p-6 mb-4">
          <p
            className="font-sans text-[20px] font-normal leading-[1.3] mb-0"
            style={{ fontFamily: "var(--font-family-sans)" }}
          >
            0123456789
          </p>
        </div>

        {/* Font details table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Font
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Weight
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Style
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Token
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Light</td>
                <td className="py-3 px-4">300</td>
                <td className="py-3 px-4">normal</td>
                <td className="py-3 px-4 font-mono" rowSpan={5}>
                  --font-family-sans
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Regular</td>
                <td className="py-3 px-4">400</td>
                <td className="py-3 px-4">normal</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Medium</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">normal</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">SemiBold</td>
                <td className="py-3 px-4">600</td>
                <td className="py-3 px-4">normal</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Bold</td>
                <td className="py-3 px-4">700</td>
                <td className="py-3 px-4">normal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Weight spectrum */}
        <h3
          id="inter-weights"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Weight spectrum
        </h3>
        <p className="text-base text-textSubtle mb-4">
          Inter Variable supports continuous weights from 100-900, allowing
          precise typographic control.
        </p>

        <div className="bg-surfaceSubtle p-6 mb-8">
          <p
            className="font-sans text-[20px] leading-[1.4] mb-2"
            style={{ fontFamily: "var(--font-family-sans)", fontWeight: 300 }}
          >
            Light 300 — The quick brown fox
          </p>
          <p
            className="font-sans text-[20px] leading-[1.4] mb-2"
            style={{ fontFamily: "var(--font-family-sans)", fontWeight: 400 }}
          >
            Regular 400 — The quick brown fox
          </p>
          <p
            className="font-sans text-[20px] leading-[1.4] mb-2"
            style={{ fontFamily: "var(--font-family-sans)", fontWeight: 500 }}
          >
            Medium 500 — The quick brown fox
          </p>
          <p
            className="font-sans text-[20px] leading-[1.4] mb-2"
            style={{ fontFamily: "var(--font-family-sans)", fontWeight: 600 }}
          >
            SemiBold 600 — The quick brown fox
          </p>
          <p
            className="font-sans text-[20px] leading-[1.4] mb-0"
            style={{ fontFamily: "var(--font-family-sans)", fontWeight: 700 }}
          >
            Bold 700 — The quick brown fox
          </p>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Font Roles Section */}
      <section>
        <h2
          id="font-roles"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Font roles
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Semantic font tokens map typefaces to their intended use, ensuring
          consistent application across the design system.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Role
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Token
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Typeface
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Display</td>
                <td className="py-3 px-4 font-mono">--display-font</td>
                <td className="py-3 px-4">EB Garamond</td>
                <td className="py-3 px-4">Large headlines, hero text</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Headline</td>
                <td className="py-3 px-4 font-mono">--headline-font</td>
                <td className="py-3 px-4">EB Garamond</td>
                <td className="py-3 px-4">Article titles, section headers</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Subheading</td>
                <td className="py-3 px-4 font-mono">--subheading-font</td>
                <td className="py-3 px-4">EB Garamond</td>
                <td className="py-3 px-4">Subheadings, secondary titles</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Brand</td>
                <td className="py-3 px-4 font-mono">--brand-font</td>
                <td className="py-3 px-4">EB Garamond</td>
                <td className="py-3 px-4">Brand elements, masthead</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Body</td>
                <td className="py-3 px-4 font-mono">--body-font</td>
                <td className="py-3 px-4">Inter</td>
                <td className="py-3 px-4">Paragraphs, long-form content</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">UI</td>
                <td className="py-3 px-4 font-mono">--ui-font</td>
                <td className="py-3 px-4">Inter</td>
                <td className="py-3 px-4">Buttons, labels, navigation</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Base</td>
                <td className="py-3 px-4 font-mono">--base-font</td>
                <td className="py-3 px-4">Inter</td>
                <td className="py-3 px-4">Default, metadata, captions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Reference Section */}
      <section>
        <h2
          id="reference"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Reference
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  CSS Variable
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">--font-family-serif</td>
                <td className="py-3 px-4 font-mono text-xs">
                  &quot;eb-garamond&quot;, Georgia, serif
                </td>
                <td className="py-3 px-4 font-mono">font-serif</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">--font-family-sans</td>
                <td className="py-3 px-4 font-mono text-xs">
                  &quot;inter-variable&quot;, sans-serif
                </td>
                <td className="py-3 px-4 font-mono">font-sans</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">--font-weight-light</td>
                <td className="py-3 px-4">300</td>
                <td className="py-3 px-4 font-mono">font-light</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">--font-weight-regular</td>
                <td className="py-3 px-4">400</td>
                <td className="py-3 px-4 font-mono">font-normal</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">--font-weight-medium</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4 font-mono">font-medium</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">--font-weight-semibold</td>
                <td className="py-3 px-4">600</td>
                <td className="py-3 px-4 font-mono">font-semibold</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">--font-weight-bold</td>
                <td className="py-3 px-4">700</td>
                <td className="py-3 px-4 font-mono">font-bold</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
