import Image from "next/image";

export default function GridSpacing() {
  // Spacing scale data aligned with design-tokens.ts
  const spacingScale = [
    { token: "0", px: 0, rem: "0", usage: "Reset, no spacing" },
    {
      token: "0.5",
      px: 2,
      rem: "0.125",
      usage: "Micro adjustments, icon gaps",
    },
    { token: "1", px: 4, rem: "0.25", usage: "Fine-tuning, tight spacing" },
    { token: "2", px: 8, rem: "0.5", usage: "Base unit, compact elements" },
    { token: "3", px: 12, rem: "0.75", usage: "Small gap, grid gap (mobile)" },
    { token: "4", px: 16, rem: "1", usage: "Standard gap, grid gap (desktop)" },
    {
      token: "6",
      px: 24,
      rem: "1.5",
      usage: "Medium spacing, gutter (mobile)",
    },
    { token: "8", px: 32, rem: "2", usage: "Large spacing, gutter (desktop)" },
    { token: "10", px: 40, rem: "2.5", usage: "Section padding" },
    { token: "12", px: 48, rem: "3", usage: "Component separation" },
    { token: "16", px: 64, rem: "4", usage: "Large section gaps" },
    { token: "20", px: 80, rem: "5", usage: "Major section spacing" },
    { token: "24", px: 96, rem: "6", usage: "Page section spacing" },
    { token: "32", px: 128, rem: "8", usage: "Maximum spacing" },
  ];

  return (
    <div className="space-y-4">
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

      {/* Spacing Scale Section */}
      <section>
        <h2
          id="spacing-scale"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Spacing scale
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-4">
          A systematic spacing scale based on an 8px grid. The base unit is 8px
          (spacing-2), with 4px increments available for fine-tuning and 2px for
          micro adjustments.
        </p>

        <div className="bg-surfaceWarm border-l-4 border-electric-pink p-6 mb-8">
          <h3 className="font-sans font-semibold text-sm uppercase tracking-wide text-textDefault mb-2">
            Grid System
          </h3>
          <ul className="text-sm text-textSubtle leading-relaxed space-y-1">
            <li>
              <strong>Primary grid:</strong> 8px increments (spacing-2, 4, 6,
              8...)
            </li>
            <li>
              <strong>Fine-tuning:</strong> 4px increments (spacing-1, 3, 5...)
            </li>
            <li>
              <strong>Micro adjustments:</strong> 2px (spacing-0.5)
            </li>
          </ul>
        </div>

        {/* Visual spacing scale */}
        <div className="bg-surfaceSubtle p-6 mb-8 space-y-3">
          {spacingScale.slice(1, 9).map((item) => (
            <div key={item.token} className="flex items-center gap-4">
              <span className="font-mono text-sm text-textSubtle w-8">
                {item.token}
              </span>
              <div
                className="bg-electric-pink h-4"
                style={{ width: `${item.px}px` }}
              />
              <span className="text-sm text-textSubtle">{item.px}px</span>
            </div>
          ))}
        </div>

        {/* Spacing reference table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Token
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
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              {spacingScale.map((item) => (
                <tr key={item.token} className="border-b border-borderSubtle">
                  <td className="py-3 pr-4 font-mono">spacing-{item.token}</td>
                  <td className="py-3 px-4">{item.px}</td>
                  <td className="py-3 px-4">{item.rem}</td>
                  <td className="py-3 px-4 font-mono">
                    p-{item.token}, m-{item.token}, gap-{item.token}
                  </td>
                  <td className="py-3 px-4 text-textSubtle">{item.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

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
          Grid gutter (medium screen, ≥600px) — 6 columns, 24px gutter
        </p>
        <figure className="mb-8">
          <Image
            src="/images/design-system/grid-6col-24.svg"
            alt="6-column grid with 24px gutters"
            width={600}
            height={312}
            className="w-full max-w-[600px] h-auto"
          />
        </figure>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Grid gutter (large screen, 12 columns) */}
        <p className="text-base font-semibold mb-4">
          Grid gutter (large screen, ≥960px) — 12 columns, 32px gutter
        </p>
        <figure className="mb-8">
          <Image
            src="/images/design-system/grid-12col-32-edged.svg"
            alt="12-column grid with 32px gutters"
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
