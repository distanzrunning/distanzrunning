export default function ComponentsOverview() {
  return (
    <article className="space-y-4">
      {/* Title */}
      <div>
        <p className="text-copy-14 tracking-wide text-textSubtle mb-2">
          Components
        </p>
        <h1
          id="overview"
          className="text-heading-40 font-serif mb-0"
        >
          Overview
        </h1>
      </div>

      <p className="text-copy-16 text-textSubtle max-w-3xl">
        Components are the basic building blocks of the design system. They are
        completely modular and independent of pages, groups or context until
        combined, when they begin to form patterns and a meaningful interface.
      </p>
    </article>
  );
}
