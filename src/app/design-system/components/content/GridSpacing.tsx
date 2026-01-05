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
          Distanz uses a responsive spacing system that scales with screen size.
          Gap is the spacing between elements within components. Gutter is the
          space between grid columns, always 2× the gap value.
        </p>
        <p className="text-base text-textSubtle mb-8">
          Smaller spacing on mobile preserves proportional balance, while larger
          spacing on desktop gives content room to breathe.
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
          and horizontal spacing between form fields, buttons, cards, and
          component internals.
        </p>

        {/* Grid Gap SVG Diagrams - Side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-[788px]">
          <figure>
            <Image
              src="/images/design-system/grid-gap-vertical.svg"
              alt="Vertical gap showing spacing between stacked form elements"
              width={386}
              height={232}
            />
          </figure>
          <figure>
            <Image
              src="/images/design-system/grid-gap-horizontal.svg"
              alt="Horizontal gap showing spacing between side-by-side buttons and cards"
              width={386}
              height={232}
            />
          </figure>
        </div>

        {/* Grid Gap Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Screen size
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
                  Token
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Mobile (&lt;768px)</td>
                <td className="py-3 px-4 text-sm">12</td>
                <td className="py-3 px-4 text-sm">0.75</td>
                <td className="py-3 px-4 text-sm font-mono">gap-3</td>
                <td className="py-3 px-4 text-sm font-mono" rowSpan={2}>
                  --grid-gap
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Desktop (768px+)</td>
                <td className="py-3 px-4 text-sm">16</td>
                <td className="py-3 px-4 text-sm">1</td>
                <td className="py-3 px-4 text-sm font-mono">gap-4</td>
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
          Grid gutter is the space between grid columns - always 2× the gap
          value. This creates visual rhythm and ensures content has room to
          breathe.
        </p>

        {/* Grid Gutter Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Screen size
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
                  Token
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Mobile (&lt;768px)</td>
                <td className="py-3 px-4 text-sm">24</td>
                <td className="py-3 px-4 text-sm">1.5</td>
                <td className="py-3 px-4 text-sm font-mono">gap-6</td>
                <td className="py-3 px-4 text-sm font-mono" rowSpan={2}>
                  --grid-gutter
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Desktop (768px+)</td>
                <td className="py-3 px-4 text-sm">32</td>
                <td className="py-3 px-4 text-sm">2</td>
                <td className="py-3 px-4 text-sm font-mono">gap-8</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Grid gutter (mobile) */}
        <p className="text-base font-semibold mb-4">Grid gutter (mobile)</p>
        <figure className="mb-8">
          <Image
            src="/images/design-system/grid-gutter-mobile.svg"
            alt="4-column grid with 24px gutters for mobile screens"
            width={375}
            height={232}
          />
        </figure>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Grid gutter (desktop) */}
        <p className="text-base font-semibold mb-4">Grid gutter (desktop)</p>
        <figure className="mb-8 max-w-[600px]">
          <Image
            src="/images/design-system/grid-gutter-desktop.svg"
            alt="12-column grid with 32px gutters for desktop screens"
            width={600}
            height={232}
          />
        </figure>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Outside Gutter Subsection */}
        <h3
          id="gap-and-gutter-outside-gutter"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Outside gutter
        </h3>
        <p className="text-base text-textSubtle mb-6">
          Outside gutters provide padding between the grid and the viewport
          edge. They use the same responsive values as the column gutter.
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Screen size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  px
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  rem
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Token
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Mobile (&lt;768px)</td>
                <td className="py-3 px-4 text-sm">24</td>
                <td className="py-3 px-4 text-sm">1.5</td>
                <td className="py-3 px-4 text-sm font-mono" rowSpan={2}>
                  --grid-outside-gutter
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Desktop (768px+)</td>
                <td className="py-3 px-4 text-sm">32</td>
                <td className="py-3 px-4 text-sm">2</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Spacing Summary */}
        <h3
          id="gap-and-gutter-summary"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Spacing summary
        </h3>
        <p className="text-base text-textSubtle mb-6">
          All spacing values maintain a consistent 2× relationship between gap
          and gutter across screen sizes.
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
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Relationship
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Gap</td>
                <td className="py-3 px-4 text-sm">12px</td>
                <td className="py-3 px-4 text-sm">16px</td>
                <td className="py-3 px-4 text-sm">Base unit</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Gutter</td>
                <td className="py-3 px-4 text-sm">24px</td>
                <td className="py-3 px-4 text-sm">32px</td>
                <td className="py-3 px-4 text-sm">2× gap</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Outside gutter</td>
                <td className="py-3 px-4 text-sm">24px</td>
                <td className="py-3 px-4 text-sm">32px</td>
                <td className="py-3 px-4 text-sm">= gutter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
