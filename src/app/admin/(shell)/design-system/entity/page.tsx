import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import EntityComponent from "../components/content/EntityComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Entity" };

export default function EntityPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Entity"
      pageSubtitle="Displays up-to-two columns of content. The left column can contain arbitrary content, and the right column typically contains controls or actions related to the content in the left column."
      mainSectionId="entity"
      headerRight={<RegistryInstallButtons slug="entity" />}
    >
      <EntityComponent />
    </ContentWithTOC>
  );
}
