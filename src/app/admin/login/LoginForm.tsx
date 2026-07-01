"use client";

import { useActionState } from "react";
import { Login } from "@/components/ui/Login";
import { login } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: null });

  return (
    <Login
      title="Admin Access"
      fields={[
        {
          id: "password",
          type: "password",
          label: "Password",
          placeholder: "Password",
          autoComplete: "current-password",
          required: true,
          autoFocus: true,
        },
      ]}
      submitLabel="Sign in"
      loadingLabel="Signing in…"
      error={state?.error ?? undefined}
      isLoading={pending}
      action={formAction}
    />
  );
}
