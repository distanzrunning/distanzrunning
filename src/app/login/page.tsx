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
      <div className="min-h-screen bg-white dark:bg-[#0c0c0d] transition-colors duration-300 flex items-center justify-center p-4">
        {/* Logo and container wrapper */}
        <div className="w-full max-w-sm space-y-8">
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

          {/* Login container */}
          <div className="bg-neutralBgSubtle rounded-xl p-8 shadow-sm transition-colors duration-300">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-xl font-semibold text-textDefault leading-tight">
                  Staging Access
                </h2>
                <p className="text-sm text-textSubtle mt-2 leading-tight">
                  Enter the password to access the staging site
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Password field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-base font-normal text-textDefault"
                  >
                    Password
                  </label>
                  <div className="relative flex">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-3 pr-12 bg-gray-50 dark:bg-neutral-800 border border-borderNeutral rounded-lg text-textDefault placeholder:text-textSubtle focus:outline-none focus:ring-2 focus:ring-borderNeutral focus:border-borderNeutralHover hover:border-borderNeutralHover transition-colors duration-300"
                      placeholder="Enter staging password"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-11 border-l border-borderNeutral bg-asphalt-95 dark:bg-asphalt-20 rounded-r-lg text-asphalt-40 dark:text-asphalt-60 hover:text-asphalt-20 dark:hover:text-asphalt-80 transition-colors"
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
                  <div className="text-red-600 dark:text-red-400 text-sm">
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
      </div>
    </DarkModeProvider>
  );
}
