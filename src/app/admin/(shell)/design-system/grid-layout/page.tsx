import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import GridLayout from "../components/content/GridLayout";

export const metadata: Metadata = { title: "Grid Layout" };

export default function GridLayoutPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <GridLayout />
    </ContentWithTOC>
  );
}
