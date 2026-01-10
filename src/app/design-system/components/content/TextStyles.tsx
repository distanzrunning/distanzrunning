export default function TextStyles() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Typography
        </p>
        <h1
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
          id="text-styles"
        >
          Text styles
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      <p className="text-base text-textSubtle">
        A complete hierarchy of text styles combining typeface, size, weight,
        and line-height into reusable patterns. These styles ensure consistent
        typography across the entire design system.
      </p>

      {/* Display Styles Section */}
      <section>
        <h2
          id="display"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Display
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Large-scale typography for hero sections and feature headlines. Uses
          the serif typeface for editorial impact. Display styles use fluid
          typography that scales smoothly between mobile and desktop viewports.
        </p>

        {/* Display Large */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <p className="font-serif text-display-large leading-[1.05] font-medium">
              The Art of the Long Run
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Display Large</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">EB Garamond (serif)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">clamp(48px, 7vw, 84px)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">500 (medium)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Line-height</td>
                  <td className="py-2 px-4">1.05</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-serif text-display-large font-medium
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">Hero headlines, feature openers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* Display */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <p className="font-serif text-display leading-[1.1] font-medium">
              Breaking Through the Wall
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Display</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">EB Garamond (serif)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">clamp(40px, 6vw, 72px)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">500 (medium)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Line-height</td>
                  <td className="py-2 px-4">1.1</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-serif text-display font-medium
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">
                    Secondary heroes, article headlines
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Headings Section */}
      <section>
        <h2
          id="headings"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Headings
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Hierarchical heading styles for structuring content. All headings use
          the serif typeface with medium weight for editorial character.
          Headings use fluid typography that scales between mobile and desktop.
        </p>

        {/* H1 */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <h1 className="font-serif text-h1 font-medium">Page Title</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Heading 1</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">EB Garamond (serif)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">clamp(36px, 5vw, 68px)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">500 (medium)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Line-height</td>
                  <td className="py-2 px-4">1.1</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-serif text-h1 font-medium
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">Page titles, main headings</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* H2 */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <h2 className="font-serif text-h2 font-medium">Section Heading</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Heading 2</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">EB Garamond (serif)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">clamp(32px, 4.5vw, 58px)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">500 (medium)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Line-height</td>
                  <td className="py-2 px-4">1.15</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-serif text-h2 font-medium
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">Section headings, TOC entries</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* H3 */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <h3 className="font-serif text-h3 font-medium">
              Subsection Heading
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Heading 3</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">EB Garamond (serif)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">clamp(28px, 3.5vw, 44px)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">500 (medium)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Line-height</td>
                  <td className="py-2 px-4">1.2</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-serif text-h3 font-medium
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">
                    Subsections, card titles, sidebar headings
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Body Section */}
      <section>
        <h2
          id="body"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Body
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Body text styles for paragraphs and general content. Uses the
          sans-serif typeface for optimal screen readability.
        </p>

        {/* Body Large */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <p className="font-sans text-[18px] leading-[1.6] text-textDefault">
              Running is more than a sport—it&apos;s a way of life. Every step
              forward is a testament to dedication, discipline, and the pursuit
              of personal excellence.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Body Large</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">Inter (sans)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">18px</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">400 (regular)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Line-height</td>
                  <td className="py-2 px-4">1.6</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-sans text-lg leading-relaxed
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">Lead paragraphs, introductions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* Body */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <p className="font-sans text-base leading-[1.5] text-textDefault">
              The marathon is a test of endurance that has captivated athletes
              for over a century. From the streets of Boston to the trails of
              the Rockies, runners push their limits in pursuit of the finish
              line.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Body</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">Inter (sans)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">16px</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">400 (regular)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Line-height</td>
                  <td className="py-2 px-4">1.5</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-sans text-base leading-normal
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">
                    Paragraphs, descriptions, general content
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* Body Small */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <p className="font-sans text-sm leading-[1.5] text-textSubtle">
              Photo by James Chen. Marathon runners cross the Verrazzano-Narrows
              Bridge during the 2024 New York City Marathon.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Body Small</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">Inter (sans)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">14px</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">400 (regular)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Line-height</td>
                  <td className="py-2 px-4">1.5</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Color</td>
                  <td className="py-2 px-4">textSubtle</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-sans text-sm leading-normal text-textSubtle
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">
                    Captions, metadata, helper text, timestamps
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* UI Section */}
      <section>
        <h2
          id="ui"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          UI
        </h2>

        <hr className="border-t border-borderDefault mb-6" />

        <p className="text-base text-textSubtle mb-6">
          Interface text styles for labels, buttons, navigation, and interactive
          elements. Designed for clarity and scanability.
        </p>

        {/* Label */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <p className="font-sans text-sm font-medium text-textDefault">
              Email address
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Label</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">Inter (sans)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">14px</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">500 (medium)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-sans text-sm font-medium
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">Form labels, field names</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* Overline */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <p className="font-sans text-xs font-medium uppercase tracking-wide text-electric-pink">
              Training
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Overline</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">Inter (sans)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">12px</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">500 (medium)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Transform</td>
                  <td className="py-2 px-4">uppercase</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tracking</td>
                  <td className="py-2 px-4">wide (0.025em)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-sans text-xs font-medium uppercase tracking-wide
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">
                    Category labels, section identifiers, tags
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-t border-borderSubtle mb-8" />

        {/* Button */}
        <div className="mb-8">
          <div className="bg-surfaceSubtle p-6 mb-4">
            <span className="inline-block font-sans text-sm font-semibold px-4 py-2 bg-electric-pink text-white rounded">
              Subscribe
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody className="text-sm whitespace-nowrap">
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle w-24">Style</td>
                  <td className="py-2 px-4 font-medium">Button</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Typeface</td>
                  <td className="py-2 px-4">Inter (sans)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Size</td>
                  <td className="py-2 px-4">14px</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Weight</td>
                  <td className="py-2 px-4">600 (semibold)</td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Tailwind</td>
                  <td className="py-2 px-4 font-mono text-xs">
                    font-sans text-sm font-semibold
                  </td>
                </tr>
                <tr className="border-b border-borderSubtle">
                  <td className="py-2 pr-4 text-textSubtle">Usage</td>
                  <td className="py-2 px-4">
                    Buttons, CTAs, interactive controls
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <hr className="border-t border-borderDefault" />

      {/* Reference Section */}
      <section>
        <h2
          id="reference"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Quick reference
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
                  Font
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Weight
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Line-height
                </th>
              </tr>
            </thead>
            <tbody className="text-sm whitespace-nowrap">
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Display Large</td>
                <td className="py-3 px-4">Serif</td>
                <td className="py-3 px-4">48–84px</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">1.05</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Display</td>
                <td className="py-3 px-4">Serif</td>
                <td className="py-3 px-4">40–72px</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">1.1</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Heading 1</td>
                <td className="py-3 px-4">Serif</td>
                <td className="py-3 px-4">36–68px</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">1.1</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Heading 2</td>
                <td className="py-3 px-4">Serif</td>
                <td className="py-3 px-4">32–58px</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">1.15</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Heading 3</td>
                <td className="py-3 px-4">Serif</td>
                <td className="py-3 px-4">28–44px</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">1.2</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Heading 4</td>
                <td className="py-3 px-4">Serif</td>
                <td className="py-3 px-4">24–38px</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">1.2</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Heading 5</td>
                <td className="py-3 px-4">Serif</td>
                <td className="py-3 px-4">20–28px</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">1.2</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Heading 6</td>
                <td className="py-3 px-4">Serif</td>
                <td className="py-3 px-4">18–24px</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">1.2</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Body Large</td>
                <td className="py-3 px-4">Sans</td>
                <td className="py-3 px-4">18px</td>
                <td className="py-3 px-4">400</td>
                <td className="py-3 px-4">1.6</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Body</td>
                <td className="py-3 px-4">Sans</td>
                <td className="py-3 px-4">16px</td>
                <td className="py-3 px-4">400</td>
                <td className="py-3 px-4">1.5</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Body Small</td>
                <td className="py-3 px-4">Sans</td>
                <td className="py-3 px-4">14px</td>
                <td className="py-3 px-4">400</td>
                <td className="py-3 px-4">1.5</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Label</td>
                <td className="py-3 px-4">Sans</td>
                <td className="py-3 px-4">14px</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">1.4</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Overline</td>
                <td className="py-3 px-4">Sans</td>
                <td className="py-3 px-4">12px</td>
                <td className="py-3 px-4">500</td>
                <td className="py-3 px-4">1.4</td>
              </tr>
              <tr className="border-b border-borderSubtle">
                <td className="py-3 pr-4">Button</td>
                <td className="py-3 px-4">Sans</td>
                <td className="py-3 px-4">14px</td>
                <td className="py-3 px-4">600</td>
                <td className="py-3 px-4">1.4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
