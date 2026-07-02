import AnnouncementBanner from "@/components/AnnouncementBanner";
import Masthead from "@/components/Masthead";

// Homepage — rebuilt from scratch. Renders bare (LayoutContent gives it a
// full-height <main> with no production chrome), so the homepage owns its own
// announcement bar + header (Masthead) + sections. Sections build below next.
export default function HomePage() {
  return (
    <>
      <AnnouncementBanner />
      <Masthead />
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        {/* Homepage sections build here. */}
      </div>
    </>
  );
}
