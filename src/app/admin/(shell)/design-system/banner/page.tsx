import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import BannerComponent from "../components/content/BannerComponent";

export const metadata: Metadata = { title: "Banner" };

export default function BannerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Banner"
      pageSubtitle="A prominent message that spans the full width of its container to announce important information."
      mainSectionId="banner"
    >
      <BannerComponent />
    </ContentWithTOC>
  );
}
