import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import GridComponent from "../components/content/GridComponent";

export const metadata: Metadata = { title: "Grid" };

export default function GridPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Grid"
      pageSubtitle="Display elements in a grid layout."
      mainSectionId="grid"
    >
      <GridComponent />
    </ContentWithTOC>
  );
}
