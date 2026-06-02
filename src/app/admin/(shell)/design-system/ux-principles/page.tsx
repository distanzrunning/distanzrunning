import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import UXPrinciples from "../components/content/UXPrinciples";

export const metadata: Metadata = { title: "Ux Principles" };

export default function UxPrinciplesPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <UXPrinciples />
    </ContentWithTOC>
  );
}
