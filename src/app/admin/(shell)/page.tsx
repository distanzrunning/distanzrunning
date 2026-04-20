import Link from "next/link";
import {
  ArrowUpRight,
  MessageSquare,
  PanelsTopLeft,
  SquareCheckBig,
} from "lucide-react";

export const metadata = {
  title: "Overview — Stride Admin",
  robots: { index: false, follow: false },
};

const SECTIONS: {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "consent",
    label: "Consent",
    description:
      "Consent management dashboard and CMP documentation — track visitor decisions and manage integrations.",
    href: "/admin/consent",
    icon: <SquareCheckBig className="w-5 h-5" />,
  },
  {
    id: "feedback",
    label: "Feedback",
    description:
      "Submissions from the site feedback widgets — emoji, message, optional follow-up email, and page context.",
    href: "/admin/feedback",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: "design-system",
    label: "Design System",
    description:
      "Foundations, brands, and components that make up Stride — Distanz Running's shared design language.",
    href: "/admin/design-system",
    icon: <PanelsTopLeft className="w-5 h-5" />,
  },
];

function SectionCard({
  href,
  label,
  description,
  icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-xl p-6 transition-colors no-underline"
      style={{
        border: "1px solid var(--ds-gray-400)",
        background: "var(--ds-background-100)",
        color: "var(--ds-gray-1000)",
        minHeight: 180,
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="inline-flex items-center justify-center rounded-lg"
          style={{
            width: 40,
            height: 40,
            background: "var(--ds-gray-100)",
            color: "var(--ds-gray-900)",
          }}
        >
          {icon}
        </span>
        <span
          className="inline-flex items-center justify-center rounded-md transition-colors opacity-0 group-hover:opacity-100"
          style={{
            width: 28,
            height: 28,
            color: "var(--ds-gray-900)",
            background: "var(--ds-gray-100)",
          }}
          aria-hidden="true"
        >
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h2
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: "var(--ds-gray-1000)",
            letterSpacing: "-0.32px",
          }}
        >
          {label}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.55,
            color: "var(--ds-gray-700)",
          }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

export default function AdminOverviewPage() {
  return (
    <div style={{ padding: "32px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              lineHeight: "32px",
              margin: 0,
              color: "var(--ds-gray-1000)",
            }}
          >
            Overview
          </h1>
          <p
            style={{
              marginTop: 6,
              marginBottom: 0,
              fontSize: 13,
              color: "var(--ds-gray-700)",
            }}
          >
            Jump into any area of Stride Admin.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {SECTIONS.map((section) => (
            <SectionCard
              key={section.id}
              href={section.href}
              label={section.label}
              description={section.description}
              icon={section.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
