import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import InputComponent from "../components/content/InputComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Input" };

export default function InputPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Input"
      pageSubtitle="Retrieve text input from a user."
      mainSectionId="input"
      headerRight={<RegistryInstallButtons slug="input" />}
    >
      <InputComponent />
    </ContentWithTOC>
  );
}
