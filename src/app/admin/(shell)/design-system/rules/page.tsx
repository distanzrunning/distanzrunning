import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import Rules from "../components/content/Rules";

export const metadata: Metadata = { title: "Rules" };

export default function RulesPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <Rules />
    </ContentWithTOC>
  );
}
