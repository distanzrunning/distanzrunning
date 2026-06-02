import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CollapseComponent from "../components/content/CollapseComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Collapse" };

export default function CollapsePage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Collapse"
      pageSubtitle="A set of headings, vertically stacked, that each reveal a related section of content."
      mainSectionId="collapse"
      headerRight={<RegistryInstallButtons slug="collapse" />}
    >
      <CollapseComponent />
    </ContentWithTOC>
  );
}
