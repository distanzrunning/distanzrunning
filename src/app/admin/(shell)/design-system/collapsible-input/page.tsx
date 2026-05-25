import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CollapsibleInputComponent from "../components/content/CollapsibleInputComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Collapsible Input" };

export default function CollapsibleInputPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Collapsible Input"
      pageSubtitle="A search-shaped input that collapses to its icon when empty, expanding on focus."
      mainSectionId="collapsible-input"
      headerRight={<RegistryInstallButtons slug="collapsible-input" />}
    >
      <CollapsibleInputComponent />
    </ContentWithTOC>
  );
}
