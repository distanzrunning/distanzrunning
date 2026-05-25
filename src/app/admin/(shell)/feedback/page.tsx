import { Suspense } from "react";
import {
  FeedbackDashboardContent,
  FeedbackDashboardSkeleton,
} from "./FeedbackDashboard";

export const metadata = {
  title: "Feedback — Stride Admin",
  robots: { index: false, follow: false },
};

export default function FeedbackDashboardPage() {
  return (
    <div style={{ padding: "32px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <h1
            className="text-heading-32"
            style={{ margin: 0, color: "var(--ds-gray-1000)" }}
          >
            Feedback
          </h1>
          <p
            className="text-copy-16"
            style={{
              marginTop: 6,
              marginBottom: 0,
              color: "var(--ds-gray-700)",
            }}
          >
            Visitor feedback submissions
          </p>
        </header>

        <Suspense fallback={<FeedbackDashboardSkeleton />}>
          <FeedbackDashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
