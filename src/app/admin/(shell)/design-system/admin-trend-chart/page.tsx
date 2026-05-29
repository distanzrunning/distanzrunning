import type { Metadata } from "next";

import ContentWithTOC from "../components/ContentWithTOC";
import AdminTrendChartComponent from "../components/content/AdminTrendChartComponent";

export const metadata: Metadata = { title: "Admin Trend Chart" };

export default function AdminTrendChartPage() {
  return (
    <ContentWithTOC
      tocTitle="On this page"
      pageTitle="Admin Trend Chart"
      pageSubtitle="Single-metric line chart for admin dashboards — counts or percentages, nice-integer Y ticks, calendar-anchored X ticks, dashed today segment, hover crosshair + days-ago pill."
      mainSectionId="admin-trend-chart"
    >
      <AdminTrendChartComponent />
    </ContentWithTOC>
  );
}
