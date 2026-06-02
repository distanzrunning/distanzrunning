// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import { Spinner } from "@/components/ui/Spinner";
import { Login } from "@/components/ui/Login";

function AuthenticatingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--ds-background-200)" }}
    >
      <div className="flex flex-col items-center gap-6">
        <Spinner size={32} />
        <p
          style={{
            fontSize: 24,
            lineHeight: "32px",
            fontWeight: 500,
            color: "var(--ds-gray-1000)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Authenticating
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  const handleSubmit = async (values: Record<string, string>) => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password }),
        credentials: "same-origin",
      });

      const data = await response.json().catch(() => ({ success: false }));

      if (data.success) {
        setAuthenticating(true);
        // Small pause so the success screen is perceptible before the
        // browser fully navigates.
        setTimeout(() => {
          window.location.href = "/";
        }, 400);
      } else {
        setError("Incorrect password");
        setIsLoading(false);
      }
    } catch {
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

  if (authenticating) {
    return (
      <DarkModeProvider>
        <AuthenticatingScreen />
      </DarkModeProvider>
    );
  }

  return (
    <DarkModeProvider>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--ds-background-200)",
          padding: 24,
        }}
      >
        <Login
          title="Staging Access"
          subtitle="Enter the staging password to continue."
          fields={[
            {
              id: "password",
              type: "password",
              label: "Password",
              visibleLabel: true,
              autoComplete: "current-password",
              required: true,
              autoFocus: true,
            },
          ]}
          submitLabel="Sign in"
          loadingLabel="Signing in…"
          error={error || undefined}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </main>
    </DarkModeProvider>
  );
}
