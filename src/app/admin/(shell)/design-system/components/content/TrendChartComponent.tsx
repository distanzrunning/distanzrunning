"use client";

import React, { useCallback, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import TrendChart, {
  type TrendPoint,
} from "@/components/ui/TrendChart";
import { businessTodayKey } from "@/components/admin/datePresets";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";

import { ComponentRef } from "../ComponentRef";
import { Section } from "../ContentWithTOC";

// ============================================================================
// Page chrome — copied verbatim from AccordionComponent.tsx per the DS
// convention (TODO: extract into a shared module once we touch more than
// one of these in a single PR).
// ============================================================================

const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

function Toast({
  message,
  isVisible,
}: {
  message: string;
  isVisible: boolean;
}) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <div
        className="material-menu flex items-center gap-3 px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <span className="text-copy-14 text-textDefault">{message}</span>
      </div>
    </div>
  );
}

function LinkIcon() {
  return (
    <svg
      height="14"
      width="14"
      viewBox="0 0 16 16"
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.46968 1.46968C10.1433 -0.203925 12.8567 -0.203923 14.5303 1.46968C16.2039 3.14329 16.2039 5.85674 14.5303 7.53034L12.0303 10.0303L10.9697 8.96968L13.4697 6.46968C14.5575 5.38186 14.5575 3.61816 13.4697 2.53034C12.3819 1.44252 10.6182 1.44252 9.53034 2.53034L7.03034 5.03034L5.96968 3.96968L8.46968 1.46968ZM11.5303 5.53034L5.53034 11.5303L4.46968 10.4697L10.4697 4.46968L11.5303 5.53034ZM1.46968 14.5303C3.14329 16.2039 5.85673 16.204 7.53034 14.5303L10.0303 12.0303L8.96968 10.9697L6.46968 13.4697C5.38186 14.5575 3.61816 14.5575 2.53034 13.4697C1.44252 12.3819 1.44252 10.6182 2.53034 9.53034L5.03034 7.03034L3.96968 5.96968L1.46968 8.46968C-0.203923 10.1433 -0.203925 12.8567 1.46968 14.5303Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SectionHeader({
  id,
  children,
  onCopyLink,
}: {
  id: string;
  children: React.ReactNode;
  onCopyLink?: (message: string) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    onCopyLink?.("Copied link to clipboard");
    window.history.pushState(null, "", `#${id}`);
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top - HEADER_HEIGHT - SECTION_PADDING,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative -ml-5 inline-block pl-5 no-underline outline-none text-inherit text-left cursor-pointer bg-transparent border-none"
      id={id}
    >
      <h2 className="text-heading-24 text-textDefault">
        <div className="absolute left-0 top-[8px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </button>
  );
}

function CopyIconButton({ copied }: { copied: boolean }) {
  return copied ? (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
}

function CodePreview({
  children,
  componentCode,
}: {
  children: React.ReactNode;
  componentCode: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const tokenizedLines = useShikiHighlighter(componentCode, "tsx");
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    componentCode.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "rgb(var(--color-textDefault))",
            darkColor: "rgb(var(--color-textDefault))",
          },
        ] as DualThemeToken[],
    );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [componentCode]);

  return (
    <div className="border border-borderDefault rounded-lg">
      <div
        className="p-6 rounded-t-lg"
        style={{ background: "var(--ds-background-100)" }}
      >
        {children}
      </div>
      <div
        className="rounded-b-lg overflow-hidden"
        style={{ background: "var(--ds-background-200)" }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-borderDefault"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>
        {isOpen && (
          <div
            className="border-t border-borderDefault overflow-x-auto font-mono text-copy-13"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-borderDefault opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-canvas hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>
              <pre className="overflow-x-auto py-4" data-code-block>
                <code className="block text-copy-13 leading-[20px] font-mono">
                  {lines.map((lineTokens, index) => (
                    <div
                      key={index}
                      className="flex px-4"
                      style={{ fontFeatureSettings: '"liga" off' }}
                    >
                      <span className="select-none w-[32px] min-w-[32px] text-right pr-4 text-textSubtler">
                        {index + 1}
                      </span>
                      <span className="flex-1 pr-4">
                        {lineTokens.map((token, i) => (
                          <RenderShikiToken key={i} token={token} />
                        ))}
                        {lineTokens.length === 0 && " "}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Synthetic trend data
// ============================================================================

const TZ = "Europe/Brussels";

/** Build a "YYYY-MM-DD" key for `daysFromToday` business days back
 *  (or forward, if positive), interpreted in TZ. Mirrors what the
 *  real datePresets helpers produce so the demos look indistinguishable
 *  from a live dashboard. */
function dayKeyOffset(daysFromToday: number): string {
  const todayKey = businessTodayKey(TZ);
  // Parse as a Date at noon UTC so we can step in days without DST
  // wobble, then re-format.
  const [y, m, d] = todayKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  const yy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** Generate a `length`-day trend ending today, with values pulled from
 *  a deterministic sine + jitter so each demo render looks the same
 *  (no hydration flicker). */
function buildCountTrend(length: number): TrendPoint[] {
  const out: TrendPoint[] = [];
  for (let i = length - 1; i >= 0; i--) {
    const date = dayKeyOffset(-i);
    // Deterministic pseudo-random: sin-based so the curve has shape.
    const wave = Math.sin(i * 0.4) * 30 + Math.sin(i * 0.13) * 18;
    const jitter = Math.sin(i * 1.7) * 8;
    const value = Math.max(0, Math.round(120 + wave + jitter));
    out.push({ date, value });
  }
  return out;
}

function buildPercentTrend(length: number): TrendPoint[] {
  const out: TrendPoint[] = [];
  for (let i = length - 1; i >= 0; i--) {
    const date = dayKeyOffset(-i);
    const wave = Math.sin(i * 0.3) * 12 + Math.sin(i * 0.08) * 6;
    const value = Math.max(0, Math.min(100, 68 + wave));
    out.push({ date, value: Number(value.toFixed(1)) });
  }
  return out;
}

function buildEmptyTrend(length: number): TrendPoint[] {
  const out: TrendPoint[] = [];
  for (let i = length - 1; i >= 0; i--) {
    out.push({ date: dayKeyOffset(-i), value: null });
  }
  return out;
}

// ============================================================================
// Demos
// ============================================================================

function CountDemo() {
  const trend = useMemo(() => buildCountTrend(30), []);
  return (
    <TrendChart trend={trend} metricLabel="Decisions" format="count" tz={TZ} />
  );
}

function PercentDemo() {
  const trend = useMemo(() => buildPercentTrend(30), []);
  return (
    <TrendChart
      trend={trend}
      metricLabel="Opt-in rate"
      format="percent"
      tz={TZ}
    />
  );
}

function EmptyDemo() {
  const trend = useMemo(() => buildEmptyTrend(14), []);
  return (
    <TrendChart
      trend={trend}
      metricLabel="Opt-in rate"
      format="percent"
      tz={TZ}
    />
  );
}

// ============================================================================
// Code strings
// ============================================================================

const countCode = `import TrendChart, {
  type TrendPoint,
} from '@/components/ui/TrendChart';
import { getSiteSettings } from '@/lib/site-settings';
import { buildTrend } from './data';
import { windowFromParams } from '@/components/admin/datePresets';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { timezone: tz } = await getSiteSettings();
  const window = windowFromParams(await searchParams, tz);
  const trend: TrendPoint[] = await buildTrend({
    metric: 'decisions',
    tz,
    window,
  });

  return (
    <TrendChart
      trend={trend}
      metricLabel="Decisions"
      format="count"
      tz={tz}
    />
  );
}`;

const percentCode = `<TrendChart
  trend={trend}
  metricLabel="Opt-in rate"
  format="percent"
  tz={tz}
/>`;

const emptyCode = `// Every bucket is null — the chart keeps its axes drawn and
// overlays a centred "No data in this range" message instead of
// swapping in a blank panel. Only happens in percent mode (count
// mode backfills 0 for empty days).
<TrendChart
  trend={trend}
  metricLabel="Opt-in rate"
  format="percent"
  tz={tz}
/>`;

// ============================================================================
// Page
// ============================================================================

export default function TrendChartComponent() {
  const [toast, setToast] = useState({ message: "", isVisible: false });

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast((t) => ({ ...t, isVisible: false })), 2000);
  };

  return (
    <>
      <Toast message={toast.message} isVisible={toast.isVisible} />

      {/* Count */}
      <Section>
        <SectionHeader id="count" onCopyLink={showToast}>
          Count
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          The default mode. Plots a daily integer count with{" "}
          <em>nice</em> Y-axis ticks (1 / 2 / 5 / 10 / 20 …), so the
          axis sits flush with the data instead of inflating to fit a
          fixed tick count. Today&apos;s in-progress bucket is the
          dashed terminal segment; hover surfaces a value tooltip plus
          a &quot;N days ago&quot; pill.
        </p>
        <CodePreview componentCode={countCode}>
          <CountDemo />
        </CodePreview>
      </Section>

      {/* Percent */}
      <Section>
        <SectionHeader id="percent" onCopyLink={showToast}>
          Percent
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          Setting <code className="inline-code">format=&quot;percent&quot;</code>{" "}
          locks the Y axis to <em>0 / 25 / 50 / 75 / 100%</em> and
          drops the top headroom (no peaking past 100%). Use for rate
          metrics — opt-in rate, completion rate, anything bounded.
        </p>
        <CodePreview componentCode={percentCode}>
          <PercentDemo />
        </CodePreview>
      </Section>

      {/* Empty */}
      <Section>
        <SectionHeader id="empty" onCopyLink={showToast}>
          Empty
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-3 mb-4 xl:mb-6">
          When every bucket is <code className="inline-code">null</code>{" "}
          (no traffic in any day of the window), the chart keeps its
          axes drawn for context and centres a fallback message inside
          the plot area. Hover handlers go silent so the cursor
          doesn&apos;t surface empty tooltips.
        </p>
        <CodePreview componentCode={emptyCode}>
          <EmptyDemo />
        </CodePreview>
      </Section>

      {/* Best Practices */}
      <Section>
        <SectionHeader id="best-practices" onCopyLink={showToast}>
          Best Practices
        </SectionHeader>

        <h3
          id="when-to-use"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          When to use
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            The single-metric trend slot under a stat-tile row on any
            dashboard — admin (consent, feedback) or public
            (analytics, race trends). Pair with{" "}
            <ComponentRef name="Calendar" /> (in its compact +
            preset-label mode) and, on admin surfaces, a{" "}
            <ComponentRef name="Menu" /> for the env filter on the
            row above.
          </li>
          <li>
            Don&apos;t use for multi-series comparison (two opt-in
            rates side by side, region splits, etc.) — that&apos;s a
            different component. This chart deliberately keeps to one
            line so the dashed-today and days-ago affordances stay
            unambiguous.
          </li>
        </ul>

        <h3
          id="behavior"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Behavior
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            <strong>Dashed terminal segment.</strong> When the last
            data point&apos;s date matches{" "}
            <code className="inline-code">businessTodayKey(tz)</code>,
            the final two-point segment renders dashed — the bucket is
            still filling, so the slope into it isn&apos;t final. A
            historical custom range (last point ≠ today) stays fully
            solid.
          </li>
          <li>
            <strong>Live midnight rollover.</strong> A
            one-shot timer fires at the next tz midnight (+1s buffer)
            and re-reads{" "}
            <code className="inline-code">businessTodayKey(tz)</code>,
            so a long-open tab rolls over instead of sticking on
            yesterday.
          </li>
          <li>
            <strong>Hover crosshair + pill.</strong> Vertical line plus
            a pulsing ring (only when the hovered point is today),
            value tooltip flipping with{" "}
            <code className="inline-code">TooltipWithBounds</code>, and
            a floating &quot;N days ago&quot; pill on the same row as
            the X-axis tick labels. The pill&apos;s background masks
            the tick text underneath, so the date and the days-ago
            string share one baseline without overlap.
          </li>
          <li>
            <strong>Calendar-anchored X ticks.</strong> Cadence widens
            with the window length so the axis never holds more than
            ~15 labels: every day (≤10 pts), every Monday (&lt;120
            days), 1st of each month (&lt;730 days), then{" "}
            <em>Jan 1 / Jul 1</em>. Ticks within 2 indices of either
            edge are dropped so labels don&apos;t crowd the border.
          </li>
          <li>
            <strong>Y-axis sizing.</strong> Count mode picks a nice
            integer step (1, 2, 5, 10, 20 …) targeting ~5 ticks; the
            domain ends exactly at the top tick value, and visible
            headroom comes from the SVG&apos;s top margin (24px) — not
            from inflating the domain. Percent mode locks to{" "}
            <em>0 / 25 / 50 / 75 / 100</em> and skips the headroom.
          </li>
          <li>
            <strong>Theme-aware fill.</strong> The area fill uses{" "}
            <code className="inline-code">
              rgba(var(--ds-blue-700-rgb), 0.10)
            </code>{" "}
            — the RGB tuple flips with the{" "}
            <code className="inline-code">.dark</code> class so the
            tint stays balanced on either background, no{" "}
            <code className="inline-code">dark:</code> override
            needed.
          </li>
        </ul>

        <h3
          id="content"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Content
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            <code className="inline-code">metricLabel</code> shows up
            in the tooltip and the SVG&apos;s{" "}
            <code className="inline-code">aria-label</code>. Use the
            same label the active stat tile carries (
            <em>Decisions</em>, <em>Opt-in rate</em>, <em>Unique visitors</em>
            ) so a tile-click → chart-swap reads consistently.
          </li>
          <li>
            <code className="inline-code">tz</code> should be the
            configured site timezone (<em>Europe/Brussels</em> by
            default, from <em>site_settings</em>). Hard-coding a tz
            per consumer drifts the moment it&apos;s changed in
            settings.
          </li>
          <li>
            The empty-state copy currently reads{" "}
            <em>&quot;No decisions in this range&quot;</em> — TODO:
            lift to a prop so non-consent consumers can override
            (e.g. <em>&quot;No feedback in this range&quot;</em>,{" "}
            <em>&quot;No races in this range&quot;</em>).
          </li>
        </ul>

        <h3
          id="accessibility"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Accessibility
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            The SVG carries <code className="inline-code">role=&quot;img&quot;</code>{" "}
            and an <code className="inline-code">aria-label</code>{" "}
            with the metric label and the visible date range — falls
            back to a no-data variant when every bucket is null.
          </li>
          <li>
            Color is decorative — the tooltip carries the metric label
            and the date in text, and the dashed segment signals
            in-progress without relying on colour. Don&apos;t expose
            this chart as the sole conveyance of any datum.
          </li>
          <li>
            Hover-only affordances (the crosshair / pill / value
            tooltip) aren&apos;t keyboard-reachable today — a
            keyboard-driven inspector is on the backlog and would
            complement, not replace, the static SVG description.
          </li>
        </ul>
      </Section>
    </>
  );
}
