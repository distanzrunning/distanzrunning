export default function DesignPrinciples() {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Principles
        </p>
        <h1 className="font-serif text-[40px] leading-[1.15] font-medium mb-0">
          Design principles
        </h1>
      </div>

      <hr className="border-t-4 border-gray-1000" />

      <p className="text-base text-gray-900 max-w-3xl">
        A set of considerations that guide our design process and
        decision-making.
      </p>

      {/* Principles Section */}
      <section>
        {/* Principle 1 */}
        <h2
          id="less-is-more"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Less is more
        </h2>
        <hr className="border-t border-gray-400 mb-6" />
        <p className="text-base text-gray-900 max-w-3xl mb-8">
          Be concise. Make it readily understandable and unobtrusive. Our design
          language is unburdened by decoration. Focus on the essential through
          iteration and reduction.
        </p>

        {/* Principle 2 */}
        <h2
          id="deliberate-typography"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Deliberate typography
        </h2>
        <hr className="border-t border-gray-400 mb-6" />
        <p className="text-base text-gray-900 max-w-3xl mb-8">
          Our content is augmented by strong typography. Create contrast with
          different weights and letterforms. Use complimentary sizes and leading
          to ensure legibility. Avoid excessive or arbitrary styles. No detail
          is too small.
        </p>

        {/* Principle 3 */}
        <h2
          id="visual-harmony"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Visual harmony
        </h2>
        <hr className="border-t border-gray-400 mb-6" />
        <p className="text-base text-gray-900 max-w-3xl mb-8">
          We strive for visual and conceptual balance. Our grid system supports
          recognisable patterns through symmetry and proximity. Our colour
          palette is considered and restrained. Imagery is purposeful, adding
          context and emotion to a story.
        </p>

        {/* Principle 4 */}
        <h2
          id="clear-wayfinding"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Clear wayfinding
        </h2>
        <hr className="border-t border-gray-400 mb-6" />
        <p className="text-base text-gray-900 max-w-3xl mb-8">
          Well-structured paths guide people through our products. Landmarks
          help them move forward. Keep journeys focused by not including more
          options than necessary. Our wayfinding relies on clear visual
          affordances that ensure an element&apos;s function is obvious.
        </p>

        {/* Principle 5 */}
        <h2
          id="performance-and-precision"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Performance and precision
        </h2>
        <hr className="border-t border-gray-400 mb-6" />
        <p className="text-base text-gray-900 max-w-3xl mb-8">
          Data demands accuracy. Maps, charts, and metrics must be presented
          with precision and clarity. Every element serves a purpose. Fast,
          responsive interfaces ensure seamless interaction with tools.
          Precision in spacing, alignment, and data visualization creates trust
          and reliability.
        </p>

        {/* Principle 6 */}
        <h2
          id="recognisable-consistency"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Recognisable consistency
        </h2>
        <hr className="border-t border-gray-400 mb-6" />
        <p className="text-base text-gray-900 max-w-3xl">
          Consistency across our products is vital for providing a reliable
          experience and upholding a strong brand reputation. Across all
          touchpoints, our community deserves the same high standard of quality
          in design as in our content.
        </p>
      </section>
    </div>
  );
}
