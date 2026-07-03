import Masthead from "@/components/Masthead";

// Homepage — rebuilt from scratch. Renders bare (LayoutContent gives it a
// full-height <main> with no production chrome + the site-wide announcement
// bar), so the homepage owns its own header (Masthead) + sections below.
export default function HomePage() {
  return (
    <>
      <Masthead />
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        {/* Homepage sections build here. */}
      </div>
    </>
  );
}
