import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ScrollerComponent from "../components/content/ScrollerComponent";

export const metadata: Metadata = { title: "Scroller" };

export default function ScrollerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Scroller"
      pageSubtitle="Display an overflowing list of items."
      mainSectionId="scroller"
    >
      <ScrollerComponent />
    </ContentWithTOC>
  );
}
