import { Skeleton } from "@/components/ui/Skeleton";
import { FeedbackDashboardSkeleton } from "./FeedbackDashboard";

// Route-level instant fallback — shown the moment you navigate INTO
// /admin/feedback (a path change), before the server render lands, so the page
// area shows a skeleton immediately instead of the previous page hanging while
// getSiteSettings + getEarliestFeedbackDate resolve. Does NOT fire on
// filter/env/date changes (searchParam-only), so the in-page Suspense keeps the
// live tile values across those.
export default function Loading() {
  return (
    <div className="admin-loading-reveal">
      <div
        style={{
          maxWidth: "none",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        {/* Filter row placeholder — search (flex) + env + date + export. */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Skeleton
            width="100%"
            height={40}
            style={{ display: "block", flex: 1 }}
          />
          <Skeleton width={120} height={40} style={{ display: "block" }} />
          <Skeleton width={240} height={40} style={{ display: "block" }} />
          <Skeleton width={110} height={40} style={{ display: "block" }} />
        </div>
        <FeedbackDashboardSkeleton />
      </div>
    </div>
  );
}
