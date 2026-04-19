"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DesignSystemPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/design-system/introduction");
  }, [router]);

  return null;
}
