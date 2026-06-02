import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SheetComponent from "../components/content/SheetComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Sheet" };

export default function SheetPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Sheet"
      pageSubtitle="Display content in a side panel that slides in from the edge of the screen."
      mainSectionId="sheet"
      headerRight={<RegistryInstallButtons slug="sheet" />}
    >
      <SheetComponent />
    </ContentWithTOC>
  );
}
