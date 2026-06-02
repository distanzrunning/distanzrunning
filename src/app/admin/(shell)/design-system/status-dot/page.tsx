import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import StatusDotComponent from "../components/content/StatusDotComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Status Dot" };

export default function StatusDotPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Status Dot"
      pageSubtitle="Display an indicator of deployment status."
      mainSectionId="status-dot"
      headerRight={<RegistryInstallButtons slug="status-dot" />}
    >
      <StatusDotComponent />
    </ContentWithTOC>
  );
}
