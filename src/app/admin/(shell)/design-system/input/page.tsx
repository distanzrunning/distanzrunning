import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import InputComponent from "../components/content/InputComponent";

export const metadata: Metadata = { title: "Input" };

export default function InputPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Input"
      pageSubtitle="Retrieve text input from a user."
      mainSectionId="input"
    >
      <InputComponent />
    </ContentWithTOC>
  );
}
