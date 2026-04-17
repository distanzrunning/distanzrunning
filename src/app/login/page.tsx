// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import { Login } from "@/components/ui/Login";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        setTimeout(() => {
          window.location.href = "/";
        }, 250);
      } else {
        setError("Incorrect password");
        setIsLoading(false);
      }
    } catch {
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

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
