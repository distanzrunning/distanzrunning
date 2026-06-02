import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import TextareaComponent from "../components/content/TextareaComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Textarea" };

export default function TextareaPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Textarea"
      pageSubtitle="Retrieve multi-line text input from a user."
      mainSectionId="textarea"
      headerRight={<RegistryInstallButtons slug="textarea" />}
    >
      <TextareaComponent />
    </ContentWithTOC>
  );
}
