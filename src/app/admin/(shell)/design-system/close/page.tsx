import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import CloseComponent from "../components/content/CloseComponent";

export const metadata: Metadata = { title: "Close" };

export default function ClosePage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <CloseComponent />
    </ContentWithTOC>
  );
}
