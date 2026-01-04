export default function DesignPrinciples() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-4">Principles</p>
        <h1 className="font-serif text-[40px] leading-[1.15] font-medium mb-4">
          Design principles
        </h1>
        <p className="text-lg text-textSubtle max-w-3xl">
          A set of considerations that guide our design process and decision-making.
        </p>
      </div>

      {/* Divider - Black instead of grey */}
      <div className="border-t border-textDefault"></div>

      {/* Principles Section */}
      <div className="space-y-8">
        <h2 id="our-principles" className="font-serif text-[32px] leading-[1.2] font-medium scroll-mt-32">
          Our principles
        </h2>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 1 */}
        <div className="space-y-4">
          <h3 id="less-is-more" className="font-serif text-[24px] leading-[1.3] font-medium scroll-mt-32">
            Less is more
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Be concise. Make it readily understandable and unobtrusive. Our design language is unburdened by decoration. Focus on the essential through iteration and reduction.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 2 */}
        <div className="space-y-4">
          <h3 id="deliberate-typography" className="font-serif text-[24px] leading-[1.3] font-medium scroll-mt-32">
            Deliberate typography
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Our content is augmented by strong typography. Create contrast with different weights and letterforms. Use complimentary sizes and leading to ensure legibility. Avoid excessive or arbitrary styles. No detail is too small.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 3 */}
        <div className="space-y-4">
          <h3 id="visual-harmony" className="font-serif text-[24px] leading-[1.3] font-medium scroll-mt-32">
            Visual harmony
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            We strive for visual and conceptual balance. Our grid system supports recognisable patterns through symmetry and proximity. Our colour palette is considered and restrained. Imagery is purposeful, adding context and emotion to a story.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 4 */}
        <div className="space-y-4">
          <h3 id="clear-wayfinding" className="font-serif text-[24px] leading-[1.3] font-medium scroll-mt-32">
            Clear wayfinding
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Well-structured paths guide people through our products. Landmarks help them move forward. Keep journeys focused by not including more options than necessary. Our wayfinding relies on clear visual affordances that ensure an element's function is obvious.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 5 */}
        <div className="space-y-4">
          <h3 id="performance-and-precision" className="font-serif text-[24px] leading-[1.3] font-medium scroll-mt-32">
            Performance and precision
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Data demands accuracy. Maps, charts, and metrics must be presented with precision and clarity. Every element serves a purpose. Fast, responsive interfaces ensure seamless interaction with tools. Precision in spacing, alignment, and data visualization creates trust and reliability.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 6 */}
        <div className="space-y-4">
          <h3 id="recognisable-consistency" className="font-serif text-[24px] leading-[1.3] font-medium scroll-mt-32">
            Recognisable consistency
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Consistency across our products is vital for providing a reliable experience and upholding a strong brand reputation. Across all touchpoints, our community deserves the same high standard of quality in design as in our content.
          </p>
        </div>
      </div>
    </div>
  );
}
