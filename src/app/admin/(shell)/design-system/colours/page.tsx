import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ColourPalettes from "../components/content/ColourPalettes";

export const metadata: Metadata = { title: "Colours" };

export default function ColoursPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Colours"
      pageSubtitle="Learn how to work with our color system. Right click to copy raw values."
      mainSectionId="colours"
    >
      <ColourPalettes />
    </ContentWithTOC>
  );
}
