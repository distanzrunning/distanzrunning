"use client";

import { forwardRef } from "react";

export type ProjectBannerVariant = "success" | "warning" | "error";

export interface ProjectBannerProps {
  /** The variant/severity of the banner */
  variant: ProjectBannerVariant;
  /** Icon to display before the message */
  icon?: React.ReactNode;
  /** The banner message content */
  children: React.ReactNode;
  /** Action element (link or button) displayed after the message */
  action?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const variantStyles: Record<
  ProjectBannerVariant,
  {
    bg: string;
    text: string;
    border: string;
    actionText: string;
    actionHoverText: string;
    actionDecoration: string;
    actionHoverDecoration: string;
    focusColor: string;
  }
> = {
  success: {
    bg: "var(--ds-blue-100)",
    text: "var(--ds-blue-900)",
    border: "var(--ds-blue-400)",
    actionText: "var(--ds-blue-1000)",
    actionHoverText: "var(--ds-blue-900)",
    actionDecoration: "var(--ds-blue-400)",
    actionHoverDecoration: "var(--ds-blue-500)",
    focusColor: "var(--ds-blue-600)",
  },
  warning: {
    bg: "var(--ds-amber-100)",
    text: "var(--ds-amber-900)",
    border: "var(--ds-amber-400)",
    actionText: "var(--ds-amber-1000)",
    actionHoverText: "var(--ds-amber-900)",
    actionDecoration: "var(--ds-amber-400)",
    actionHoverDecoration: "var(--ds-amber-500)",
    focusColor: "var(--ds-amber-700)",
  },
  error: {
    bg: "var(--ds-red-100)",
    text: "var(--ds-red-900)",
    border: "var(--ds-red-400)",
    actionText: "var(--ds-red-1000)",
    actionHoverText: "var(--ds-red-900)",
    actionDecoration: "var(--ds-red-400)",
    actionHoverDecoration: "var(--ds-red-500)",
    focusColor: "var(--ds-red-700)",
  },
};

export const ProjectBanner = forwardRef<HTMLElement, ProjectBannerProps>(
  ({ variant, icon, children, action, className = "" }, ref) => {
    const styles = variantStyles[variant];

    return (
      <aside
        ref={ref}
        className={`flex z-30 gap-x-2 justify-center items-center py-2 leading-5 border-t border-b min-h-[40px] translate-y-[-1px] text-[14px] ${className}`}
        style={{
          color: styles.text,
          background: styles.bg,
          borderColor: styles.border,
        }}
      >
        <div className="flex flex-col gap-2 px-6 w-full md:justify-center md:flex-row md:items-center">
          <div className="flex gap-2 items-center">
            {icon && (
              <div aria-hidden="true" className="shrink-0">
                {icon}
              </div>
            )}
            <p>{children}</p>
          </div>
          {action && <div className="ml-6 md:ml-0">{action}</div>}
        </div>
      </aside>
    );
  },
);

ProjectBanner.displayName = "ProjectBanner";

export interface ProjectBannerActionProps {
  /** The variant to match the parent banner */
  variant: ProjectBannerVariant;
  /** Action label */
  children: React.ReactNode;
  /** Click handler (renders as button) */
  onClick?: () => void;
  /** URL (renders as link) */
  href?: string;
}

const variantActionClasses: Record<ProjectBannerVariant, string> = {
  success:
    "text-[var(--ds-blue-1000)] decoration-[var(--ds-blue-400)] hover:text-[var(--ds-blue-900)] hover:decoration-[var(--ds-blue-500)]",
  warning:
    "text-[var(--ds-amber-1000)] decoration-[var(--ds-amber-400)] hover:text-[var(--ds-amber-900)] hover:decoration-[var(--ds-amber-500)]",
  error:
    "text-[var(--ds-red-1000)] decoration-[var(--ds-red-400)] hover:text-[var(--ds-red-900)] hover:decoration-[var(--ds-red-500)]",
};

export function ProjectBannerAction({
  variant,
  children,
  onClick,
  href,
}: ProjectBannerActionProps) {
  const styles = variantStyles[variant];

  const baseClassName =
    "cursor-pointer bg-transparent py-1 font-sans font-medium underline border-none underline-offset-[5px] outline-none px-0 h-6 my-[-1px] rounded-sm transition-colors";
  const className = `${baseClassName} ${variantActionClasses[variant]}`;

  const style = {
    "--banner-focus-color": styles.focusColor,
  } as React.CSSProperties;

  if (href) {
    return (
      <a href={href} className={className} style={style}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {children}
    </button>
  );
}
