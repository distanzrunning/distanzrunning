import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import DesignTokens from "../components/content/DesignTokens";

export const metadata: Metadata = { title: "Design Tokens" };

export default function DesignTokensPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <DesignTokens />
    </ContentWithTOC>
  );
}
