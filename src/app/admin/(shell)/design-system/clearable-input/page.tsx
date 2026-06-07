import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ClearableInputComponent from "../components/content/ClearableInputComponent";

export const metadata: Metadata = { title: "Clearable Input" };

export default function ClearableInputPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Clearable Input"
      pageSubtitle="Text input with a clear button that resets the value on Escape."
      mainSectionId="clearable-input"
    >
      <ClearableInputComponent />
    </ContentWithTOC>
  );
}
