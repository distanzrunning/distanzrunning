"use client";

import React, { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// ============================================================================
// Types
// ============================================================================

export type LoginFieldType = "text" | "email" | "password";

export interface LoginField {
  /** Unique identifier for the field — used as the key in onSubmit values */
  id: string;
  /** HTML input type */
  type?: LoginFieldType;
  /** Accessible label (rendered sr-only by default; set visibleLabel to show it above the input) */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** autoComplete hint */
  autoComplete?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Initial value */
  defaultValue?: string;
  /** Render the label visibly above the input instead of sr-only (default: false) */
  visibleLabel?: boolean;
  /** Autofocus on mount */
  autoFocus?: boolean;
}

export interface LoginProvider {
  /** Unique identifier — used as the React key */
  id: string;
  /** Button label, e.g. "Continue with Google" */
  label: string;
  /** Icon rendered before the label */
  icon?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /**
   * Render a "Last Used" badge in the top-right corner of the button —
   * a returning-user hint surfaced on whichever provider was used last.
   */
  lastUsed?: boolean;
}

export interface LoginProps {
  /**
   * Optional brand mark shown (centred, no background) above the title.
   * Pass a sized icon/logomark node — it renders as-is on the canvas.
   */
  logo?: React.ReactNode;
  /** Title shown above the form */
  title?: string;
  /** Optional description shown under the title */
  subtitle?: string;
  /** OAuth / social providers rendered above the email form */
  providers?: LoginProvider[];
  /**
   * Divider between providers and fields. `true` renders the default
   * "Or continue with email" label, or pass a string for custom text.
   * Only shown when both providers and fields are present.
   */
  divider?: string | boolean;
  /** Form fields, in render order */
  fields?: LoginField[];
  /** Submit button label when idle */
  submitLabel?: string;
  /** Submit button label when loading */
  loadingLabel?: string;
  /** External loading flag */
  isLoading?: boolean;
  /** Error message rendered above the submit button */
  error?: string;
  /** Called with { [fieldId]: value } when the form is submitted (client mode) */
  onSubmit?: (values: Record<string, string>) => void | Promise<void>;
  /**
   * Server Action / form action — when passed, the form posts directly
   * via React's <form action> instead of calling onSubmit. Use with
   * useActionState for progressive-enhancement auth flows.
   */
  action?: (formData: FormData) => void | Promise<void>;
  /** Small legal / privacy text rendered under the submit button */
  disclaimer?: React.ReactNode;
  /** Footer slot — e.g. "Forgot password?" or sign-up link */
  footer?: React.ReactNode;
  /** Additional classes on the outer card */
  className?: string;
}

// ============================================================================
// Password toggle
// ============================================================================

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      className="flex items-center justify-center text-textSubtle hover:text-textDefault transition-colors"
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        width: 20,
        height: 20,
      }}
    >
      {visible ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </button>
  );
}

// ============================================================================
// Login Component
// ============================================================================

/**
 * Login — a composable, boxless auth form: an optional brand mark / logo,
 * a title, optional OAuth/social providers (each with an optional "Last Used"
 * badge), configurable fields (text / email / password), submit button, error
 * state, and footer slot. Password fields get a built-in show/hide toggle.
 *
 * @example
 * <Login
 *   title="Sign in"
 *   fields={[
 *     { id: "email", type: "email", placeholder: "Email", required: true },
 *     { id: "password", type: "password", placeholder: "Password", required: true },
 *   ]}
 *   onSubmit={(values) => console.log(values)}
 * />
 */
