import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import MultiSelectComponent from "../components/content/MultiSelectComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Multi Select" };

export default function MultiSelectPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Multi Select"
      pageSubtitle="A keyboard-navigable dropdown for selecting multiple items with advanced focus management."
      mainSectionId="multi-select"
      headerRight={<RegistryInstallButtons slug="multi-select" />}
    >
      <MultiSelectComponent />
    </ContentWithTOC>
  );
}
