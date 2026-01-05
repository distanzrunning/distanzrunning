import Image from "next/image";

export default function GridLayout() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">Grid</p>
        <h1
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
          id="grid-layout"
        >
          Grid layout
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      {/* Column Grid Section */}
      <section>
        <h2
          id="column-grid"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Column grid
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-4">
          Distanz uses a 12-column grid system. This is the industry standard
          because 12 divides evenly into halves, thirds, quarters, and sixths -
          providing flexibility while maintaining visual harmony.
        </p>
        <p className="text-base text-textSubtle mb-4">
          On mobile, the grid simplifies to 4 columns. Column widths are fluid
          while gaps and gutters remain fixed. Content is constrained to a
          max-width of 1585px.
        </p>
        <p className="text-base text-textSubtle mb-8">
          This single, consistent grid applies across all pages - ensuring
          recognisable consistency and clear wayfinding throughout the site.
        </p>

        {/* Columns Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Columns
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Breakpoint
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Gap
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Outside gutter
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">4</td>
                <td className="py-3 px-4 text-sm">Less than 768px</td>
                <td className="py-3 px-4 text-sm">16px</td>
                <td className="py-3 px-4 text-sm">24px</td>
                <td className="py-3 px-4 text-sm font-mono">default</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">12</td>
                <td className="py-3 px-4 text-sm">768px and above</td>
                <td className="py-3 px-4 text-sm">16px</td>
                <td className="py-3 px-4 text-sm">32px</td>
                <td className="py-3 px-4 text-sm font-mono">md:</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Common Layouts */}
        <h3
          id="column-grid-common-layouts"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Common layouts
        </h3>

        <p className="text-base text-textSubtle mb-6">
          The 12-column grid enables consistent layout patterns across the site.
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Layout
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Column span
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Use case
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Full width</td>
                <td className="py-3 px-4 text-sm font-mono">col-span-12</td>
                <td className="py-3 px-4 text-sm">
                  Hero images, full-bleed sections
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Content centered</td>
                <td className="py-3 px-4 text-sm font-mono">
                  col-start-3 col-span-8
                </td>
                <td className="py-3 px-4 text-sm">
                  Article body, focused reading
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Two equal</td>
                <td className="py-3 px-4 text-sm font-mono">col-span-6</td>
                <td className="py-3 px-4 text-sm">Side-by-side comparisons</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Three equal</td>
                <td className="py-3 px-4 text-sm font-mono">col-span-4</td>
                <td className="py-3 px-4 text-sm">Card grids, feature lists</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Four equal</td>
                <td className="py-3 px-4 text-sm font-mono">col-span-3</td>
                <td className="py-3 px-4 text-sm">Product grids, thumbnails</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Sidebar + content</td>
                <td className="py-3 px-4 text-sm font-mono">
                  col-span-2 + col-span-10
                </td>
                <td className="py-3 px-4 text-sm">
                  Navigation sidebar layouts
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Primary + secondary</td>
                <td className="py-3 px-4 text-sm font-mono">
                  col-span-8 + col-span-4
                </td>
                <td className="py-3 px-4 text-sm">
                  Featured article + news sidebar
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* 4 columns (mobile) */}
        <p className="text-base font-semibold mb-4">4-column grid (mobile)</p>
        <figure className="mb-8">
          <Image
            src="/images/design-system/grid-4col-mobile.svg"
            alt="4-column grid with 24px outside gutters for mobile screens"
            width={375}
            height={280}
          />
        </figure>

        <hr className="border-t border-borderDefault mb-8" />

        {/* 12 columns (desktop) */}
        <p className="text-base font-semibold mb-4">12-column grid (desktop)</p>
        <figure className="mb-8 max-w-[788px]">
          <Image
            src="/images/design-system/grid-12col-desktop.svg"
            alt="12-column grid with 32px outside gutters for desktop screens"
            width={788}
            height={280}
          />
        </figure>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Main Wrapper Section */}
      <section>
        <h2
          id="main-wrapper"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Main wrapper
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-4">
          The main wrapper is the outermost layout container that frames all
          page content. It creates a centered, max-width container with vertical
          borders on larger screens, inspired by editorial layouts.
        </p>
        <p className="text-base text-textSubtle mb-8">
          On mobile, the wrapper spans full width with no borders. On screens
          768px and above, it gains left and right borders and centers within
          the viewport up to a max-width of 1585px.
        </p>

        {/* Main Wrapper Diagram */}
        <figure className="mb-8">
          <Image
            src="/images/design-system/main-wrapper.svg"
            alt="Main wrapper structure showing viewport, margins, borders, and content area"
            width={788}
            height={280}
          />
        </figure>

        <hr className="border-t border-borderDefault mb-8" />

        {/* CSS Classes Table */}
        <h3
          id="main-wrapper-classes"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          CSS classes
        </h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  CSS
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm font-mono">main-wrapper</td>
                <td className="py-3 px-4 text-sm">
                  Outer container with max-width: 1585px, centered with auto
                  margins
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm font-mono">main-bordered</td>
                <td className="py-3 px-4 text-sm">
                  Inner container with left/right borders on screens &ge;768px
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm font-mono">v-sep</td>
                <td className="py-3 px-4 text-sm">
                  Utility class for vertical separator borders only (no width
                  constraint)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Responsive Behavior Table */}
        <h3
          id="main-wrapper-responsive"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Responsive behavior
        </h3>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Screen size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Width
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Borders
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Less than 768px</td>
                <td className="py-3 px-4 text-sm">100% (full width)</td>
                <td className="py-3 px-4 text-sm">None</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">768px to 1585px</td>
                <td className="py-3 px-4 text-sm">100% (full width)</td>
                <td className="py-3 px-4 text-sm">Left and right borders</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Greater than 1585px</td>
                <td className="py-3 px-4 text-sm">1585px (centered)</td>
                <td className="py-3 px-4 text-sm">Left and right borders</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault mb-8" />

        {/* Usage Example */}
        <h3
          id="main-wrapper-usage"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Usage
        </h3>

        <div className="bg-surfaceSubtle p-4 rounded mb-8 overflow-x-auto">
          <pre className="text-sm font-mono text-textDefault">
            {`<div class="main-wrapper">
  <div class="main-bordered">
    <!-- Navbar -->
    <!-- Main content -->
    <!-- Footer -->
  </div>
</div>`}
          </pre>
        </div>
      </section>

      <hr className="border-t-4 border-textDefault" />

      {/* Resources Section */}
      <section>
        <h2
          id="resources"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Resources
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <h3
          id="resources-figma-files"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          Figma files
        </h3>

        <p className="text-base text-textSubtle mb-8">
          Figma grid templates for Distanz layouts. Each artboard includes
          pre-configured column grids with correct spacing.
        </p>

        {/* Artboards Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Artboard
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Width
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Columns
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Gap / Gutter
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Borders
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Tailwind
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Mobile</td>
                <td className="py-3 px-4 text-sm">375px</td>
                <td className="py-3 px-4 text-sm">4</td>
                <td className="py-3 px-4 text-sm">16px / 32px</td>
                <td className="py-3 px-4 text-sm">None</td>
                <td className="py-3 px-4 text-sm font-mono">default</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Small</td>
                <td className="py-3 px-4 text-sm">640px</td>
                <td className="py-3 px-4 text-sm">4</td>
                <td className="py-3 px-4 text-sm">16px / 32px</td>
                <td className="py-3 px-4 text-sm">None</td>
                <td className="py-3 px-4 text-sm font-mono">sm:</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Medium</td>
                <td className="py-3 px-4 text-sm">768px</td>
                <td className="py-3 px-4 text-sm">12</td>
                <td className="py-3 px-4 text-sm">16px / 32px</td>
                <td className="py-3 px-4 text-sm">Left + Right</td>
                <td className="py-3 px-4 text-sm font-mono">md:</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Large</td>
                <td className="py-3 px-4 text-sm">1024px</td>
                <td className="py-3 px-4 text-sm">12</td>
                <td className="py-3 px-4 text-sm">16px / 32px</td>
                <td className="py-3 px-4 text-sm">Left + Right</td>
                <td className="py-3 px-4 text-sm font-mono">lg:</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Extra Large</td>
                <td className="py-3 px-4 text-sm">1280px</td>
                <td className="py-3 px-4 text-sm">12</td>
                <td className="py-3 px-4 text-sm">16px / 32px</td>
                <td className="py-3 px-4 text-sm">Left + Right</td>
                <td className="py-3 px-4 text-sm font-mono">xl:</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">2XL</td>
                <td className="py-3 px-4 text-sm">1536px</td>
                <td className="py-3 px-4 text-sm">12</td>
                <td className="py-3 px-4 text-sm">16px / 32px</td>
                <td className="py-3 px-4 text-sm">Left + Right</td>
                <td className="py-3 px-4 text-sm font-mono">2xl:</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm">Max</td>
                <td className="py-3 px-4 text-sm">1585px</td>
                <td className="py-3 px-4 text-sm">12</td>
                <td className="py-3 px-4 text-sm">16px / 32px</td>
                <td className="py-3 px-4 text-sm">Left + Right</td>
                <td className="py-3 px-4 text-sm font-mono">max-w-[1585px]</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-t border-borderDefault my-8" />

        {/* CSS Variables */}
        <h3
          id="resources-css-variables"
          className="font-serif text-[22px] leading-[1.3] font-medium mb-3 scroll-mt-32"
        >
          CSS variables
        </h3>

        <p className="text-base text-textSubtle mb-4">
          Grid spacing is defined as CSS custom properties for consistent use
          across the codebase.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-borderDefault">
                <th className="text-left py-3 pr-4 font-semibold text-sm">
                  Variable
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm font-mono">--grid-gap</td>
                <td className="py-3 px-4 text-sm">1rem (16px)</td>
                <td className="py-3 px-4 text-sm">
                  Spacing between elements within components
                </td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4 text-sm font-mono">--grid-gutter</td>
                <td className="py-3 px-4 text-sm">2rem (32px)</td>
                <td className="py-3 px-4 text-sm">
                  Column spacing in grid layouts
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
