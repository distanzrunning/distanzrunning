export default function Rules() {
  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <p className="text-copy-14 tracking-wide text-textSubtle mb-2">
          Foundations
        </p>
        <h1
          className="text-heading-40 mb-0"
          id="rules"
        >
          Rules
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* Introduction */}
      <p className="text-copy-16 text-textSubtle">
        Horizontal rules provide visual separation between content sections.
        Different styles convey varying levels of hierarchy and emphasis.
      </p>

      {/* Styles Section */}
      <section>
        <h2
          id="styles"
          className="text-heading-24 mb-2 scroll-mt-32"
        >
          Styles
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        {/* Rule - Default */}
        <h3
          id="styles-rule"
          className="text-heading-20 mb-3 scroll-mt-32"
        >
          Rule
        </h3>
        <p className="text-copy-16 text-textSubtle mb-4">
          Default rule for subtle separation between sections.
        </p>
        <div className="p-6 bg-surface border border-borderSubtle rounded mb-4">
          <hr className="border-t border-borderSubtle" />
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <tbody className="text-copy-14 whitespace-nowrap">
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
          className="text-heading-20 mb-3 scroll-mt-32"
        >
          Rule (emphasised)
        </h3>
        <p className="text-copy-16 text-textSubtle mb-4">
          Stronger separation using the default text color.
        </p>
        <div className="p-6 bg-surface border border-borderSubtle rounded mb-4">
          <hr className="border-t border-textDefault" />
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <tbody className="text-copy-14 whitespace-nowrap">
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
          className="text-heading-20 mb-3 scroll-mt-32"
        >
          Rule (heavy)
        </h3>
        <p className="text-copy-16 text-textSubtle mb-4">
          Major section divider for primary content breaks.
        </p>
        <div className="p-6 bg-surface border border-borderSubtle rounded mb-4">
          <hr className="border-t-4 border-textDefault" />
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <tbody className="text-copy-14 whitespace-nowrap">
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

      </section>

      <hr className="border-t border-borderDefault" />

      {/* Dark Mode Section */}
      <section>
        <h2
          id="dark-mode"
          className="text-heading-24 mb-2 scroll-mt-32"
        >
          Dark mode
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-copy-16 text-textSubtle mb-6">
          Rules automatically adapt in dark mode using semantic color tokens.
          The same Tailwind classes work on both light and dark backgrounds.
        </p>

        {/* Dark mode examples */}
        <div className="p-6 bg-gray-1000 rounded mb-4">
          <p className="text-gray-300 text-sm mb-4">Rule (default)</p>
          <hr className="border-t border-gray-800 mb-6" />

          <p className="text-gray-300 text-sm mb-4">Rule (emphasised)</p>
          <hr className="border-t border-gray-300 mb-6" />

          <p className="text-gray-300 text-sm mb-4">Rule (heavy)</p>
          <hr className="border-t-4 border-gray-300" />
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Reference Table */}
      <section>
        <h2
          id="reference"
          className="text-heading-24 mb-2 scroll-mt-32"
        >
          Reference
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 text-heading-14">
                  Style
                </th>
                <th className="text-left py-3 px-4 text-heading-14">
                  Weight
                </th>
                <th className="text-left py-3 px-4 text-heading-14">
                  Color token
                </th>
                <th className="text-left py-3 px-4 text-heading-14">
                  Tailwind
                </th>
                <th className="text-left py-3 px-4 text-heading-14">
                  CSS variable
                </th>
              </tr>
            </thead>
            <tbody className="text-copy-14 whitespace-nowrap">
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
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Usage Guidelines */}
      <section>
        <h2
          id="usage"
          className="text-heading-24 mb-2 scroll-mt-32"
        >
          Usage
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 text-heading-14">
                  Style
                </th>
                <th className="text-left py-3 px-4 text-heading-14">
                  When to use
                </th>
              </tr>
            </thead>
            <tbody className="text-copy-14">
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
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
