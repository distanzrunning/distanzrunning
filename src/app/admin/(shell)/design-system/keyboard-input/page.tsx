import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import KeyboardInputComponent from "../components/content/KeyboardInputComponent";
import { RegistryInstallButtons } from "../components/RegistryInstallButtons";

export const metadata: Metadata = { title: "Keyboard Input" };

export default function KeyboardInputPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Keyboard Input"
      pageSubtitle="Display keyboard input that triggers an action."
      mainSectionId="keyboard-input"
      headerRight={<RegistryInstallButtons slug="keyboard-input" />}
    >
      <KeyboardInputComponent />
    </ContentWithTOC>
  );
}
