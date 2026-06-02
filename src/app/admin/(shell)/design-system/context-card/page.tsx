import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ContextCardComponent from "../components/content/ContextCardComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Context Card" };

export default function ContextCardPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Context Card"
      pageSubtitle="Tooltip"
      mainSectionId="context-card"
      headerRight={<RegistryInstallButtons slug="context-card" />}
    >
      <ContextCardComponent />
    </ContentWithTOC>
  );
}
