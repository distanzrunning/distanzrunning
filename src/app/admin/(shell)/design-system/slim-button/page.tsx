import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import SlimButtonComponent from "../components/content/SlimButtonComponent";

export const metadata: Metadata = { title: "Slim Button" };

export default function SlimButtonPage() {
  return (
    <ContentWithTOC tocTitle="On this page">
      <SlimButtonComponent />
    </ContentWithTOC>
  );
}
