import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SpinnerComponent from "../components/content/SpinnerComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Spinner" };

export default function SpinnerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Spinner"
      pageSubtitle="Indicate an action running in the background."
      mainSectionId="spinner"
      headerRight={<RegistryInstallButtons slug="spinner" />}
    >
      <SpinnerComponent />
    </ContentWithTOC>
  );
}
