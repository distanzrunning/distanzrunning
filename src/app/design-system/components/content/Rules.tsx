export default function Rules() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Foundations
        </p>
        <h1
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
          id="rules"
        >
          Rules
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* Introduction */}
      <p className="text-base text-textSubtle">
        Horizontal rules provide visual separation between content sections.
        Different styles convey varying levels of hierarchy and emphasis.
      </p>

      {/* Styles Section */}
      <section>
        <h2
          id="styles"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Styles
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        {/* Rule - Default */}
        <h3
          id="styles-rule"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Rule
        </h3>
        <p className="text-base text-textSubtle mb-4">
          Default rule for subtle separation between sections.
        </p>
        <div className="p-6 bg-surface border border-borderSubtle rounded mb-4">
          <hr className="border-t border-borderSubtle" />
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Weight</td>
                <td className="py-2 px-4">1px</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Color</td>
                <td className="py-2 px-4 font-mono">borderSubtle</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                <td className="py-2 px-4 font-mono">
                  border-t border-borderSubtle
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Rule - Emphasised */}
        <h3
          id="styles-rule-emphasised"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Rule (emphasised)
        </h3>
        <p className="text-base text-textSubtle mb-4">
          Stronger separation using the default text color.
        </p>
        <div className="p-6 bg-surface border border-borderSubtle rounded mb-4">
          <hr className="border-t border-textDefault" />
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Weight</td>
                <td className="py-2 px-4">1px</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Color</td>
                <td className="py-2 px-4 font-mono">textDefault</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                <td className="py-2 px-4 font-mono">
                  border-t border-textDefault
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Rule - Heavy */}
        <h3
          id="styles-rule-heavy"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Rule (heavy)
        </h3>
        <p className="text-base text-textSubtle mb-4">
          Major section divider for primary content breaks.
        </p>
        <div className="p-6 bg-surface border border-borderSubtle rounded mb-4">
          <hr className="border-t-4 border-textDefault" />
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Weight</td>
                <td className="py-2 px-4">4px</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Color</td>
                <td className="py-2 px-4 font-mono">textDefault</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                <td className="py-2 px-4 font-mono">
                  border-t-4 border-textDefault
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Rule - Accent */}
        <h3
          id="styles-rule-accent"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Rule (accent)
        </h3>
        <p className="text-base text-textSubtle mb-4">
          Brand accent divider for featured content and emphasis.
        </p>
        <div className="p-6 bg-surface border border-borderSubtle rounded mb-4">
          <hr className="border-t-4 border-electric-pink" />
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Weight</td>
                <td className="py-2 px-4">4px</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Color</td>
                <td className="py-2 px-4 font-mono">electric-pink</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                <td className="py-2 px-4 font-mono">
                  border-t-4 border-electric-pink
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Dark Mode Section */}
      <section>
        <h2
          id="dark-mode"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Dark mode
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Rules automatically adapt in dark mode using semantic color tokens.
          The same Tailwind classes work on both light and dark backgrounds.
        </p>

        {/* Dark mode examples */}
        <div className="p-6 bg-asphalt-10 rounded mb-4">
          <p className="text-asphalt-90 text-sm mb-4">Rule (default)</p>
          <hr className="border-t border-asphalt-30 mb-6" />

          <p className="text-asphalt-90 text-sm mb-4">Rule (emphasised)</p>
          <hr className="border-t border-asphalt-90 mb-6" />

          <p className="text-asphalt-90 text-sm mb-4">Rule (heavy)</p>
          <hr className="border-t-4 border-asphalt-90 mb-6" />

          <p className="text-asphalt-90 text-sm mb-4">Rule (accent)</p>
          <hr className="border-t-4 border-electric-pink" />
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Reference Table */}
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
                  Style
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Weight
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Color token
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  CSS variable
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Rule</td>
                <td className="py-3 px-4">1px</td>
                <td className="py-3 px-4 font-mono">borderSubtle</td>
                <td className="py-3 px-4 font-mono">
                  border-t border-borderSubtle
                </td>
                <td className="py-3 px-4 font-mono">--rule-default</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Rule (emphasised)</td>
                <td className="py-3 px-4">1px</td>
                <td className="py-3 px-4 font-mono">textDefault</td>
                <td className="py-3 px-4 font-mono">
                  border-t border-textDefault
                </td>
                <td className="py-3 px-4 font-mono">--rule-emphasised</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Rule (heavy)</td>
                <td className="py-3 px-4">4px</td>
                <td className="py-3 px-4 font-mono">textDefault</td>
                <td className="py-3 px-4 font-mono">
                  border-t-4 border-textDefault
                </td>
                <td className="py-3 px-4 font-mono">--rule-heavy</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Rule (accent)</td>
                <td className="py-3 px-4">4px</td>
                <td className="py-3 px-4 font-mono">electric-pink</td>
                <td className="py-3 px-4 font-mono">
                  border-t-4 border-electric-pink
                </td>
                <td className="py-3 px-4 font-mono">--rule-accent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Usage Guidelines */}
      <section>
        <h2
          id="usage"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Usage
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Style
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  When to use
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Rule</td>
                <td className="py-3 px-4">
                  Subtle separation between related content, list items, table
                  rows
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Rule (emphasised)</td>
                <td className="py-3 px-4">
                  Clearer separation between distinct sections, after headings
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Rule (heavy)</td>
                <td className="py-3 px-4">
                  Major page sections, below page titles, article breaks
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Rule (accent)</td>
                <td className="py-3 px-4">
                  Featured content, brand moments, category indicators
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
