"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles, Copy, Download, Trash2, RefreshCw, Loader2, Check, Eye, Code } from "lucide-react";
import { transform } from "sucrase";

// ============================================================================
// Types
// ============================================================================

type GeneratorState = "idle" | "generating" | "preview" | "refining" | "deploying";

interface Toast {
  message: string;
  type: "success" | "error";
}

// ============================================================================
// Iframe Preview
// ============================================================================

function buildPreviewHtml(code: string): string {
  try {
    const transpiledCode = transform(code, {
      transforms: ["typescript", "jsx"],
      jsxRuntime: "classic",
      jsxPragma: "React.createElement",
      jsxFragmentPragma: "React.Fragment",
      production: true,
    }).code;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://unpkg.com/lucide-static@latest/font/lucide.min.css" />
  <style>
    :root {
      --ds-gray-100: #fafafa; --ds-gray-200: #f5f5f5; --ds-gray-300: #ebebeb;
      --ds-gray-400: #e0e0e0; --ds-gray-500: #c7c7c7; --ds-gray-600: #a0a0a0;
      --ds-gray-700: #8c8c8c; --ds-gray-800: #6e6e6e; --ds-gray-900: #444444;
      --ds-gray-1000: #171717;
      --ds-blue-100: #eef6ff; --ds-blue-200: #d8ebff; --ds-blue-300: #b7d9ff;
      --ds-blue-400: #85bfff; --ds-blue-500: #4da3ff; --ds-blue-600: #2b8dff;
      --ds-blue-700: #0070f3; --ds-blue-800: #0060d1; --ds-blue-900: #004fa8;
      --ds-blue-1000: #003580;
      --ds-red-100: #fff0f0; --ds-red-200: #ffd9d9; --ds-red-300: #ffb3b3;
      --ds-red-400: #ff8080; --ds-red-500: #ff4d4d; --ds-red-600: #f03;
      --ds-red-700: #e00; --ds-red-800: #c00; --ds-red-900: #a00;
      --ds-red-1000: #700;
      --ds-amber-100: #fff8eb; --ds-amber-200: #ffeccc; --ds-amber-300: #ffdb99;
      --ds-amber-400: #ffc266; --ds-amber-500: #ffa833; --ds-amber-600: #ff9500;
      --ds-amber-700: #e08200; --ds-amber-800: #b86a00; --ds-amber-900: #8f5200;
      --ds-amber-1000: #663b00;
      --ds-green-100: #eefbf4; --ds-green-200: #d3f5e4; --ds-green-300: #a8ebc8;
      --ds-green-400: #6ddba1; --ds-green-500: #33cc7a; --ds-green-600: #1db965;
      --ds-green-700: #18a957; --ds-green-800: #128e47; --ds-green-900: #0d7339;
      --ds-green-1000: #085a2b;
      --ds-purple-100: #f5f0ff; --ds-purple-200: #e8dbff; --ds-purple-300: #d4b8ff;
      --ds-purple-400: #b78fff; --ds-purple-500: #9966ff; --ds-purple-600: #8247e5;
      --ds-purple-700: #6b2ec2; --ds-purple-800: #56209f; --ds-purple-900: #41177c;
      --ds-purple-1000: #2d105a;
      --ds-pink-100: #fff0f8; --ds-pink-200: #ffd6ed; --ds-pink-300: #ffadd6;
      --ds-pink-400: #ff80bf; --ds-pink-500: #ff4da6; --ds-pink-600: #f0278a;
      --ds-pink-700: #d61e78; --ds-pink-800: #b31664; --ds-pink-900: #8f0e50;
      --ds-pink-1000: #6b073c;
      --ds-teal-100: #edfcfc; --ds-teal-200: #d1f7f7; --ds-teal-300: #a3eded;
      --ds-teal-400: #6ee0e0; --ds-teal-500: #33cccc; --ds-teal-600: #20b8b8;
      --ds-teal-700: #18a3a3; --ds-teal-800: #128888; --ds-teal-900: #0d6e6e;
      --ds-teal-1000: #085454;
      --ds-background-100: #ffffff; --ds-background-200: #fafafa;
      --ds-space-2x: 8px; --ds-space-3x: 12px; --ds-space-4x: 16px;
      --ds-space-6x: 24px; --ds-space-8x: 32px;
      --ds-space-gap: 16px; --ds-space-gap-half: 8px;
      --ds-radius-small: 8px; --ds-radius-large: 12px; --ds-radius-xlarge: 16px; --ds-radius-full: 9999px;
      --ds-shadow-small: 0px 1px 2px rgba(0,0,0,0.04);
      --ds-shadow-medium: 0px 2px 4px rgba(0,0,0,0.06);
      --ds-shadow-large: 0px 4px 8px rgba(0,0,0,0.08);
      --ds-button-height-tiny: 24px; --ds-button-height-small: 32px;
      --ds-button-height-medium: 40px; --ds-button-height-large: 48px;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; background: var(--ds-background-100); color: var(--ds-gray-1000); }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    try {
      ${transpiledCode}
      const Component = typeof exports !== 'undefined' ? exports.default : null;
      if (Component) {
        ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Component));
      } else {
        document.getElementById('root').innerHTML = '<p style="color:var(--ds-red-700)">No default export found</p>';
      }
    } catch (e) {
      document.getElementById('root').innerHTML = '<pre style="color:var(--ds-red-700);white-space:pre-wrap;font-size:13px">' + e.message + '</pre>';
    }
  </script>
