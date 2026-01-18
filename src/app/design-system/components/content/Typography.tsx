export default function Typography() {
  return (
    <div className="space-y-8">
      {/* Usage Section */}
      <section id="usage">
        <h2 className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32">
          Usage
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Our typography styles can be consumed as Tailwind classes. The classes
          below pre-set a combination of font-size, line-height, letter-spacing,
          and font-weight for you based on the Geist design system.
        </p>

        <div className="bg-surfaceSubtle border border-borderSubtle rounded-lg p-6 mb-6">
          <p className="text-copy-14 text-textSubtle mb-4">
            The <code className="text-label-13-mono px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">strong</code> element
            can be used as a modifier to change the font weight. For Headings,
            this reduces the weight (for creating subtle variants), while for Copy
            text it increases the weight for emphasis.
          </p>
          <div className="font-mono text-sm text-textSubtle">
            <code className="block">&lt;p className=&quot;text-heading-32&quot;&gt;</code>
            <code className="block pl-4">Heading with &lt;strong&gt;subtle&lt;/strong&gt; text</code>
            <code className="block">&lt;/p&gt;</code>
          </div>
        </div>
      </section>

      {/* Headings Section */}
      <section id="headings">
        <h2 className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32">
          Headings
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Headings are used to introduce pages or sections. The{" "}
          <code className="text-label-13-mono px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">strong</code>{" "}
          element reduces the weight for creating subtle variants.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Class name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-72">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-72
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Hero headlines
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-64">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-64
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Large page titles
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-56">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-56
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Page titles
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-48">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-48
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Section titles
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-40">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-40
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Feature headers
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-32">
                    Heading <strong>Subtle</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-32
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Card titles, section headers
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-24">
                    Heading <strong>Subtle</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-24
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Subsection titles
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-20">
                    Heading <strong>Subtle</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-20
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Small headers
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-16">
                    Heading <strong>Subtle</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-16
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Mini headers, labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-heading-14">Heading</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-heading-14
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Smallest heading
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Buttons Section */}
      <section id="buttons">
        <h2 className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32">
          Buttons
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Button text styles should only be used for button components.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Class name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-button-16">Button Text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-button-16
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Large buttons
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-button-14">Button Text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-button-14
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Default buttons
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-button-12">Button Text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-button-12
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Small buttons
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Labels Section */}
      <section id="labels">
        <h2 className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32">
          Labels
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Labels are single-line text with ample line-height to align with icons.
          Use the <code className="text-label-13-mono px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">strong</code>{" "}
          element to increase weight. Mono variants use monospace font.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Class name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-20">Label Text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-20
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Large labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-18">Label Text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-18
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Medium labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-16">
                    Label <strong>Strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-16
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Default labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-14">
                    Label <strong>Strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-14
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Standard labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-14-mono">Label Mono</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-14-mono
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Code, technical labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-13">
                    Label <strong>Strong</strong> <span style={{ fontVariantNumeric: "tabular-nums" }}>123</span>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-13
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Small labels, tabular nums
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-13-mono">Label Mono</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-13-mono
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Small code labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-12">
                    Label <strong>Strong</strong> <span className="uppercase">CAPS</span>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-12
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Tiny labels, metadata
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-label-12-mono">Label Mono</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-label-12-mono
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Tiny code labels
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Copy Section */}
      <section id="copy">
        <h2 className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32">
          Copy
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Copy styles are for multi-line text with higher line height than Labels.
          Use the <code className="text-label-13-mono px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded">strong</code>{" "}
          element to increase weight for emphasis.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm w-1/2">
                  Example
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Class name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-24">
                    Copy text <strong>strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-24
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Lead paragraphs
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-20">
                    Copy text <strong>strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-20
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Large body text
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-18">
                    Copy text <strong>strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-18
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Introductions
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-16">
                    Copy text <strong>strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-16
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Default body text
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-14">
                    Copy text <strong>strong</strong>
                  </p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-14
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Compact body text
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-13">Copy text</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-13
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Small body text
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-4 pr-4">
                  <p className="text-copy-13-mono">Copy text mono</p>
                </td>
                <td className="py-4 px-4 font-mono text-xs align-top">
                  text-copy-13-mono
                </td>
                <td className="py-4 px-4 text-textSubtle align-top">
                  Code snippets, technical text
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Reference Section */}
      <section id="reference">
        <h2 className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32">
          Quick reference
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Complete specifications for all typography utility classes.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Class
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Font Size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Line Height
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Letter Spacing
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Font Weight
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono whitespace-nowrap">
              {/* Headings */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td colSpan={5} className="py-2 px-4 font-sans font-semibold text-textSubtle">
                  Headings
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-72</td>
                <td className="py-2 px-4">72px</td>
                <td className="py-2 px-4">80px</td>
                <td className="py-2 px-4">-0.04em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-64</td>
                <td className="py-2 px-4">64px</td>
                <td className="py-2 px-4">72px</td>
                <td className="py-2 px-4">-0.04em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-56</td>
                <td className="py-2 px-4">56px</td>
                <td className="py-2 px-4">64px</td>
                <td className="py-2 px-4">-0.04em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-48</td>
                <td className="py-2 px-4">48px</td>
                <td className="py-2 px-4">56px</td>
                <td className="py-2 px-4">-0.03em</td>
                <td className="py-2 px-4">700</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-40</td>
                <td className="py-2 px-4">40px</td>
                <td className="py-2 px-4">48px</td>
                <td className="py-2 px-4">-0.02em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-32</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">40px</td>
                <td className="py-2 px-4">-0.02em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-24</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">-0.015em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-20</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">28px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">600</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-heading-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">-0.006em</td>
                <td className="py-2 px-4">600</td>
              </tr>

              {/* Buttons */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td colSpan={5} className="py-2 px-4 font-sans font-semibold text-textSubtle">
                  Buttons
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-button-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-button-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-button-12</td>
                <td className="py-2 px-4">12px</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">500</td>
              </tr>

              {/* Labels */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td colSpan={5} className="py-2 px-4 font-sans font-semibold text-textSubtle">
                  Labels
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-20</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-18</td>
                <td className="py-2 px-4">18px</td>
                <td className="py-2 px-4">28px</td>
                <td className="py-2 px-4">-0.01em</td>
                <td className="py-2 px-4">500</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-14-mono</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-13</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-13-mono</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-12</td>
                <td className="py-2 px-4">12px</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-label-12-mono</td>
                <td className="py-2 px-4">12px</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>

              {/* Copy */}
              <tr className="border-b border-borderSubtle bg-surfaceSubtle">
                <td colSpan={5} className="py-2 px-4 font-sans font-semibold text-textSubtle">
                  Copy
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-24</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">36px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-20</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">32px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-18</td>
                <td className="py-2 px-4">18px</td>
                <td className="py-2 px-4">28px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-16</td>
                <td className="py-2 px-4">16px</td>
                <td className="py-2 px-4">24px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-14</td>
                <td className="py-2 px-4">14px</td>
                <td className="py-2 px-4">22px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-13</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4">text-copy-13-mono</td>
                <td className="py-2 px-4">13px</td>
                <td className="py-2 px-4">20px</td>
                <td className="py-2 px-4">0</td>
                <td className="py-2 px-4">400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
