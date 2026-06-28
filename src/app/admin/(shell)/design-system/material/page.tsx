import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import MaterialComponent from "../components/content/MaterialComponent";

export const metadata: Metadata = { title: "Material" };

export default function MaterialPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Material"
      pageSubtitle="Various surfaces with shadows, built on top of <Stack>."
      mainSectionId="material"
    >
      <MaterialComponent />
    </ContentWithTOC>
  );
}
