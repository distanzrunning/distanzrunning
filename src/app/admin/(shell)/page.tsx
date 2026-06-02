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
        border: "1px solid hsl(var(--color-borderDefault))",
        background: "hsl(var(--color-surface))",
        color: "hsl(var(--color-textDefault))",
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
            color: "hsl(var(--color-textSubtle))",
          }}
        >
          {icon}
        </span>
        <span
          className="inline-flex items-center justify-center rounded-md transition-colors opacity-0 group-hover:opacity-100"
          style={{
            width: 28,
            height: 28,
            color: "hsl(var(--color-textSubtle))",
            background: "var(--ds-gray-100)",
          }}
          aria-hidden="true"
        >
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h2
          className="text-heading-16"
          style={{ margin: 0, color: "hsl(var(--color-textDefault))" }}
        >
          {label}
        </h2>
        <p
          className="text-copy-14"
          style={{ margin: 0, color: "hsl(var(--color-textSubtler))" }}
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
            className="text-heading-32"
            style={{ margin: 0, color: "hsl(var(--color-textDefault))" }}
          >
            Overview
          </h1>
          <p
            className="text-copy-16"
            style={{ marginTop: 6, marginBottom: 0, color: "hsl(var(--color-textSubtler))" }}
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
