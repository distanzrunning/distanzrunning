import Image from "next/image";

export default function GridSpacing() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">Grid</p>
        <h1
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
          id="grid-spacing"
        >
          Grid spacing
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* Gap and Gutter Section */}
      <section>
        <h2
          id="gap-and-gutter"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Gap and gutter
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-4">
          Distanz uses a simple, consistent spacing system. Gap is the standard
          spacing between elements within components. Gutter is the space
          between grid columns, always 2x the gap value.
        </p>
        <p className="text-base text-textSubtle mb-8">
          These fixed values ensure visual harmony and recognisable consistency
          across all pages and screen sizes.
        </p>

        {/* Grid Gap Subsection */}
        <h3
          id="gap-and-gutter-grid-gap"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Grid gap
        </h3>
        <p className="text-base text-textSubtle mb-6">
          Grid gap is the standard spacing between elements - used for vertical
          spacing between form fields, list items, and component internals.
        </p>

        {/* Grid Gap SVG Diagram */}
        <figure className="mb-8 max-w-[386px]">
          <Image
            src="/images/design-system/grid-gap-spacing.svg"
            alt="Grid gap showing 16px spacing between form elements"
            width={386}
            height={200}
          />
        </figure>

        {/* Grid Gap Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Token
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm font-mono">--grid-gap</td>
                <td className="py-3 px-4 text-sm">16px (1rem)</td>
                <td className="py-3 px-4 text-sm font-mono">gap-4</td>
                <td className="py-3 px-4 text-sm">Spacing between elements</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Grid Gutter Subsection */}
        <h3
          id="gap-and-gutter-grid-gutter"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Grid gutter
        </h3>
        <p className="text-base text-textSubtle mb-6">
          Grid gutter is the space between grid columns - always 2x the gap
          value. This creates visual rhythm and ensures content has room to
          breathe.
        </p>

        {/* Grid Gutter SVG Diagram */}
        <figure className="mb-8 max-w-[600px]">
          <Image
            src="/images/design-system/grid-gutter-columns.svg"
            alt="Grid gutter showing 32px spacing between columns"
            width={600}
            height={200}
          />
        </figure>

        {/* Grid Gutter Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Token
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm font-mono">--grid-gutter</td>
                <td className="py-3 px-4 text-sm">32px (2rem)</td>
                <td className="py-3 px-4 text-sm font-mono">gap-8</td>
                <td className="py-3 px-4 text-sm">Column spacing in grids</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Responsive Note */}
        <h3
          id="gap-and-gutter-responsive"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Responsive spacing
        </h3>
        <p className="text-base text-textSubtle mb-6">
          On mobile screens (below 768px), outside gutters reduce to 24px to
          maximize content space while maintaining the internal 16px gap and
          32px column gutter.
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Spacing
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Mobile (&lt;768px)
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Desktop (768px+)
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Grid gap</td>
                <td className="py-3 px-4 text-sm">16px</td>
                <td className="py-3 px-4 text-sm">16px</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Grid gutter</td>
                <td className="py-3 px-4 text-sm">32px</td>
                <td className="py-3 px-4 text-sm">32px</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Outside gutter</td>
                <td className="py-3 px-4 text-sm">24px</td>
                <td className="py-3 px-4 text-sm">32px</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