</body>
</html>`;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return `<!DOCTYPE html><html><body><pre style="color:red;padding:24px;font-size:13px">Transpilation error:\n${msg}</pre></body></html>`;
  }
}

// ============================================================================
// Component
// ============================================================================

export default function ComponentGeneratorPage() {
  const [state, setState] = useState<GeneratorState>("idle");
  const [prompt, setPrompt] = useState("");
  const [refinement, setRefinement] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [componentName, setComponentName] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [toast, setToast] = useState<Toast | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  // Extract component name from generated code
  const extractName = (code: string): string => {
    const match = code.match(/export\s+default\s+function\s+(\w+)/);
    return match ? match[1] : "GeneratedComponent";
  };

  // Generate component via streaming API
  const handleGenerate = useCallback(async (isRefinement = false) => {
    const currentPrompt = isRefinement ? refinement : prompt;
    if (!currentPrompt.trim()) return;

    setState(isRefinement ? "refining" : "generating");
    if (!isRefinement) setGeneratedCode("");

    abortRef.current = new AbortController();

    try {
      const body: Record<string, string> = isRefinement
        ? { prompt, refinement: currentPrompt, previousCode: generatedCode }
        : { prompt: currentPrompt };

      const res = await fetch("/api/generate-component", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Generation failed", "error");
        setState(generatedCode ? "preview" : "idle");
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let accumulated = isRefinement ? "" : "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                showToast(parsed.error, "error");
                continue;
              }
              if (parsed.text) {
                accumulated += parsed.text;
                setGeneratedCode(accumulated);
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }

      const name = extractName(accumulated);
      setComponentName(name);
      setState("preview");
      if (isRefinement) {
        setRefinement("");
        showToast("Component refined", "success");
      }
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      showToast("Generation failed", "error");
      setState(generatedCode ? "preview" : "idle");
    }
  }, [prompt, refinement, generatedCode]);

  // Deploy component
  const handleDeploy = useCallback(async (overwrite = false) => {
    if (!generatedCode || !componentName) return;
    setState("deploying");

    try {
      const res = await fetch("/api/deploy-component", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ componentName, code: generatedCode, overwrite }),
      });

      const data = await res.json();

      if (res.status === 409 && data.exists) {
        const confirmed = window.confirm(
          `${componentName}.tsx already exists. Overwrite?`
        );
        if (confirmed) {
          await handleDeploy(true);
          return;
        }
        setState("preview");
        return;
      }

      if (!res.ok) {
        showToast(data.error || "Deploy failed", "error");
        setState("preview");
        return;
      }

      showToast(`Deployed to ${data.path}`, "success");
      setState("preview");
    } catch {
      showToast("Deploy failed", "error");
      setState("preview");
    }
  }, [generatedCode, componentName]);

  // Copy code to clipboard
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedCode]);

  // Reset everything
  const handleDelete = useCallback(() => {
    setGeneratedCode("");
    setComponentName("");
    setPrompt("");
    setRefinement("");
    setState("idle");
    if (abortRef.current) abortRef.current.abort();
  }, []);

  const isLoading = state === "generating" || state === "refining" || state === "deploying";

  return (
    <div className="flex flex-col gap-8 max-w-full">
      {/* Header */}
      <div>
        <h1 className="text-heading-32 text-textDefault mb-2">Component Generator</h1>
        <p className="text-copy-16 text-textSubtle">
          Generate React components using natural language. Components use design system tokens and can be deployed directly to the UI library.
        </p>
      </div>

      {/* Prompt Input */}
      <div
        className="flex flex-col gap-3 rounded-lg p-5"
        style={{
          border: "1px solid var(--ds-gray-400)",
          backgroundColor: "var(--ds-background-100)",
        }}
      >
        <label className="text-label-14 text-textDefault font-medium">
          Describe your component
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A notification banner with an icon, title, message, and dismiss button. Support success, warning, and error variants."
          disabled={isLoading}
          rows={3}
          className="w-full resize-none rounded-md px-3 py-2 text-copy-14 text-textDefault placeholder:text-textSubtler outline-none transition-colors"
          style={{
            border: "1px solid var(--ds-gray-400)",
            backgroundColor: "var(--ds-background-200)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--ds-gray-600)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--ds-gray-400)")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey && !isLoading && prompt.trim()) {
              handleGenerate(false);
            }
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-copy-13 text-textSubtler">
            {prompt.trim() ? "⌘ Enter to generate" : ""}
          </span>
          <button
            onClick={() => handleGenerate(false)}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-2 rounded-md px-4 text-button-14 font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              height: "var(--ds-button-height-medium)",
              backgroundColor: isLoading && state === "generating" ? "var(--ds-gray-800)" : "var(--ds-gray-1000)",
            }}
          >
            {state === "generating" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {state === "generating" ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      {(generatedCode || isLoading) && (
        <div
          className="flex flex-col rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--ds-gray-400)" }}
        >
          {/* Tabs + Actions bar */}
          <div
            className="flex items-center justify-between px-4"
            style={{
              height: "48px",
              borderBottom: "1px solid var(--ds-gray-400)",
              backgroundColor: "var(--ds-background-200)",
            }}
          >
            {/* Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("preview")}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-label-13 transition-colors"
                style={{
                  backgroundColor: activeTab === "preview" ? "var(--ds-background-100)" : "transparent",
                  color: activeTab === "preview" ? "var(--ds-gray-1000)" : "var(--ds-gray-700)",
                  boxShadow: activeTab === "preview" ? "var(--ds-gray-400) 0px 0px 0px 1px" : "none",
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-label-13 transition-colors"
                style={{
                  backgroundColor: activeTab === "code" ? "var(--ds-background-100)" : "transparent",
                  color: activeTab === "code" ? "var(--ds-gray-1000)" : "var(--ds-gray-700)",
                  boxShadow: activeTab === "code" ? "var(--ds-gray-400) 0px 0px 0px 1px" : "none",
                }}
              >
                <Code className="w-3.5 h-3.5" />
                Code
              </button>
            </div>

            {/* Actions */}
            {state === "preview" && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-label-13 transition-colors hover:bg-[var(--ds-gray-200)]"
                  style={{ color: "var(--ds-gray-700)" }}
                  title="Copy code"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={() => handleDeploy()}
                  disabled={state !== "preview"}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-label-13 transition-colors hover:bg-[var(--ds-gray-200)]"
                  style={{ color: "var(--ds-gray-700)" }}
                  title="Deploy to ui/"
                >
                  <Download className="w-3.5 h-3.5" />
                  Deploy
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-label-13 transition-colors hover:bg-[var(--ds-red-100)]"
                  style={{ color: "var(--ds-red-700)" }}
                  title="Discard"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ minHeight: "400px", backgroundColor: "var(--ds-background-100)" }}>
            {activeTab === "preview" ? (
              <iframe
                ref={iframeRef}
                srcDoc={generatedCode ? buildPreviewHtml(generatedCode) : ""}
                className="w-full border-0"
                style={{ minHeight: "400px" }}
                sandbox="allow-scripts"
                title="Component preview"
              />
            ) : (
              <div className="overflow-auto" style={{ maxHeight: "600px" }}>
                <pre
                  className="p-4 text-copy-13 leading-relaxed"
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: "var(--ds-gray-1000)",
                    fontFamily: "'Geist Mono', 'SF Mono', 'Fira Code', monospace",
                  }}
                >
                  {generatedCode || (isLoading ? "Generating..." : "")}
                </pre>
              </div>
            )}
          </div>

          {/* Refine bar */}
          {state === "preview" && (
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderTop: "1px solid var(--ds-gray-400)", backgroundColor: "var(--ds-background-200)" }}
            >
              <RefreshCw className="w-4 h-4 flex-shrink-0" style={{ color: "var(--ds-gray-600)" }} />
              <input
                type="text"
                value={refinement}
                onChange={(e) => setRefinement(e.target.value)}
                placeholder="Describe refinements... e.g. add a loading state, change colors"
                className="flex-1 bg-transparent text-copy-14 text-textDefault placeholder:text-textSubtler outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && refinement.trim()) {
                    handleGenerate(true);
                  }
                }}
              />
              <button
                onClick={() => handleGenerate(true)}
                disabled={!refinement.trim() || isLoading}
                className="flex items-center gap-1.5 rounded-md px-3 text-button-14 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  height: "var(--ds-button-height-small)",
                  backgroundColor: "var(--ds-background-100)",
                  color: "var(--ds-gray-1000)",
                  boxShadow: "var(--ds-gray-400) 0px 0px 0px 1px",
                }}
              >
                Refine
              </button>
            </div>
          )}
        </div>
      )}

      {/* Component name display */}
      {state === "preview" && componentName && (
        <div className="flex items-center gap-2 text-copy-13 text-textSubtle">
          <span>Component:</span>
          <code
            className="rounded px-1.5 py-0.5 text-copy-13"
            style={{
              backgroundColor: "var(--ds-gray-200)",
              color: "var(--ds-gray-900)",
            }}
          >
            {componentName}
          </code>
          <span style={{ color: "var(--ds-gray-500)" }}>·</span>
          <span>
            Deploy target:{" "}
            <code
              className="rounded px-1.5 py-0.5 text-copy-13"
              style={{
                backgroundColor: "var(--ds-gray-200)",
                color: "var(--ds-gray-900)",
              }}
            >
              src/components/ui/{componentName}.tsx
            </code>
          </span>
        </div>
      )}

      {/* Deploying overlay */}
      {state === "deploying" && (
        <div className="flex items-center gap-2 text-copy-14 text-textSubtle">
          <Loader2 className="w-4 h-4 animate-spin" />
          Deploying {componentName}...
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-copy-14 font-medium shadow-lg"
          style={{
            backgroundColor: toast.type === "success" ? "var(--ds-green-900)" : "var(--ds-red-900)",
            color: "white",
          }}
        >
          {toast.type === "success" ? <Check className="w-4 h-4" /> : null}
          {toast.message}
        </div>
      )}
    </div>
  );
}
