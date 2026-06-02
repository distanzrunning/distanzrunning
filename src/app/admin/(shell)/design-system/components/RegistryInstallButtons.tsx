"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RegistryInstallButtonsProps {
  /** Registry item slug — e.g. "button" resolves to /r/button.json. */
  slug: string;
}

const REGISTRY_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://distanzrunning.com";

export function RegistryInstallButtons({ slug }: RegistryInstallButtonsProps) {
  const [copied, setCopied] = useState(false);
  const registryUrl = `${REGISTRY_ORIGIN}/r/${slug}.json`;
  const npxCommand = `npx shadcn add ${registryUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(npxCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable in insecure contexts — leave
      // the button in its resting state.
    }
  };

  return (
    <Button
      variant="secondary"
      size="small"
      onClick={handleCopy}
      prefixIcon={copied ? <Check /> : <Copy />}
    >
      Copy npx command
    </Button>
  );
}
