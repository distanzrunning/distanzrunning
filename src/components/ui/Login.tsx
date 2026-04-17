"use client";

import React, { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// ============================================================================
// Types
// ============================================================================

export type LoginFieldType = "text" | "email" | "password";

export interface LoginField {
  /** Unique identifier for the field — used as the key in onSubmit values */
  id: string;
  /** HTML input type */
  type?: LoginFieldType;
  /** Accessible label (rendered sr-only when not provided as visible label) */
  label?: string;
  /** Placeholder text */
  placeholder: string;
  /** autoComplete hint */
  autoComplete?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Initial value */
  defaultValue?: string;
}

export interface LoginProps {
  /** Optional header slot — typically a logo */
  header?: React.ReactNode;
  /** Card title */
  title?: string;
  /** Optional description shown under the title */
  subtitle?: string;
  /** Form fields, in render order */
  fields: LoginField[];
  /** Submit button label when idle */
  submitLabel?: string;
  /** Submit button label when loading */
  loadingLabel?: string;
  /** External loading flag */
  isLoading?: boolean;
  /** Error message rendered above the submit button */
  error?: string;
  /** Called with { [fieldId]: value } when the form is submitted */
  onSubmit?: (values: Record<string, string>) => void | Promise<void>;
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
 * Login card — a composable form with a logo slot, title, configurable
 * fields (text / email / password), submit button, error state, and footer
 * slot. Password fields get a built-in show/hide toggle.
 *
 * @example
 * <Login
 *   header={<img src="/brand/wordmark-black.svg" alt="Logo" height={60} />}
 *   title="Sign in"
 *   fields={[
 *     { id: "email", type: "email", placeholder: "Email", required: true },
 *     { id: "password", type: "password", placeholder: "Password", required: true },
 *   ]}
 *   onSubmit={(values) => console.log(values)}
 * />
 */
export function Login({
  header,
  title,
  subtitle,
  fields,
  submitLabel = "Sign in",
  loadingLabel = "Authenticating...",
  isLoading = false,
  error,
  onSubmit,
  footer,
  className,
}: LoginProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    fields.reduce<Record<string, string>>((acc, f) => {
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
      className={`w-full max-w-sm bg-surface rounded-xl p-8 border border-borderSubtle ${className ?? ""}`.trim()}
      style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)" }}
    >
      <div className="space-y-6">
        {header && <div className="flex justify-center">{header}</div>}

        {(title || subtitle) && (
          <div className="space-y-2 text-center">
            {title && (
              <h2 className="text-xl font-semibold text-textDefault leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-textSubtle leading-normal">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {fields.map((field) => {
            const type = field.type ?? "text";
            const isPassword = type === "password";
            const visible = passwordVisible[field.id] ?? false;

            return (
              <div key={field.id}>
                {field.label && (
                  <label htmlFor={field.id} className="sr-only">
                    {field.label}
                  </label>
                )}
                <Input
                  id={field.id}
                  name={field.id}
                  type={isPassword && visible ? "text" : type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required={field.required}
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
              className="text-sm"
              style={{ color: "var(--ds-red-900)" }}
              role="alert"
            >
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="large" disabled={isLoading}>
            {isLoading ? loadingLabel : submitLabel}
          </Button>
        </form>

        {footer && <div className="text-center text-sm">{footer}</div>}
      </div>
    </div>
  );
}

export default Login;
