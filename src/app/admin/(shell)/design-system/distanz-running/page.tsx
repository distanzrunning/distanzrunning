import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import DistanzRunningBrand from "../components/content/DistanzRunningBrand";

export const metadata: Metadata = { title: "Distanz Running" };

export default function DistanzRunningPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Brands"
      pageSubtitle="We've created the following guidelines to help others use our brand and assets, including our logo, content, and trademarks."
      mainSectionId="brands"
    >
      <DistanzRunningBrand />
    </ContentWithTOC>
  );
}
