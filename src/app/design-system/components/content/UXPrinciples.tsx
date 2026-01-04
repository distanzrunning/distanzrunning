export default function UXPrinciples() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <p className="text-sm uppercase tracking-wide text-textSubtle mb-4">Principles</p>
        <h1 className="font-serif text-[40px] leading-[1.15] font-medium mb-4">
          UX principles
        </h1>
        <p className="text-lg text-textSubtle max-w-3xl">
          Guidelines for creating intuitive, accessible, and engaging user experiences.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-borderNeutral"></div>

      {/* Principles Section */}
      <div className="space-y-8">
        <h2 className="font-serif text-[32px] leading-[1.2] font-medium">
          Our UX principles
        </h2>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 1 */}
        <div className="space-y-4">
          <h3 className="font-serif text-[24px] leading-[1.3] font-medium">
            User-centred design
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Put the athlete first. Understand their goals, data needs, and how they interact with training tools. Design with empathy, creating experiences that feel personal and supportive rather than prescriptive.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 2 */}
        <div className="space-y-4">
          <h3 className="font-serif text-[24px] leading-[1.3] font-medium">
            Accessible to all
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Training data and tools should be accessible to everyone. Ensure interfaces are usable across abilities, devices, and contexts. Clear contrast, readable typography, and intuitive navigation are essential for analyzing performance metrics.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 3 */}
        <div className="space-y-4">
          <h3 className="font-serif text-[24px] leading-[1.3] font-medium">
            Progressive disclosure
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Present data when it's needed. Don't overwhelm users with everything at once. Show key metrics prominently, with detailed analytics available on demand. Reveal complexity gradually as users explore deeper into their training data.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 4 */}
        <div className="space-y-4">
          <h3 className="font-serif text-[24px] leading-[1.3] font-medium">
            Feedback and response
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Every action deserves acknowledgment. Provide clear, immediate feedback for user interactions. Communicate system status, confirm actions, and guide users through errors with helpful messaging.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 5 */}
        <div className="space-y-4">
          <h3 className="font-serif text-[24px] leading-[1.3] font-medium">
            Consistency and familiarity
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Leverage established patterns and conventions. Users shouldn't need to learn new behaviors for common tasks. Consistent interactions across the platform build confidence and reduce cognitive load.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-borderNeutral"></div>

        {/* Principle 6 */}
        <div className="space-y-4">
          <h3 className="font-serif text-[24px] leading-[1.3] font-medium">
            Respect time and attention
          </h3>
          <p className="text-base text-textDefault max-w-3xl">
            Athletes value efficiency. Minimize steps to access data and insights. Reduce friction in critical workflows like route planning and activity analysis. Make information easy to scan and digest. Every moment saved in the tools is a moment they can spend training.
          </p>
        </div>
      </div>
    </div>
  );
}
