import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import ModularScale from "../components/content/ModularScale";

export const metadata: Metadata = { title: "Modular Scale" };

export default function ModularScalePage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <ModularScale />
    </ContentWithTOC>
  );
}
