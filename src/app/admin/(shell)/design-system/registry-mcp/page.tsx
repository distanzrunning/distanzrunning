import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import RegistryMCPContent from "../components/content/RegistryMCPContent";

export const metadata: Metadata = { title: "Registry & MCP" };

export default function RegistryMCPPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Registry & MCP"
      pageSubtitle="Install Distanz Running components from this DS into any project, and connect AI tools like Claude / Cursor / v0 via the Model Context Protocol."
      mainSectionId="registry-mcp"
    >
      <RegistryMCPContent />
    </ContentWithTOC>
  );
}
