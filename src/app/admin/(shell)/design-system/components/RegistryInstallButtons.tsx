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

// v0 accepts a registry-item URL via this endpoint and opens the
// component in a fresh chat.
function v0OpenUrl(registryUrl: string): string {
  return `https://v0.dev/chat/api/open?url=${encodeURIComponent(registryUrl)}`;
}

function V0Mark() {
  return (
    <svg
      width="32"
      height="20"
      viewBox="0 0 40 20"
      fill="none"
      aria-hidden="true"
      style={{ display: "inline-block" }}
    >
      <path
        d="M23.5 5h6.4c2.6 0 4.6 1 4.6 4.5v.6c0 3.6-2 4.5-4.6 4.5h-1.5c-2.6 0-4.6-1-4.6-4.5V9.5c0-3.6 2-4.5 4.6-4.5h-4.9zm5.6 7.2h.6c1.3 0 1.6-.7 1.6-2v-.4c0-1.3-.4-2-1.6-2h-.6c-1.3 0-1.6.7-1.6 2v.4c0 1.3.4 2 1.6 2zM10 5l4.5 9.6h-3.4L7.5 7.5 4 14.6H.6L5.1 5h4.9z"
        fill="currentColor"
      />
    </svg>
  );
}

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
    <div className="flex items-center gap-2">
      <Tooltip content={copied ? "Copied" : "Copy npx command"}>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy npx install command"
          className="grid place-content-center rounded-md outline-none transition-colors bg-[var(--ds-background-100)] hover:bg-[var(--ds-gray-100)] focus-visible:bg-[var(--ds-gray-100)] text-[var(--ds-gray-900)] hover:text-[var(--ds-gray-1000)] cursor-pointer"
          style={{
            width: 36,
            height: 36,
            border: "1px solid var(--ds-gray-400)",
          }}
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </Tooltip>

      <a
        href={v0OpenUrl(registryUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md outline-none transition-colors no-underline cursor-pointer bg-[var(--ds-gray-1000)] text-[var(--ds-background-100)] hover:bg-[var(--ds-gray-900)] focus-visible:bg-[var(--ds-gray-900)]"
        style={{
          height: 36,
          paddingLeft: 14,
          paddingRight: 12,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Open in
        <V0Mark />
      </a>
    </div>
  );
}
