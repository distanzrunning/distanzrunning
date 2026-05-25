import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import BrowserComponent from "../components/content/BrowserComponent";

export const metadata: Metadata = { title: "Browser" };

export default function BrowserPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Browser"
      pageSubtitle="The Browser component lets you showcase website screenshots or any other content within a realistic browser-style frame."
      mainSectionId="browser"
    >
      <BrowserComponent />
    </ContentWithTOC>
  );
}
