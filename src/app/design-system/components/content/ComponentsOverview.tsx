export default function ComponentsOverview() {
  return (
    <article className="space-y-4">
      {/* Title */}
      <div>
        <p className="text-sm tracking-wide text-electric-pink mb-2">
          Components
        </p>
        <h1
          id="overview"
          className="font-serif text-[40px] leading-[1.15] font-medium mb-0"
        >
          Overview
        </h1>
      </div>

      <p className="text-base text-textSubtle max-w-3xl">
        Components are the basic building blocks of the design system. They are
        completely modular and independent of pages, groups or context until
        combined, when they begin to form patterns and a meaningful interface.
      </p>
    </article>
  );
}
