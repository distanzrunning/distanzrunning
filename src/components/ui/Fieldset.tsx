"use client";

import { Link as LinkIcon } from "lucide-react";
import { type ReactNode } from "react";

// ============================================================================
// Fieldset
// ============================================================================
// Vercel-style settings card. Vertical stack of:
//   - title (heading-20)
//   - subtitle (text-copy-14, gray-900)
//   - content slot (form control(s))
//   - optional footer with status text + action(s)
//
// Stack multiple <Fieldset>s vertically with gap-6 / gap-8 for a
// settings page. Each carries an `id` so hash anchors work
// (`/admin/settings#timezone`).

export interface FieldsetProps {
  /** Hash anchor + scroll target. Also wraps title in an in-page link. */
  id?: string;
  /** Section heading. */
  title: ReactNode;
  /** Sub-heading / description. */
  subtitle?: ReactNode;
  /** Form control(s). */
  children: ReactNode;
  /** Footer status text (left side) — typically a "Learn more" link. */
  status?: ReactNode;
  /** Footer actions (right side) — typically a Save Button. */
  action?: ReactNode;
  /** Variant: `error` adds a red border (use for destructive sections). */
  variant?: "default" | "error";
}

export function Fieldset({
  id,
  title,
  subtitle,
  children,
  status,
  action,
  variant = "default",
}: FieldsetProps) {
  const borderColor =
    variant === "error"
      ? "var(--ds-red-700)"
      : "hsl(var(--color-borderDefault))";
  return (
    <section
      id={id}
      style={{
        border: `1px solid ${borderColor}`,
        borderRadius: 10,
        background: "hsl(var(--color-surface))",
        overflow: "hidden",
        scrollMarginTop: 64,
      }}
    >
      <div style={{ padding: "24px" }}>
        {/* Title and subtitle use Vercel's Fieldset typography
            verbatim — 20/32 and 14/24 — rather than our DS slots
            (text-heading-20 is 20/26 and text-copy-14 is 14/20,
            both tighter than the Vercel reference this primitive
            is modelled on). Inline values are deliberate. */}
        <h2
          style={{
            color: "hsl(var(--color-textDefault))",
            margin: 0,
            fontSize: 20,
            lineHeight: "32px",
            letterSpacing: "-0.0165em",
            fontWeight: 600,
          }}
        >
          {id ? (
            <a
              href={`#${id}`}
              className="group inline-flex items-center gap-3 text-inherit no-underline"
            >
              <span>{title}</span>
              <LinkIcon
                aria-hidden
                className="w-4 h-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                style={{ color: "hsl(var(--color-textSubtler))" }}
              />
            </a>
          ) : (
            <span>{title}</span>
          )}
        </h2>
        {subtitle && (
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              color: "hsl(var(--color-textDefault))",
              fontSize: 14,
              lineHeight: "24px",
              fontWeight: 400,
            }}
          >
            {subtitle}
          </p>
        )}
        <div style={{ marginTop: 16 }}>{children}</div>
      </div>
      {(status || action) && (
        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "12px 24px",
            borderTop: `1px solid ${borderColor}`,
            background: "hsl(var(--color-canvas))",
            color: "hsl(var(--color-textSubtle))",
          }}
        >
          <div className="text-copy-14" style={{ flex: "1 1 auto", minWidth: 0 }}>
            {status}
          </div>
          {action && (
            <div style={{ flex: "0 0 auto", display: "flex", gap: 8 }}>
              {action}
            </div>
          )}
        </footer>
      )}
    </section>
  );
}
