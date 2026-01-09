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

        {/* Grid Gap Subsection */}
        <h3
          id="gap-and-gutter-grid-gap"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Grid gap
        </h3>
        <p className="text-base text-textSubtle mb-6">
          Grid gap is the standard spacing between elements.
        </p>

        {/* Grid Gap SVG Diagrams - Side by side like Economist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <figure>
            <Image
              src="/images/design-system/grid-component-gap.svg"
              alt="Vertical gap between form elements showing 12px and 16px spacing"
              width={386}
              height={232}
              className="w-full h-auto"
            />
          </figure>
          <figure>
            <Image
              src="/images/design-system/grid-component-optical.svg"
              alt="Horizontal gap between buttons showing 12px and 16px spacing"
              width={386}
              height={232}
              className="w-full h-auto"
            />
          </figure>
        </div>

        {/* Grid Gap Table with rowspan */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Grid gap
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
                <td className="py-3 pr-4 text-sm">Less than 960px (60rem)</td>
                <td className="py-3 px-4 text-sm">12</td>
                <td className="py-3 px-4 text-sm">0.75</td>
                <td className="py-3 px-4 text-sm font-mono" rowSpan={2}>
                  --grid-gap
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">
                  Greater than or equal to 960px (60rem)
                </td>
                <td className="py-3 px-4 text-sm">16</td>
                <td className="py-3 px-4 text-sm">1</td>
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
          Grid gutter is the space between grid columns, 2x the value of the
          gap.
        </p>

        {/* Grid Gutter Table with rowspan */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Grid gutter
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
                <td className="py-3 pr-4 text-sm">Less than 960px (60rem)</td>
                <td className="py-3 px-4 text-sm">24</td>
                <td className="py-3 px-4 text-sm">1.5</td>
                <td className="py-3 px-4 text-sm font-mono" rowSpan={2}>
                  --grid-gutter
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">
                  Greater than or equal to 960px (60rem)
                </td>
                <td className="py-3 px-4 text-sm">32</td>
                <td className="py-3 px-4 text-sm">2</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Grid gutter (medium screen, 6 columns) */}
        <p className="text-base font-semibold mb-4">
          Grid gutter (medium screen, ≥600px) — 6 columns, 12px gap
        </p>
        <figure className="mb-8">
          <Image
            src="/images/design-system/grid-6col-24.svg"
            alt="6-column grid with 12px gutters"
            width={600}
            height={312}
            className="w-full max-w-[600px] h-auto"
          />
        </figure>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Grid gutter (large screen, 12 columns) */}
        <p className="text-base font-semibold mb-4">
          Grid gutter (large screen, ≥960px) — 12 columns, 16px gap
        </p>
        <figure className="mb-8">
          <Image
            src="/images/design-system/grid-12col-32-edged.svg"
            alt="12-column grid with 16px gutters"
            width={960}
            height={312}
            className="w-full max-w-[960px] h-auto"
          />
        </figure>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Component gutters */}
        <p className="text-base font-semibold mb-4">Component gutters</p>
        <figure className="mb-8">
          <Image
            src="/images/design-system/grid-component-gutter.svg"
            alt="Component gutter spacing between buttons showing 24px and 32px"
            width={386}
            height={232}
            className="w-full max-w-[386px] h-auto"
          />
        </figure>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Outside gutter */}
        <p className="text-base font-semibold mb-4">Outside gutter</p>
        <p className="text-base text-textSubtle mb-6">
          Outside gutters provide padding between the grid and the viewport
          edge. They use the same values as the column gutter.
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Outside gutter
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
                <td className="py-3 pr-4 text-sm">Less than 960px (60rem)</td>
                <td className="py-3 px-4 text-sm">24</td>
                <td className="py-3 px-4 text-sm">1.5</td>
                <td className="py-3 px-4 text-sm font-mono" rowSpan={2}>
                  --grid-outside-gutter
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">
                  Greater than or equal to 960px (60rem)
                </td>
                <td className="py-3 px-4 text-sm">32</td>
                <td className="py-3 px-4 text-sm">2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
