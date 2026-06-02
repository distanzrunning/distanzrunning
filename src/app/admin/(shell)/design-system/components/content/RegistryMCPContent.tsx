"use client";

import { Snippet } from "@/components/ui/Snippet";
import { Section } from "../ContentWithTOC";

const REGISTRY_URL =
  "https://distanzrunning.com/r/{name}.json";

const CLIENTS: { id: string; label: string; note: string }[] = [
  { id: "claude", label: "claude", note: "Claude Code CLI" },
  { id: "cursor", label: "cursor", note: "Cursor IDE" },
  { id: "vscode", label: "vscode", note: "VS Code (with Copilot or Continue)" },
  { id: "codex", label: "codex", note: "OpenAI Codex CLI" },
  { id: "opencode", label: "opencode", note: "OpenCode CLI" },
];

export default function RegistryMCPContent() {
  return (
    <>
      <Section>
        <div id="overview" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            Why a registry
          </h2>
          <p
            className="text-copy-16"
            style={{ color: "hsl(var(--color-textSubtle))", marginBottom: 16 }}
          >
            Every component in this design system is published as a
            shadcn-compatible registry item at{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              distanzrunning.com/r/&lt;name&gt;.json
            </code>
            . The registry is the bridge between this DS and the AI
            tools you prototype with — v0, Cursor, Claude Code, VS
            Code. When a model knows about the registry, the UI it
            generates uses the real Distanz components and tokens,
            not generic shadcn defaults.
          </p>
          <p
            className="text-copy-16"
            style={{ color: "hsl(var(--color-textSubtle))" }}
          >
            77 items are currently published — 26 atoms, 33
            molecules, 16 organisms, 1 template, plus the tokens
            bundle.
          </p>
        </div>
      </Section>

      <Section>
        <div id="add-registry" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            1. Add the registry to your project
          </h2>
          <p
            className="text-copy-16"
            style={{ color: "hsl(var(--color-textSubtle))", marginBottom: 16 }}
          >
            Inside any Next.js project that already runs shadcn (i.e.{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              components.json
            </code>{" "}
            exists), register Distanz Running under the{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              @distanz
            </code>{" "}
            namespace:
          </p>
          <Snippet
            text={`npx shadcn registry add @distanz=${REGISTRY_URL}`}
            prompt
          />
          <p
            className="text-copy-16"
            style={{
              color: "hsl(var(--color-textSubtle))",
              marginTop: 16,
            }}
          >
            From then on, any component is installable by namespace:
          </p>
          <div style={{ marginTop: 12 }}>
            <Snippet text="npx shadcn add @distanz/button" prompt />
          </div>
          <p
            className="text-copy-13"
            style={{
              color: "hsl(var(--color-textSubtler))",
              marginTop: 12,
            }}
          >
            Dependencies resolve automatically — installing any
            component also installs the tokens bundle and any other
            registry items it references.
          </p>
        </div>
      </Section>

      <Section>
        <div id="wire-mcp" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            2. Wire up MCP
          </h2>
          <p
            className="text-copy-16"
            style={{ color: "hsl(var(--color-textSubtle))", marginBottom: 16 }}
          >
            With the registry registered, point your AI tool at it
            via the Model Context Protocol. shadcn ships its own
            MCP server, so this is a one-liner:
          </p>
          <Snippet
            text="npx shadcn mcp init --client claude"
            prompt
          />
          <p
            className="text-copy-16"
            style={{
              color: "hsl(var(--color-textSubtle))",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Swap{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              claude
            </code>{" "}
            for any of the supported clients:
          </p>
          <ul
            className="text-copy-14"
            style={{
              color: "hsl(var(--color-textSubtle))",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {CLIENTS.map((c) => (
              <li
                key={c.id}
                style={{
                  padding: "6px 0",
                  borderBottom: "1px solid hsl(var(--color-borderDefault))",
                  display: "flex",
                  gap: 16,
                  alignItems: "baseline",
                }}
              >
                <code
                  className="text-label-13-mono"
                  style={{
                    color: "hsl(var(--color-textDefault))",
                    minWidth: 90,
                  }}
                >
                  {c.label}
                </code>
                <span style={{ color: "hsl(var(--color-textSubtler))" }}>
                  {c.note}
                </span>
              </li>
            ))}
          </ul>
          <p
            className="text-copy-13"
            style={{ color: "hsl(var(--color-textSubtler))", marginTop: 16 }}
          >
            Each variant writes the same{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              .mcp.json
            </code>{" "}
            to your project (or the client&apos;s config dir, where
            relevant), spawning{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              npx shadcn mcp
            </code>{" "}
            as the MCP server.
          </p>
        </div>
      </Section>

      <Section>
        <div id="use-it" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            3. Prompt your AI tool
          </h2>
          <p
            className="text-copy-16"
            style={{ color: "hsl(var(--color-textSubtle))", marginBottom: 16 }}
          >
            Once the MCP server is running, the model can search
            and install Distanz components on its own. A prompt
            like the one below will produce a page that uses the
            real Distanz Button, Input, and PanelCard — branded and
            token-aligned out of the box.
          </p>
          <div
            style={{
              background: "var(--ds-gray-100)",
              borderRadius: 6,
              padding: 16,
              color: "hsl(var(--color-textDefault))",
              fontStyle: "italic",
            }}
            className="text-copy-14"
          >
            “Build a contact form using the @distanz components.
            Wrap it in a PanelCard with a header, two Inputs (name,
            email), a Textarea, and a primary Button. Use Distanz
            tokens for spacing.”
          </div>
          <p
            className="text-copy-13"
            style={{ color: "hsl(var(--color-textSubtler))", marginTop: 16 }}
          >
            Without MCP, the model would hallucinate prop names and
            variants. With MCP, it queries the registry first and
            uses the actual definitions.
          </p>
        </div>
      </Section>

      <Section>
        <div id="without-mcp" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            Using the registry without MCP
          </h2>
          <p
            className="text-copy-16"
            style={{ color: "hsl(var(--color-textSubtle))", marginBottom: 16 }}
          >
            Every component page in this DS also exposes a “Copy
            npx command” button in the top-right of its header. If
            you just want to install a single component manually,
            grab the URL from there — no namespace setup needed:
          </p>
          <Snippet
            text="npx shadcn add https://distanzrunning.com/r/button.json"
            prompt
          />
        </div>
      </Section>

      <Section>
        <div id="token-conventions" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            Token conventions &amp; v2 migration
          </h2>
          <p
            className="text-copy-16"
            style={{ color: "hsl(var(--color-textSubtle))", marginBottom: 16 }}
          >
            Colour tokens follow Geist&rsquo;s two-layer model. Each
            colour&rsquo;s single source of truth is an{" "}
            <strong>HSL channel triplet</strong> —{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              --ds-blue-700-value: 213, 100%, 48%
            </code>{" "}
            — that flips between light/dark. The opaque token is
            resolved once (<code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              --ds-blue-700: hsl(var(--ds-blue-700-value))
            </code>) and a P3 <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              @media
            </code>{" "}
            block layers exact OKLCH on top for wide-gamut displays.
          </p>
          <p
            className="text-copy-16"
            style={{ color: "hsl(var(--color-textSubtle))", marginBottom: 16 }}
          >
            Because channels are HSL, always consume them through{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              hsl(var(--color-X))
            </code>{" "}
            or{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              hsla(var(--ds-X-value), α)
            </code>{" "}
            — never <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              rgb()
            </code>.
          </p>
          <div
            style={{
              border: "1px solid hsl(var(--color-borderSubtle))",
              background: "hsl(var(--color-surface))",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <p
              className="text-copy-14"
              style={{ color: "hsl(var(--color-textDefault))", marginBottom: 8 }}
            >
              <strong>Breaking change — tokens v2.0.0.</strong> The old{" "}
              <code
                className="text-label-13-mono"
                style={{
                  background: "var(--ds-gray-100)",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                --ds-*-rgb
              </code>{" "}
              companions were removed (they had drifted from the OKLCH
              source). If you installed any item before v2, run this
              find-and-replace across your code, then re-pull the tokens:
            </p>
            <ul
              className="text-copy-14 list-disc pl-6"
              style={{ color: "hsl(var(--color-textSubtle))", marginBottom: 12 }}
            >
              <li>
                <code className="text-label-13-mono">rgb(var(--color-</code> →{" "}
                <code className="text-label-13-mono">hsl(var(--color-</code>
              </li>
              <li>
                <code className="text-label-13-mono">rgba(var(--color-</code> →{" "}
                <code className="text-label-13-mono">hsla(var(--color-</code>
              </li>
              <li>
                <code className="text-label-13-mono">--ds-X-rgb</code> →{" "}
                <code className="text-label-13-mono">--ds-X-value</code>{" "}
                (and wrap translucent uses in{" "}
                <code className="text-label-13-mono">hsla()</code>)
              </li>
            </ul>
            <Snippet
              text="npx shadcn add https://distanzrunning.com/r/tokens.json"
              prompt
            />
          </div>
        </div>
      </Section>
    </>
  );
}
