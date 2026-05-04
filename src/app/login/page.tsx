// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

function AuthenticatingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: "var(--ds-background-200)" }}>
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
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
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
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 360,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 24,
            background: "var(--ds-background-100)",
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
              Staging Access
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
              Enter the staging password to continue.
            </p>
          </div>
          <Input
            name="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            error={!!error}
            errorMessage={error || undefined}
            disabled={isLoading}
            required
          />
          <Button type="submit" loading={isLoading} disabled={isLoading}>
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </main>
    </DarkModeProvider>
  );
}
