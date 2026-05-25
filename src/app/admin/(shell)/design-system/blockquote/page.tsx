import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import BlockquoteComponent from "../components/content/BlockquoteComponent";

export const metadata: Metadata = { title: "Blockquote" };

export default function BlockquotePage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <BlockquoteComponent />
    </ContentWithTOC>
  );
}
