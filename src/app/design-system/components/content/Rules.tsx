export default function Rules() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-[48px] leading-[1.1] font-medium mb-4 text-textDefault">
        Rules
      </h1>
      <p className="text-base text-textSubtle mb-8 max-w-3xl">
        Horizontal dividers (rules) provide visual separation between content
        sections. Different rule styles convey varying levels of importance and
        hierarchy throughout the interface.
      </p>

      <hr className="border-t-4 border-textDefault mb-12" />

      {/* Styles Section */}
      <section>
        <h2
          id="styles"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-3 scroll-mt-32"
        >
          Styles
        </h2>

        {/* Rule - Default */}
        <h3
          id="styles-rule"
          className="font-serif text-[24px] leading-[1.3] font-medium mb-4 mt-8 scroll-mt-32"
        >
          Rule
        </h3>
        <p className="text-sm text-textSubtle mb-4">
          Default rule for light separation between sections. 1px solid,
          Asphalt 90.
        </p>
        <div className="p-4 bg-surface border border-borderSubtle rounded mb-8">
          <hr className="border-t border-borderSubtle" />
        </div>

        {/* Rule - Default (on dark) */}
        <h3
          id="styles-rule-inverse"
          className="font-serif text-[24px] leading-[1.3] font-medium mb-4 mt-8 scroll-mt-32"
        >
          Rule (inverse)
        </h3>
        <p className="text-sm text-textSubtle mb-4">
          Default rule for dark backgrounds. 1px solid, Asphalt 20.
        </p>
        <div className="p-4 bg-asphalt-10 border border-asphalt-20 rounded mb-8">
          <hr className="border-t border-asphalt-20" />
        </div>

        {/* Rule - Emphasised */}
        <h3
          id="styles-rule-emphasised"
          className="font-serif text-[24px] leading-[1.3] font-medium mb-4 mt-8 scroll-mt-32"
        >
          Rule (emphasised)
        </h3>
        <p className="text-sm text-textSubtle mb-4">
          Stronger separation for light backgrounds. 1px solid, near-black
          (Asphalt 10).
        </p>
        <div className="p-4 bg-surface border border-borderSubtle rounded mb-8">
          <hr className="border-t border-asphalt-10" />
        </div>

        {/* Rule - Emphasised (inverse) */}
        <h3
          id="styles-rule-inverse-emphasised"
          className="font-serif text-[24px] leading-[1.3] font-medium mb-4 mt-8 scroll-mt-32"
        >
          Rule (inverse, emphasised)
        </h3>
        <p className="text-sm text-textSubtle mb-4">
          Stronger separation for dark backgrounds. 1px solid, near-white
          (Asphalt 95).
        </p>
        <div className="p-4 bg-asphalt-10 border border-asphalt-20 rounded mb-8">
          <hr className="border-t border-asphalt-95" />
        </div>

        {/* Rule - Heavy */}
        <h3
          id="styles-rule-heavy"
          className="font-serif text-[24px] leading-[1.3] font-medium mb-4 mt-8 scroll-mt-32"
        >
          Rule (heavy)
        </h3>
        <p className="text-sm text-textSubtle mb-4">
          Major section divider. 4px solid, near-black (Asphalt 10).
        </p>
        <div className="p-4 bg-surface border border-borderSubtle rounded mb-8">
          <hr className="border-t-4 border-asphalt-10" />
        </div>

        {/* Rule - Heavy (inverse) */}
        <h3
          id="styles-rule-inverse-heavy"
          className="font-serif text-[24px] leading-[1.3] font-medium mb-4 mt-8 scroll-mt-32"
        >
          Rule (inverse, heavy)
        </h3>
        <p className="text-sm text-textSubtle mb-4">
          Major section divider for dark backgrounds. 4px solid, near-white
          (Asphalt 95).
        </p>
        <div className="p-4 bg-asphalt-10 border border-asphalt-20 rounded mb-8">
          <hr className="border-t-4 border-asphalt-95" />
        </div>

        {/* Rule - Accent */}
        <h3
          id="styles-rule-accent"
          className="font-serif text-[24px] leading-[1.3] font-medium mb-4 mt-8 scroll-mt-32"
        >
          Rule (accent)
        </h3>
        <p className="text-sm text-textSubtle mb-4">
          Brand accent divider for emphasis. 4px solid, Electric Pink.
        </p>
        <div className="p-4 bg-surface border border-borderSubtle rounded mb-8">
          <hr className="border-t-4 border-electric-pink" />
        </div>

        {/* Rule - Accent (inverse) */}
        <h3
          id="styles-rule-inverse-accent"
          className="font-serif text-[24px] leading-[1.3] font-medium mb-4 mt-8 scroll-mt-32"
        >
          Rule (accent, inverse)
        </h3>
        <p className="text-sm text-textSubtle mb-4">
          Brand accent divider on dark backgrounds. 4px solid, Electric Pink.
        </p>
        <div className="p-4 bg-asphalt-10 border border-asphalt-20 rounded mb-8">
          <hr className="border-t-4 border-electric-pink" />
        </div>
      </section>

      <hr className="border-t-4 border-textDefault my-12" />

      {/* Reference Table */}
      <section>
        <h2
          id="reference"
          className="font-serif text-[32px] leading-[1.2] font-medium mb-6 scroll-mt-32"
        >
          Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind Classes
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  CSS Token
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">Rule</td>
                <td className="py-3 px-4 font-mono text-xs">
                  border-t border-borderSubtle
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  --rule-default
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">Rule (inverse)</td>
                <td className="py-3 px-4 font-mono text-xs">
                  border-t border-asphalt-20
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  --rule-inverse
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">Rule (emphasised)</td>
                <td className="py-3 px-4 font-mono text-xs">
                  border-t border-asphalt-10
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  --rule-emphasised
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">Rule (inverse, emphasised)</td>
                <td className="py-3 px-4 font-mono text-xs">
                  border-t border-asphalt-95
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  --rule-inverse-emphasised
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">Rule (heavy)</td>
                <td className="py-3 px-4 font-mono text-xs">
                  border-t-4 border-asphalt-10
                </td>
                <td className="py-3 px-4 font-mono text-xs">--rule-heavy</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">Rule (inverse, heavy)</td>
                <td className="py-3 px-4 font-mono text-xs">
                  border-t-4 border-asphalt-95
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  --rule-inverse-heavy
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">Rule (accent)</td>
                <td className="py-3 px-4 font-mono text-xs">
                  border-t-4 border-electric-pink
                </td>
                <td className="py-3 px-4 font-mono text-xs">--rule-accent</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 px-4">Rule (accent, inverse)</td>
                <td className="py-3 px-4 font-mono text-xs">
                  border-t-4 border-electric-pink
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  --rule-accent-inverse
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
