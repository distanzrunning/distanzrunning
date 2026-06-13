import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SeparatorComponent from "../components/content/SeparatorComponent";

export const metadata: Metadata = { title: "Separator" };

export default function SeparatorPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Separator"
      pageSubtitle="A visual divider that separates content into distinct sections, with support for horizontal and vertical orientations."
      mainSectionId="separator"
    >
      <SeparatorComponent />
    </ContentWithTOC>
  );
}
