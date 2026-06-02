import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ChoiceboxComponent from "../components/content/ChoiceboxComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Choicebox" };

export default function ChoiceboxPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Choicebox"
      pageSubtitle="A card-based selection component for single or multiple choice scenarios with larger tap targets."
      mainSectionId="choicebox"
      headerRight={<RegistryInstallButtons slug="choicebox" />}
    >
      <ChoiceboxComponent />
    </ContentWithTOC>
  );
}
