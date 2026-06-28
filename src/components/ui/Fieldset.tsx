"use client";

import { Link as LinkIcon } from "lucide-react";
import { type ReactNode } from "react";

// ============================================================================
// Fieldset — Geist's settings card
// ============================================================================
// A bordered card (material-base) with a content area (title + subtitle +
// controls) and an optional footer (status text + actions). `type` tints the
// whole card for error/warning states; `disabled` drops a wall over the
// content. Stack multiple <Fieldset>s with gap-6 for a settings page.

export type FieldsetType = "default" | "error" | "warning";

export interface FieldsetProps {
  /** Hash anchor + scroll target. Also wraps the title in an in-page link. */
  id?: string;
  /** Section heading (heading-20). Optional — omit for a subtitle-only card. */
  title?: ReactNode;
  /** Sub-heading / description. */
  subtitle?: ReactNode;
  /** Form control(s). */
  children?: ReactNode;
  /** Inline error message under the content (red-900). */
  errorText?: ReactNode;
  /** Inline warning message under the content (amber-900). */
  warningText?: ReactNode;
  /** Footer status text (left side) — typically a "Learn more" link. */
  status?: ReactNode;
  /** Footer actions (right side) — one or more Buttons. */
  action?: ReactNode;
  /** Tints the whole card (border + footer) for error / warning states. */
  type?: FieldsetType;
  /** Drops a wall over the content and mutes it (no footer actions). */
  disabled?: boolean;
}

// Container per type. Default is material-base (bg-100 + shadow-border
// hairline, 6px). The typed variants swap the hairline for a coloured
// border — done with explicit border/radius/bg rather than material-base +
// shadow-none, because material-base (a plugin utility) out-orders Tailwind's
// shadow-none and would leave the grey hairline under the coloured border.
const CONTAINER_TYPE: Record<FieldsetType, string> = {
  default: "material-base",
  error: "rounded-sm border border-[var(--ds-red-400)] bg-surface",
  warning: "rounded-sm border border-[var(--ds-amber-400)] bg-surface",
};

// Footer fill/border/ink per type.
const FOOTER_TYPE: Record<FieldsetType, string> = {
  default: "bg-canvas border-borderDefault text-gray-900",
  error: "bg-[var(--ds-red-100)] border-[var(--ds-red-400)] text-[var(--ds-red-900)]",
  warning:
    "bg-[var(--ds-amber-100)] border-[var(--ds-amber-400)] text-[var(--ds-amber-900)]",
};

export function Fieldset({
  id,
  title,
  subtitle,
  children,
  errorText,
  warningText,
  status,
  action,
  type = "default",
  disabled = false,
}: FieldsetProps) {
  const hasFooter = Boolean(status || action);

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${CONTAINER_TYPE[type]}`}
      style={{ scrollMarginTop: 64 }}
    >
      <div
        className="relative bg-surface p-6"
        style={disabled ? { color: "var(--ds-gray-700)" } : undefined}
      >
        {/* Disabled wall — blocks interaction with the muted content. */}
        {disabled && (
          <div
            aria-hidden
            className="absolute inset-0 z-10 cursor-not-allowed"
          />
        )}

        {title && (
          <h4 className="text-heading-20 inline-flex items-center [word-break:break-word]">
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
          </h4>
        )}

        {subtitle && (
          <p
            className="text-copy-14 leading-6 py-3"
            style={{
              margin: 0,
              color: disabled
                ? "var(--ds-gray-700)"
                : "hsl(var(--color-textDefault))",
            }}
          >
            {subtitle}
          </p>
        )}

        {children && <div className="mt-4">{children}</div>}

        {errorText && (
          <div className="mt-4">
            <span className="text-copy-14" style={{ color: "var(--ds-red-900)" }}>
              {errorText}
            </span>
          </div>
        )}

        {warningText && (
          <div className="mt-4">
            <span
              className="text-copy-14"
              style={{ color: "var(--ds-amber-900)" }}
            >
              {warningText}
            </span>
          </div>
        )}
      </div>

      {hasFooter && (
        <footer
          className={`relative flex min-h-[57px] items-center border-t py-3 px-6 text-copy-14 leading-6 ${
            disabled
              ? "bg-[var(--ds-gray-100)] border-borderDefault text-gray-900"
              : FOOTER_TYPE[type]
          }`}
        >
          <div className="flex max-w-full items-center" style={{ minWidth: 0 }}>
            {status}
          </div>
          {action && (
            <div className="ml-auto flex items-center justify-end gap-4">
              {action}
            </div>
          )}
        </footer>
      )}
    </section>
  );
}
