export default function Typefaces() {
  return (
    <div className="space-y-4">
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
          revival of Claude Garamont&apos;s famous humanist typefaces from the
          mid-16th century, designed by Georg Duffner. Known for its elegance,
          readability, and timeless classical character.
        </p>

        {/* Type specimen */}
        <div className="bg-surfaceSubtle p-6 mb-4">
          <p
            className="font-serif text-[40px] font-semibold leading-[1.2] mb-4"
            style={{ fontFamily: "var(--font-family-serif)" }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="font-serif text-[28px] font-medium leading-[1.2] mb-4"
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
                <td className="py-3 px-4">normal / italic</td>
                <td className="py-3 px-4 font-mono" rowSpan={5}>
                  --font-family-serif
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Medium</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">SemiBold</td>
                <td className="py-3 px-4">600</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Bold</td>
                <td className="py-3 px-4">700</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">ExtraBold</td>
                <td className="py-3 px-4">800</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Weight spectrum */}
        <h3
          id="eb-garamond-weights"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Weight spectrum
        </h3>
        <p className="text-base text-textSubtle mb-4">
          EB Garamond offers five weights from Regular to ExtraBold, with
          matching italics for each weight. Its elegant proportions make it
          ideal for headlines and display text.
        </p>

        <div className="bg-surfaceSubtle p-6 mb-8">
          <p
            className="font-serif text-[24px] leading-[1.3] mb-2"
            style={{ fontFamily: "var(--font-family-serif)", fontWeight: 400 }}
          >
            Regular 400 — The quick brown fox
          </p>
          <p
            className="font-serif text-[24px] leading-[1.3] mb-2"
            style={{ fontFamily: "var(--font-family-serif)", fontWeight: 500 }}
          >
            Medium 500 — The quick brown fox
          </p>
          <p
            className="font-serif text-[24px] leading-[1.3] mb-2"
            style={{ fontFamily: "var(--font-family-serif)", fontWeight: 600 }}
          >
            SemiBold 600 — The quick brown fox
          </p>
          <p
            className="font-serif text-[24px] leading-[1.3] mb-2"
            style={{ fontFamily: "var(--font-family-serif)", fontWeight: 700 }}
          >
            Bold 700 — The quick brown fox
          </p>
          <p
            className="font-serif text-[24px] leading-[1.3] mb-0"
            style={{ fontFamily: "var(--font-family-serif)", fontWeight: 800 }}
          >
            ExtraBold 800 — The quick brown fox
          </p>
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
          The italic cuts are true italics based on the chancery style, not
          simply slanted romans. They bring an additional layer of elegance for
          emphasis and decorative typography.
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

      {/* Libre Franklin Section */}
      <section>
        <h2
          id="libre-franklin"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Libre Franklin
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        {/* Libre Franklin */}
        <h3
          id="libre-franklin-regular"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Libre Franklin
        </h3>
        <p className="text-base text-textSubtle mb-4">
          Primary typeface for body text, UI elements, navigation, metadata, and
          captions. A reinterpretation of Morris Fuller Benton&apos;s 1912
          Franklin Gothic with excellent screen readability and a complete
          weight spectrum from Thin to Black.
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
                <td className="py-3 pr-4">Thin</td>
                <td className="py-3 px-4">100</td>
                <td className="py-3 px-4">normal / italic</td>
                <td className="py-3 px-4 font-mono" rowSpan={9}>
                  --font-family-sans
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">ExtraLight</td>
                <td className="py-3 px-4">200</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Light</td>
                <td className="py-3 px-4">300</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Regular</td>
                <td className="py-3 px-4">400</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Medium</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">SemiBold</td>
                <td className="py-3 px-4">600</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Bold</td>
                <td className="py-3 px-4">700</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">ExtraBold</td>
                <td className="py-3 px-4">800</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Black</td>
                <td className="py-3 px-4">900</td>
                <td className="py-3 px-4">normal / italic</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Weight spectrum */}
        <h3
          id="libre-franklin-weights"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Weight spectrum
        </h3>
        <p className="text-base text-textSubtle mb-4">
          Libre Franklin provides a complete weight spectrum from 100-900 with
          matching italics, enabling precise typographic control.
        </p>

        <div className="bg-surfaceSubtle p-6 mb-8">
          <p
            className="font-sans text-[20px] leading-[1.4] mb-2"
            style={{ fontFamily: "var(--font-family-sans)", fontWeight: 100 }}
          >
            Thin 100 — The quick brown fox
          </p>
          <p
            className="font-sans text-[20px] leading-[1.4] mb-2"
            style={{ fontFamily: "var(--font-family-sans)", fontWeight: 200 }}
          >
            ExtraLight 200 — The quick brown fox
          </p>
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
            className="font-sans text-[20px] leading-[1.4] mb-2"
            style={{ fontFamily: "var(--font-family-sans)", fontWeight: 700 }}
          >
            Bold 700 — The quick brown fox
          </p>
          <p
            className="font-sans text-[20px] leading-[1.4] mb-2"
            style={{ fontFamily: "var(--font-family-sans)", fontWeight: 800 }}
          >
            ExtraBold 800 — The quick brown fox
          </p>
          <p
            className="font-sans text-[20px] leading-[1.4] mb-0"
            style={{ fontFamily: "var(--font-family-sans)", fontWeight: 900 }}
          >
            Black 900 — The quick brown fox
          </p>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Italic specimen */}
        <h3
          id="libre-franklin-italic"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Libre Franklin Italic
        </h3>
        <p className="text-base text-textSubtle mb-4">
          For emphasis within body text and where typographic distinction is
          needed.
        </p>

        <div className="bg-surfaceSubtle p-6 mb-8">
          <p
            className="font-sans text-[28px] font-normal italic leading-[1.2] mb-4"
            style={{ fontFamily: "var(--font-family-sans)" }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="font-sans text-[16px] font-normal italic leading-[1.4] mb-0"
            style={{ fontFamily: "var(--font-family-sans)" }}
          >
            The quick brown fox jumps over the lazy dog.
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
                <td className="py-3 px-4">Libre Franklin</td>
                <td className="py-3 px-4">Paragraphs, long-form content</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">UI</td>
                <td className="py-3 px-4 font-mono">--ui-font</td>
                <td className="py-3 px-4">Libre Franklin</td>
                <td className="py-3 px-4">Buttons, labels, navigation</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Base</td>
                <td className="py-3 px-4 font-mono">--base-font</td>
                <td className="py-3 px-4">Libre Franklin</td>
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
                  &quot;libre-franklin&quot;, sans-serif
                </td>
                <td className="py-3 px-4 font-mono">font-sans</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">--font-weight-thin</td>
                <td className="py-3 px-4">100</td>
                <td className="py-3 px-4 font-mono">font-thin</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">
                  --font-weight-extralight
                </td>
                <td className="py-3 px-4">200</td>
                <td className="py-3 px-4 font-mono">font-extralight</td>
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
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">--font-weight-extrabold</td>
                <td className="py-3 px-4">800</td>
                <td className="py-3 px-4 font-mono">font-extrabold</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 font-mono">--font-weight-black</td>
                <td className="py-3 px-4">900</td>
                <td className="py-3 px-4 font-mono">font-black</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
