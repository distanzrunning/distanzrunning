import type { Metadata } from "next";
import ContentWithTOC from "../components/ContentWithTOC";
import VideoComponent from "../components/content/VideoComponent";

export const metadata: Metadata = { title: "Video" };

export default function VideoPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Video"
      pageSubtitle="Embed a video with built-in playback controls and lazy loading support."
      mainSectionId="video"
    >
      <VideoComponent />
    </ContentWithTOC>
  );
}
