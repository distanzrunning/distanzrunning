"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { login } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: null });

  return (
    <form
      action={formAction}
      style={{
        width: "100%",
        maxWidth: 360,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 24,
        background: "var(--ds-background-100)",
        border: "1px solid var(--ds-gray-400)",
        borderRadius: 12,
        boxShadow: "var(--ds-shadow-menu)",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            lineHeight: "24px",
            margin: 0,
            color: "var(--ds-gray-1000)",
          }}
        >
          Admin Access
        </h1>
        <p
          style={{
            marginTop: 6,
            marginBottom: 0,
            fontSize: 13,
            lineHeight: 1.55,
            color: "var(--ds-gray-700)",
          }}
        >
          Enter the admin password to continue.
        </p>
      </div>
      <Input
        name="password"
        type="password"
        label="Password"
        autoFocus
        autoComplete="current-password"
        error={!!state?.error}
        errorMessage={state?.error ?? undefined}
        required
      />
      <Button type="submit" loading={pending} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
