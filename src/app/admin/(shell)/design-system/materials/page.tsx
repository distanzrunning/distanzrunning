import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import Materials from "../components/content/Materials";

export const metadata: Metadata = { title: "Materials" };

export default function MaterialsPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Materials"
      pageSubtitle="Presets for radii, fills, strokes, and shadows."
      mainSectionId="materials"
    >
      <Materials />
    </ContentWithTOC>
  );
}
