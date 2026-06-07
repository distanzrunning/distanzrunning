import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import MiddleTruncateComponent from "../components/content/MiddleTruncateComponent";

export const metadata: Metadata = { title: "Middle Truncate" };

export default function MiddleTruncatePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="MiddleTruncate"
      pageSubtitle="Truncates text in the middle, preserving the start and end of the string for maximum readability."
      mainSectionId="middle-truncate"
    >
      <MiddleTruncateComponent />
    </ContentWithTOC>
  );
}
