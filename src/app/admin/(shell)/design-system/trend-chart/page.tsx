import type { Metadata } from "next";

import ContentWithTOC from "../components/ContentWithTOC";
import TrendChartComponent from "../components/content/TrendChartComponent";

export const metadata: Metadata = { title: "Trend Chart" };

export default function TrendChartPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Trend Chart"
      pageSubtitle="Single-metric line chart — counts or percentages, nice-integer Y ticks, calendar-anchored X ticks, dashed today segment, hover crosshair + days-ago pill."
      mainSectionId="trend-chart"
    >
      <TrendChartComponent />
    </ContentWithTOC>
  );
}
