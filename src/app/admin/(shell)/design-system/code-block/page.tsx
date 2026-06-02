import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CodeBlockComponent from "../components/content/CodeBlockComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Code Block" };

export default function CodeBlockPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Code Block"
      pageSubtitle="Code Block component used across Distanz documentation and code examples."
      mainSectionId="code-block"
      headerRight={<RegistryInstallButtons slug="code-block" />}
    >
      <CodeBlockComponent />
    </ContentWithTOC>
  );
}
