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

        <hr className="border-t border-borderDefault mb-8" />

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-[788px]">
          <figure>
            <Image
              src="/images/design-system/grid-component-gap.svg"
              alt="Grid component gap showing 12px and 16px spacing between label and input fields"
              width={386}
              height={232}
            />
          </figure>
          <figure>
            <Image
              src="/images/design-system/grid-component-optical.svg"
              alt="Grid optical spacing showing emphasised link measurements"
              width={386}
              height={232}
            />
          </figure>
        </div>

        {/* Grid Gap Table - Economist style */}
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
                <td className="py-3 pr-4 text-sm">
                  Less than or equal to 600px (37.5rem)
                </td>
                <td className="py-3 px-4 text-sm">12</td>
                <td className="py-3 px-4 text-sm">0.75</td>
                <td className="py-3 px-4 text-sm font-mono" rowSpan={2}>
                  --ds-grid-gap
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">
                  Greater than 600px (37.5rem)
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

        {/* Grid Gutter Table */}
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
                <td className="py-3 pr-4 text-sm">
                  Less than or equal to 600px (37.5rem)
                </td>
                <td className="py-3 px-4 text-sm">24</td>
                <td className="py-3 px-4 text-sm">1.5</td>
                <td className="py-3 px-4 text-sm font-mono" rowSpan={2}>
                  --ds-grid-gutter
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">
                  Greater than 600px (37.5rem)
                </td>
                <td className="py-3 px-4 text-sm">32</td>
                <td className="py-3 px-4 text-sm">2</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Grid gutter (medium screen) */}
        <p className="text-base font-semibold mb-4">
          Grid gutter (medium screen)
        </p>
        <figure className="mb-8">
          <Image
            src="/images/design-system/grid-6col-24.svg"
            alt="6-column grid with 24px gutters for medium screens"
            width={600}
            height={312}
            className="w-full max-w-[600px]"
          />
        </figure>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Grid gutter (large screen) */}
        <p className="text-base font-semibold mb-4">
          Grid gutter (large screen)
        </p>
        <figure className="mb-8">
          <Image
            src="/images/design-system/grid-6col-32.svg"
            alt="6-column grid with 32px gutters for large screens"
            width={640}
            height={312}
            className="w-full max-w-[640px]"
          />
        </figure>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Component gutters */}
        <p className="text-base font-semibold mb-4">Component gutters</p>
        <figure>
          <Image
            src="/images/design-system/grid-component-gutter.svg"
            alt="Component gutters showing 24px and 32px spacing between buttons"
            width={386}
            height={232}
            className="w-full max-w-[386px]"
          />
        </figure>
      </section>
    </div>
  );
}
