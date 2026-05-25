import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SlimButtonIconComponent from "../components/content/SlimButtonIconComponent";

export const metadata: Metadata = { title: "Slim Button Icon" };

export default function SlimButtonIconPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <SlimButtonIconComponent />
    </ContentWithTOC>
  );
}
