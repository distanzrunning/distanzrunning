import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import LoadingDotsComponent from "../components/content/LoadingDotsComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Loading Dots" };

export default function LoadingDotsPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Loading Dots"
      pageSubtitle="Indicate an action running in the background."
      mainSectionId="loading-dots"
      headerRight={<RegistryInstallButtons slug="loading-dots" />}
    >
      <LoadingDotsComponent />
    </ContentWithTOC>
  );
}
