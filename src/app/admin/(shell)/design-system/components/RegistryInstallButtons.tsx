"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

interface RegistryInstallButtonsProps {
  /** Registry item slug — e.g. "button" resolves to /r/button.json. */
  slug: string;
}

const REGISTRY_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://distanzrunning.com";

const BUTTON_CLASS =
  "grid place-content-center rounded-md outline-none transition-colors bg-[var(--ds-background-100)] hover:bg-[var(--ds-gray-100)] focus-visible:bg-[var(--ds-gray-100)] text-[var(--ds-gray-900)] hover:text-[var(--ds-gray-1000)] cursor-pointer";

const BUTTON_STYLE = {
  width: 36,
  height: 36,
  border: "1px solid var(--ds-gray-400)",
} as const;

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

  // While `copied` is true, render the button without a Tooltip
  // wrapper so the tooltip vanishes on click — the icon flip to a
  // check is feedback enough.
  const Btn = (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy npx install command"
      className={BUTTON_CLASS}
      style={BUTTON_STYLE}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );

  return copied ? Btn : <Tooltip content="Copy npx command">{Btn}</Tooltip>;
}
