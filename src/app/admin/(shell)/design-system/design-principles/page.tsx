import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import DesignPrinciples from "../components/content/DesignPrinciples";

export const metadata: Metadata = { title: "Design Principles" };

export default function DesignPrinciplesPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <DesignPrinciples />
    </ContentWithTOC>
  );
}
