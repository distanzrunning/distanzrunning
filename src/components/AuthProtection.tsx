// src/components/AuthProtection.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";

interface AuthProtectionProps {
  children: React.ReactNode;
}

function AuthStatus({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={32} />
        <p className="text-sm text-textSubtle">{message}</p>
      </div>
    </div>
  );
}

export default function AuthProtection({ children }: AuthProtectionProps) {
  // Check if we're on staging domain BEFORE setting initial state
  const isStagingDomain =
    typeof window !== "undefined" &&
    window.location.hostname === "distanzrunning.vercel.app";

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    isStagingDomain ? null : true,
  );
  const [isLoading, setIsLoading] = useState(isStagingDomain);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isStagingDomain) {
      return;
    }

    const checkAuth = async () => {
      try {
        if (pathname === "/login") {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/auth", {
          method: "GET",
          credentials: "same-origin",
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);

          if (!data.authenticated) {
            router.replace("/login");
            return;
          }
        } else {
          setIsAuthenticated(false);
          router.replace("/login");
          return;
        }
      } catch (error) {
        console.error("❌ AuthProtection: Auth check failed:", error);
        setIsAuthenticated(false);
        router.replace("/login");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router, isStagingDomain]);

  if (isLoading) {
    return <AuthStatus message="Checking authentication..." />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <AuthStatus message="Redirecting to login..." />;
}
