import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import GridSpacing from "../components/content/GridSpacing";

export const metadata: Metadata = { title: "Grid Spacing" };

export default function GridSpacingPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <GridSpacing />
    </ContentWithTOC>
  );
}