export function Login({
  logo,
  title,
  subtitle,
  providers,
  divider,
  fields,
  submitLabel = "Sign in",
  loadingLabel = "Authenticating…",
  isLoading = false,
  error,
  onSubmit,
  action,
  disclaimer,
  footer,
  className,
}: LoginProps) {
  const effectiveFields = fields ?? [];
  const hasFields = effectiveFields.length > 0;
  const hasProviders = (providers?.length ?? 0) > 0;
  const showDivider = hasProviders && hasFields && divider !== false && divider !== undefined;
  const dividerLabel =
    typeof divider === "string" ? divider : "Or continue with email";

  const [values, setValues] = useState<Record<string, string>>(() =>
    effectiveFields.reduce<Record<string, string>>((acc, f) => {
      acc[f.id] = f.defaultValue ?? "";
      return acc;
    }, {}),
  );
  const [passwordVisible, setPasswordVisible] = useState<Record<string, boolean>>(
    {},
  );

  const handleChange = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [id]: e.target.value }));
  };

  const togglePassword = (id: string) => {
    setPasswordVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit?.(values);
  };

  return (
    <div
      className={`flex w-full max-w-[320px] flex-col items-center gap-6 ${className ?? ""}`.trim()}
    >
      {(logo || title || subtitle) && (
        <div className="flex flex-col items-center gap-4">
          {logo && (
            <div className="flex items-center justify-center">{logo}</div>
          )}
          {(title || subtitle) && (
            <div className="flex flex-col items-center gap-2 text-center">
              {title && (
                <h2 className="text-heading-32 text-textDefault">{title}</h2>
              )}
              {subtitle && (
                <p className="text-copy-16 text-textSubtle">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      )}

      {(hasProviders || hasFields || disclaimer) && (
        <div className="flex w-full flex-col gap-6">
          {hasProviders && (
            <div className="flex flex-col gap-4">
              {providers!.map((p) => (
                <div key={p.id} className="relative">
                  {p.lastUsed && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge variant="blue" size="sm">
                        Last Used
                      </Badge>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="large"
                    className="w-full"
                    onClick={p.onClick}
                    disabled={isLoading || !p.onClick}
                    prefixIcon={p.icon}
                  >
                    {p.label}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {showDivider && (
            <div
              className="flex items-center gap-3"
              aria-hidden="true"
            >
              <span
                className="flex-1 h-px"
                style={{ background: "var(--ds-gray-400)" }}
              />
              <span
                className="text-copy-13 uppercase"
                style={{ color: "var(--ds-gray-700)", letterSpacing: "0.04em" }}
              >
                {dividerLabel}
              </span>
              <span
                className="flex-1 h-px"
                style={{ background: "var(--ds-gray-400)" }}
              />
            </div>
          )}

          {hasFields && (
            <form
              className="space-y-4"
              {...(action ? { action } : { onSubmit: handleSubmit })}
              noValidate
            >
              {effectiveFields.map((field) => {
                const type = field.type ?? "text";
                const isPassword = type === "password";
                const visible = passwordVisible[field.id] ?? false;

                return (
                  <div key={field.id}>
                    {field.label && !field.visibleLabel && (
                      <label htmlFor={field.id} className="sr-only">
                        {field.label}
                      </label>
                    )}
                    <Input
                      id={field.id}
                      name={field.id}
                      type={isPassword && visible ? "text" : type}
                      label={field.visibleLabel ? field.label : undefined}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      required={field.required}
                      autoFocus={field.autoFocus}
                      value={values[field.id]}
                      onChange={handleChange(field.id)}
                      disabled={isLoading}
                      size="large"
                      error={Boolean(error)}
                      suffix={
                        isPassword ? (
                          <PasswordToggle
                            visible={visible}
                            onToggle={() => togglePassword(field.id)}
                          />
                        ) : undefined
                      }
                      suffixStyling={false}
                    />
                  </div>
                );
              })}

              {error && (
                <div
                  className="text-copy-14"
                  style={{ color: "var(--ds-red-900)" }}
                  role="alert"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="large"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? loadingLabel : submitLabel}
              </Button>

              {disclaimer && (
                <p
                  className="text-copy-13 text-center"
                  style={{ color: "var(--ds-gray-700)" }}
                >
                  {disclaimer}
                </p>
              )}
            </form>
          )}

          {!hasFields && disclaimer && (
            <p
              className="text-copy-13 text-center"
              style={{ color: "var(--ds-gray-700)" }}
            >
              {disclaimer}
            </p>
          )}
        </div>
      )}

      {footer && (
        <div className="text-copy-16 text-center text-textSubtle">{footer}</div>
      )}
    </div>
  );
}

export default Login;
