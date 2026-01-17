// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "same-origin",
      });

      const data = await response.json();

      if (data.success) {
        // Add a small delay to ensure cookie is set before redirect
        setTimeout(() => {
          window.location.href = "/";
        }, 250); // 250ms delay
      } else {
        setError("Incorrect password");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-canvas transition-colors duration-300 flex items-center justify-center p-4">
        {/* Login container */}
        <div className="w-full max-w-sm bg-surface rounded-xl p-8 shadow-sm border border-borderSubtle transition-colors duration-300">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src="/images/Distanz_Logo_1600_600_Black.svg"
                alt="Distanz Running Logo"
                className="block dark:hidden"
                style={{ height: "60px", width: "auto" }}
              />
              <img
                src="/images/logo_white.svg"
                alt="Distanz Running Logo"
                className="hidden dark:block"
                style={{ height: "60px", width: "auto" }}
              />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-textDefault leading-tight text-center">
              Staging Access
            </h2>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Password field */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative flex border border-borderDefault rounded-lg hover:border-borderDefaultHover focus-within:ring-2 focus-within:ring-borderDefault focus-within:border-borderDefaultHover transition-colors duration-300 overflow-hidden">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 px-3 py-3 bg-surfaceSubtle text-textDefault placeholder:text-textSubtle focus:outline-none"
                    placeholder="Password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center w-11 border-l border-borderDefault bg-surfaceSubtle text-textSubtle hover:text-textDefault transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <Button type="submit" className="w-full">
                {isLoading ? "Authenticating..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DarkModeProvider>
  );
}
