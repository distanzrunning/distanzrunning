// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import { Login } from "@/components/ui/Login";
import { Spinner } from "@/components/ui/Spinner";

function AuthenticatingScreen() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
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
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password }),
        credentials: "same-origin",
      });

      const data = await response.json();

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
      <div className="min-h-screen bg-canvas transition-colors duration-300 flex items-center justify-center p-4">
        <Login
          header={
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/wordmark-black.svg"
                alt="Distanz Running"
                className="block dark:hidden"
                style={{ height: 60, width: "auto" }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/wordmark-white.svg"
                alt="Distanz Running"
                className="hidden dark:block"
                style={{ height: 60, width: "auto" }}
              />
            </>
          }
          title="Staging Access"
          fields={[
            {
              id: "password",
              type: "password",
              label: "Password",
              placeholder: "Password",
              autoComplete: "current-password",
              required: true,
            },
          ]}
          isLoading={isLoading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </DarkModeProvider>
  );
}
