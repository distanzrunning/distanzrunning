import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import AdSlotComponent from "../components/content/AdSlotComponent";

export const metadata: Metadata = { title: "Ad Slot" };

export default function AdSlotPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Ad Slot"
      pageSubtitle="A labelled, space-reserved AdSense unit with a Distanz-branded fallback."
      mainSectionId="ad-slot"
    >
      <AdSlotComponent />
    </ContentWithTOC>
  );
}
