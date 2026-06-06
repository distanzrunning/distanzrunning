import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SpinnerComponent from "../components/content/SpinnerComponent";

export const metadata: Metadata = { title: "Spinner" };

export default function SpinnerPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Spinner"
      pageSubtitle="Indicate an action running in the background."
      mainSectionId="spinner"
    >
      <SpinnerComponent />
    </ContentWithTOC>
  );
}
