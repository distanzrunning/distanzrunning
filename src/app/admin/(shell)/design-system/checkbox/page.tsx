import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CheckboxComponent from "../components/content/CheckboxComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Checkbox" };

export default function CheckboxPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Checkbox"
      pageSubtitle="A control that toggles between two options, checked or unchecked."
      mainSectionId="checkbox"
      headerRight={<RegistryInstallButtons slug="checkbox" />}
    >
      <CheckboxComponent />
    </ContentWithTOC>
  );
}
