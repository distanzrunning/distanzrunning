import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import KeyboardInputComponent from "../components/content/KeyboardInputComponent";

export const metadata: Metadata = { title: "Keyboard Input" };

export default function KeyboardInputPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Keyboard Input"
      pageSubtitle="Display keyboard input that triggers an action."
      mainSectionId="keyboard-input"
    >
      <KeyboardInputComponent />
    </ContentWithTOC>
  );
}
