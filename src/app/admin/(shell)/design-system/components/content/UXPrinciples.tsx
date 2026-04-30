export default function UXPrinciples() {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Principles
        </p>
        <h1 className="font-serif text-[40px] leading-[1.15] font-medium mb-0">
          UX principles
        </h1>
      </div>

      <hr className="border-t-4 border-textDefault" />

      <p className="text-base text-textSubtle max-w-3xl">
        Guidelines for creating intuitive, accessible, and engaging user
        experiences.
      </p>

      {/* Principles Section */}
      <section>
        {/* Principle 1 */}
        <h2
          id="user-centred-design"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          User-centred design
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <p className="text-base text-textSubtle max-w-3xl mb-8">
          Put the athlete first. Understand their goals, data needs, and how
          they interact with training tools. Design with empathy, creating
          experiences that feel personal and supportive rather than
          prescriptive.
        </p>

        {/* Principle 2 */}
        <h2
          id="accessible-to-all"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Accessible to all
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <p className="text-base text-textSubtle max-w-3xl mb-8">
          Training data and tools should be accessible to everyone. Ensure
          interfaces are usable across abilities, devices, and contexts. Clear
          contrast, readable typography, and intuitive navigation are essential
          for analyzing performance metrics.
        </p>

        {/* Principle 3 */}
        <h2
          id="progressive-disclosure"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Progressive disclosure
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <p className="text-base text-textSubtle max-w-3xl mb-8">
          Present data when it&apos;s needed. Don&apos;t overwhelm users with
          everything at once. Show key metrics prominently, with detailed
          analytics available on demand. Reveal complexity gradually as users
          explore deeper into their training data.
        </p>

        {/* Principle 4 */}
        <h2
          id="feedback-and-response"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Feedback and response
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <p className="text-base text-textSubtle max-w-3xl mb-8">
          Every action deserves acknowledgment. Provide clear, immediate
          feedback for user interactions. Communicate system status, confirm
          actions, and guide users through errors with helpful messaging.
        </p>

        {/* Principle 5 */}
        <h2
          id="consistency-and-familiarity"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Consistency and familiarity
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <p className="text-base text-textSubtle max-w-3xl mb-8">
          Leverage established patterns and conventions. Users shouldn&apos;t
          need to learn new behaviors for common tasks. Consistent interactions
          across the platform build confidence and reduce cognitive load.
        </p>

        {/* Principle 6 */}
        <h2
          id="respect-time-and-attention"
          className="font-serif text-[28px] leading-[1.2] font-medium mb-2 scroll-mt-32"
        >
          Respect time and attention
        </h2>
        <hr className="border-t border-borderDefault mb-6" />
        <p className="text-base text-textSubtle max-w-3xl">
          Athletes value efficiency. Minimize steps to access data and insights.
          Reduce friction in critical workflows like route planning and activity
          analysis. Make information easy to scan and digest. Every moment saved
          in the tools is a moment they can spend training.
        </p>
      </section>
    </div>
  );
}
