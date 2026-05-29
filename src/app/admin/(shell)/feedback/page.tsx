import { Suspense } from "react";

import { windowFromParams } from "@/components/admin/datePresets";
import type { EnvFilter } from "@/components/admin/env";
import { getSiteSettings } from "@/lib/site-settings";

import {
  FeedbackDashboardContent,
  FeedbackDashboardSkeleton,
} from "./FeedbackDashboard";
import FeedbackFilterRow from "./FeedbackFilterRow";
import { getEarliestFeedbackDate } from "./data";

export const metadata = {
  title: "Feedback — Stride Admin",
  robots: { index: false, follow: false },
};

type FeedbackFilter = "love" | "okay" | "not-great" | "hate" | "email";
type FeedbackMetric = "feedback" | "submitters";

function normaliseFilter(raw: string | undefined): FeedbackFilter | null {
  if (
    raw === "love" ||
    raw === "okay" ||
    raw === "not-great" ||
    raw === "hate" ||
    raw === "email"
  ) {
    return raw;
  }
  return null;
}

// Submitters is the default — the bare `/admin/feedback` URL renders
// the broadest "what's happening" view. Explicit `?metric=feedback`
// switches to feedback-count mode; a present `?filter=` also implies
// feedback (you can't filter submitters by emotion).
function resolveMetric(
  raw: string | undefined,
  filter: FeedbackFilter | null,
): FeedbackMetric {
  if (raw === "feedback") return "feedback";
  if (raw === "submitters") return "submitters";
  return filter ? "feedback" : "submitters";
}

function normaliseEnv(raw: string | undefined): EnvFilter {
  if (raw === "production" || raw === "staging" || raw === "development") {
    return raw;
  }
  return "all";
}

export default async function FeedbackDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string;
    metric?: string;
    env?: string;
    period?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const rawFilter = normaliseFilter(params.filter);
  const metric = resolveMetric(params.metric, rawFilter);
  // submitters tab implies no filter — defensive against manual URL
  // edits that pair an emotion filter with the submitters metric.
  const filter = metric === "submitters" ? null : rawFilter;
  const env = normaliseEnv(params.env);
  const { timezone: tz } = await getSiteSettings();
  // Earliest feedback row — drives the "All time" preset for both
  // server-side window resolution and the client picker's visual
  // range. Cached per (env), so calling it again from
  // FeedbackDashboardContent in parallel is free.
  const earliestDate = await getEarliestFeedbackDate(env);
  const window = windowFromParams(
    {
      period: params.period,
      from: params.from,
      to: params.to,
    },
    tz,
    earliestDate,
  );

  return (
    <div style={{ padding: "32px 24px" }}>
      <div style={{ maxWidth: 1248, margin: "0 auto" }}>
        <FeedbackFilterRow tz={tz} earliestDate={earliestDate} env={env} />
        {/* No `key` on this Suspense — keeping the boundary stable
            across filter / window changes means React preserves the
            existing dashboard tree during a transition (Link click /
            picker startTransition), so the previous tile values stay
            on screen while the new data streams in and NumberTicker
            animates between old and new readings instead of the row
            flashing a skeleton. */}
        <Suspense fallback={<FeedbackDashboardSkeleton />}>
          <FeedbackDashboardContent
            filter={filter}
            metric={metric}
            windowStart={window.start}
            windowEnd={window.end}
            tz={tz}
            earliestDate={earliestDate}
            env={env}
          />
        </Suspense>
      </div>
    </div>
  );
}
