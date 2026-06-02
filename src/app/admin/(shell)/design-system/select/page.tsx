import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SelectComponent from "../components/content/SelectComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Select" };

export default function SelectPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Select"
      pageSubtitle="Display a dropdown list of items."
      mainSectionId="select"
      headerRight={<RegistryInstallButtons slug="select" />}
    >
      <SelectComponent />
    </ContentWithTOC>
  );
}
