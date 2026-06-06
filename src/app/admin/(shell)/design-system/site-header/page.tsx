import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SiteHeaderComponent from "../components/content/SiteHeaderComponent";

export const metadata: Metadata = { title: "Site Header" };

export default function SiteHeaderPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Site Header"
      pageSubtitle="The 50 px sticky bar above PageFrame: wordmark on the left, primary navigation centred, newsletter + theme actions on the right. Includes the Radix-backed dropdown menu used to surface News, Shoes, Gear, Nutrition, and Races."
      mainSectionId="overview"
    >
      <SiteHeaderComponent />
    </ContentWithTOC>
  );
}
