export default function PatternsOverview() {
  return (
    <article className="space-y-8">
      {/* Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Patterns
        </p>
        <h1
          id="overview"
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
        >
          Overview
        </h1>
      </div>

      <p className="text-base text-textSubtle max-w-3xl">
        Patterns are recurring solutions to common design problems. They combine
        multiple components into cohesive, reusable structures that maintain
        consistency across the interface while solving specific user needs.
      </p>
    </article>
  );
}
