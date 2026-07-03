import {
  getAnnouncementFresh,
  type AnnouncementConfig,
} from "@/lib/announcement";
import { AnnouncementEditor } from "./AnnouncementEditor";

export const metadata = {
  title: "Announcement — Stride Admin",
  robots: { index: false, follow: false },
};

const DEFAULT: AnnouncementConfig = {
  enabled: false,
  text: "",
  serifWordIndices: [],
  color: "canvas",
  linkHref: null,
  updatedAt: "",
};

export default async function AnnouncementPage() {
  const config = (await getAnnouncementFresh()) ?? DEFAULT;

  return (
    <div style={{ padding: "32px 24px" }}>
      <div style={{ maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
        <p className="text-copy-16 mb-8 text-textSubtle">
          A site-wide bar above the header. Compose the message, choose which
          words use the serif face, pick a background, and publish.
        </p>
        <AnnouncementEditor initial={config} />
      </div>
    </div>
  );
}
