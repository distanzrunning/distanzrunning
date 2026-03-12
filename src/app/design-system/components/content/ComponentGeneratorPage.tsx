"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles, Copy, Download, Trash2, Loader2, Check, Eye, Code, Bot, User, Send } from "lucide-react";
import { transform } from "sucrase";
import { Button } from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { CodeBlock } from "@/components/ui/CodeBlock";

// ============================================================================
// Types
// ============================================================================

type GeneratorState = "idle" | "generating" | "preview" | "refining" | "deploying";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isThinking?: boolean;
  code?: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

// ============================================================================
// Iframe Preview
// ============================================================================

function cleanGeneratedCode(code: string): string {
  // Strip markdown code fences if Claude included them
  let cleaned = code.replace(/^```\w*\n?/gm, "").replace(/```\s*$/gm, "");
  // Strip "use client" directive (not needed in iframe)
  cleaned = cleaned.replace(/^["']use client["'];?\s*/m, "");
  return cleaned.trim();
}

function buildPreviewHtml(code: string): string {
  try {
    const cleaned = cleanGeneratedCode(code);
    // Sucrase handles imports (converts to require()), JSX, and TypeScript
    const transpiledCode = transform(cleaned, {
      transforms: ["typescript", "jsx", "imports"],
      jsxRuntime: "classic",
      jsxPragma: "React.createElement",
      jsxFragmentPragma: "React.Fragment",
      production: true,
    }).code;

    // Build HTML by concatenation to avoid template literal issues
    // (transpiled code may contain backticks and ${} expressions)
    const htmlParts = [
      '<!DOCTYPE html><html><head>',
      '<meta charset="utf-8" />',
      '<meta name="viewport" content="width=device-width, initial-scale=1" />',
      '<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin><\/script>',
      '<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin><\/script>',
      '<script src="https://cdn.tailwindcss.com"><\/script>',
      '<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"><\/script>',
      '<style>',
      ':root {',
      '--ds-gray-100:#fafafa;--ds-gray-200:#f5f5f5;--ds-gray-300:#ebebeb;',
      '--ds-gray-400:#e0e0e0;--ds-gray-500:#c7c7c7;--ds-gray-600:#a0a0a0;',
      '--ds-gray-700:#8c8c8c;--ds-gray-800:#6e6e6e;--ds-gray-900:#444444;',
      '--ds-gray-1000:#171717;',
      '--ds-blue-100:#eef6ff;--ds-blue-200:#d8ebff;--ds-blue-300:#b7d9ff;',
      '--ds-blue-400:#85bfff;--ds-blue-500:#4da3ff;--ds-blue-600:#2b8dff;',
      '--ds-blue-700:#0070f3;--ds-blue-800:#0060d1;--ds-blue-900:#004fa8;',
      '--ds-blue-1000:#003580;',
      '--ds-red-100:#fff0f0;--ds-red-200:#ffd9d9;--ds-red-300:#ffb3b3;',
      '--ds-red-400:#ff8080;--ds-red-500:#ff4d4d;--ds-red-600:#f03;',
      '--ds-red-700:#e00;--ds-red-800:#c00;--ds-red-900:#a00;--ds-red-1000:#700;',
      '--ds-amber-100:#fff8eb;--ds-amber-200:#ffeccc;--ds-amber-300:#ffdb99;',
      '--ds-amber-400:#ffc266;--ds-amber-500:#ffa833;--ds-amber-600:#ff9500;',
      '--ds-amber-700:#e08200;--ds-amber-800:#b86a00;--ds-amber-900:#8f5200;',
      '--ds-amber-1000:#663b00;',
      '--ds-green-100:#eefbf4;--ds-green-200:#d3f5e4;--ds-green-300:#a8ebc8;',
      '--ds-green-400:#6ddba1;--ds-green-500:#33cc7a;--ds-green-600:#1db965;',
      '--ds-green-700:#18a957;--ds-green-800:#128e47;--ds-green-900:#0d7339;',
      '--ds-green-1000:#085a2b;',
      '--ds-purple-100:#f5f0ff;--ds-purple-200:#e8dbff;--ds-purple-300:#d4b8ff;',
      '--ds-purple-400:#b78fff;--ds-purple-500:#9966ff;--ds-purple-600:#8247e5;',
      '--ds-purple-700:#6b2ec2;--ds-purple-800:#56209f;--ds-purple-900:#41177c;',
      '--ds-purple-1000:#2d105a;',
      '--ds-pink-100:#fff0f8;--ds-pink-200:#ffd6ed;--ds-pink-300:#ffadd6;',
      '--ds-pink-400:#ff80bf;--ds-pink-500:#ff4da6;--ds-pink-600:#f0278a;',
      '--ds-pink-700:#d61e78;--ds-pink-800:#b31664;--ds-pink-900:#8f0e50;',
      '--ds-pink-1000:#6b073c;',
      '--ds-teal-100:#edfcfc;--ds-teal-200:#d1f7f7;--ds-teal-300:#a3eded;',
      '--ds-teal-400:#6ee0e0;--ds-teal-500:#33cccc;--ds-teal-600:#20b8b8;',
      '--ds-teal-700:#18a3a3;--ds-teal-800:#128888;--ds-teal-900:#0d6e6e;',
      '--ds-teal-1000:#085454;',
      '--ds-background-100:#ffffff;--ds-background-200:#fafafa;',
      '--ds-space-2x:8px;--ds-space-3x:12px;--ds-space-4x:16px;',
      '--ds-space-6x:24px;--ds-space-8x:32px;',
      '--ds-space-gap:16px;--ds-space-gap-half:8px;',
      '--ds-radius-small:8px;--ds-radius-large:12px;--ds-radius-xlarge:16px;--ds-radius-full:9999px;',
      '--ds-shadow-small:0px 1px 2px rgba(0,0,0,0.04);',
      '--ds-shadow-medium:0px 2px 4px rgba(0,0,0,0.06);',
      '--ds-shadow-large:0px 4px 8px rgba(0,0,0,0.08);',
      '--ds-button-height-tiny:24px;--ds-button-height-small:32px;',
      '--ds-button-height-medium:40px;--ds-button-height-large:48px;',
      '}',
      '*{margin:0;padding:0;box-sizing:border-box;}',
      "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:24px;background:var(--ds-background-100);color:var(--ds-gray-1000);}",
      '</style></head><body><div id="root"></div>',
      '<script id="__code" type="text/plain">',
    ];

    // Encode the transpiled code as base64 to avoid any escaping issues
    const codeBase64 = btoa(unescape(encodeURIComponent(transpiledCode)));

    const scriptParts = [
      '<\/script>',
      '<script>',
      'var exports={};var module={exports:exports};',
      // Lucide icon shim
      'function createLucideIcon(n){var d=lucide.icons[n];if(!d)return function(){return null};return function(p){',
      'var ch=(d[2]||[]).map(function(c,i){return React.createElement(c[0],Object.assign({key:i},c[1]))});',
      "return React.createElement('svg',Object.assign({xmlns:'http://www.w3.org/2000/svg',",
      "width:p&&p.className&&p.className.match(/w-(\\d+)/)?parseInt(p.className.match(/w-(\\d+)/)[1])*4:24,",
      "height:p&&p.className&&p.className.match(/h-(\\d+)/)?parseInt(p.className.match(/h-(\\d+)/)[1])*4:24,",
      "viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,",
      "strokeLinecap:'round',strokeLinejoin:'round'},{className:p&&p.className,style:p&&p.style}),ch);};}",
      'var lucideReact={};',
      "if(typeof lucide!=='undefined'&&lucide.icons){Object.keys(lucide.icons).forEach(function(k){",
      "var p=k.replace(/(^|-)([a-z])/g,function(_,__,c){return c.toUpperCase()});",
      'lucideReact[p]=createLucideIcon(k);});}',
      "function require(m){if(m==='react')return React;if(m==='react-dom'||m==='react-dom/client')return ReactDOM;if(m==='lucide-react')return lucideReact;return{};}",
      'try{',
      // Decode and eval the base64-encoded transpiled code
      "var __code=decodeURIComponent(escape(atob('" + codeBase64 + "')));",
      'var __fn=new Function("exports","module","require",__code);',
      '__fn(exports,module,require);',
      "var Component=exports.default||module.exports.default;",
      "if(Component&&typeof Component==='function'){",
      "ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Component));",
      "}else{document.getElementById('root').innerHTML='<p style=\"color:var(--ds-red-700)\">No default export found</p>';}",
      '}catch(e){',
      "document.getElementById('root').innerHTML='<pre style=\"color:var(--ds-red-700);white-space:pre-wrap;font-size:13px\">'+e.message+'</pre>';",
      '}',
      '<\/script></body></html>',
    ];

    return htmlParts.join('\n') + scriptParts.join('\n');
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    // Log the problematic code for debugging
    console.error("Transpilation failed:", msg);
    const lines = code.split("\n");
    const match = msg.match(/\((\d+):\d+\)/);
    const errLine = match ? parseInt(match[1]) : -1;
    const context = errLine > 0
      ? lines.slice(Math.max(0, errLine - 3), errLine + 2).map((l, i) => {
          const lineNum = Math.max(1, errLine - 2) + i;
          return (lineNum === errLine ? ">>> " : "    ") + lineNum + ": " + l;
        }).join("\n")
      : "";
    const debugInfo = context ? "\n\nNear line " + errLine + ":\n" + context : "";
    return "<!DOCTYPE html><html><body><pre style='color:var(--ds-red-700);padding:24px;font-size:13px;white-space:pre-wrap'>Transpilation error:\n" + msg + debugInfo + "</pre></body></html>";
  }
}

// ============================================================================
// Chat Message Component
// ============================================================================

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className="flex-shrink-0 mt-0.5 flex items-center justify-center rounded-full"
        style={{
          width: "28px",
          height: "28px",
          backgroundColor: isUser ? "var(--ds-blue-700)" : "var(--ds-gray-1000)",
          color: "white",
        }}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" />
        ) : (
          <Bot className="w-3.5 h-3.5" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`flex flex-col gap-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}
      >
        <span className="text-label-12 text-textSubtler">
          {isUser ? "You" : "Generator"}
        </span>
        <div
          className="rounded-lg px-3 py-2 text-copy-14"
          style={{
            backgroundColor: isUser
              ? "var(--ds-blue-100)"
              : "var(--ds-background-200)",
            color: "var(--ds-gray-1000)",
            border: isUser ? "1px solid var(--ds-blue-300)" : "1px solid var(--ds-gray-400)",
          }}
        >
          {message.isThinking ? (
            <div className="flex items-center gap-2" style={{ color: "var(--ds-gray-600)" }}>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="text-copy-13">Generating component...</span>
            </div>
          ) : (
            <p className="m-0 whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Component
// ============================================================================

export default function ComponentGeneratorPage() {
  const [state, setState] = useState<GeneratorState>("idle");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [componentName, setComponentName] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [toast, setToast] = useState<Toast | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const extractName = (code: string): string => {
    const match = code.match(/export\s+default\s+function\s+(\w+)/);
    return match ? match[1] : "GeneratedComponent";
  };

  const addMessage = (role: "user" | "assistant", content: string, extras?: Partial<ChatMessage>) => {
    const msg: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      role,
      content,
      ...extras,
    };
    setMessages((prev) => [...prev, msg]);
    return msg.id;
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  // Generate component via streaming API
  const handleGenerate = useCallback(async () => {
    const text = inputValue.trim();
    if (!text) return;

    const isRefinement = generatedCode.length > 0;

    // Add user message
    addMessage("user", text);
    setInputValue("");

    // Add thinking message
    const thinkingId = addMessage("assistant", "", { isThinking: true });

    setState(isRefinement ? "refining" : "generating");

    abortRef.current = new AbortController();

    try {
      const body: Record<string, string> = isRefinement
        ? { prompt: messages.find((m) => m.role === "user")?.content || text, refinement: text, previousCode: generatedCode }
        : { prompt: text };

      const res = await fetch("/api/generate-component", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        updateMessage(thinkingId, {
          isThinking: false,
          content: err.error || "Generation failed. Please try again.",
        });
        setState(generatedCode ? "preview" : "idle");
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let accumulated = "";

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

      // Clean any markdown fences from the final output
      const finalCode = cleanGeneratedCode(accumulated);
      setGeneratedCode(finalCode);
      const name = extractName(finalCode);
      setComponentName(name);
      setState("preview");

      // Update thinking message to completion message
      updateMessage(thinkingId, {
        isThinking: false,
        content: isRefinement
          ? `Updated ${name}. Check the preview to see the changes.`
          : `Generated ${name}. You can preview it on the right, refine it by sending another message, or deploy it to your UI library.`,
        code: accumulated,
      });
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      updateMessage(thinkingId, {
        isThinking: false,
        content: "Generation failed. Please try again.",
      });
      setState(generatedCode ? "preview" : "idle");
    }
  }, [inputValue, generatedCode, messages]);

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
      addMessage("assistant", `Deployed ${componentName} to ${data.path}`);
      setState("preview");
    } catch {
      showToast("Deploy failed", "error");
      setState("preview");
    }
  }, [generatedCode, componentName]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedCode]);

  const handleDelete = useCallback(() => {
    setGeneratedCode("");
    setComponentName("");
    setMessages([]);
    setInputValue("");
    setState("idle");
    if (abortRef.current) abortRef.current.abort();
  }, []);

  const isLoading = state === "generating" || state === "refining" || state === "deploying";
  const hasPreview = generatedCode.length > 0;

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* Header */}
      <div>
        <h1 className="text-heading-32 text-textDefault mb-2">Component Generator</h1>
        <p className="text-copy-16 text-textSubtle">
          Describe a component in natural language to generate, preview, and deploy it.
        </p>
      </div>

      {/* Main layout: Chat left, Preview right */}
      <div
        className="flex gap-0 rounded-lg overflow-hidden"
        style={{
          border: "1px solid var(--ds-gray-400)",
          height: "calc(100vh - 320px)",
          minHeight: "500px",
        }}
      >
        {/* ============================================================ */}
        {/* LEFT: Chat Panel */}
        {/* ============================================================ */}
        <div
          className="flex flex-col"
          style={{
            width: hasPreview ? "400px" : "100%",
            minWidth: "340px",
            borderRight: hasPreview ? "1px solid var(--ds-gray-400)" : "none",
            backgroundColor: "var(--ds-background-100)",
            transition: "width 0.3s ease",
          }}
        >
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "var(--ds-purple-100)",
                    color: "var(--ds-purple-700)",
                  }}
                >
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-label-14 text-textDefault font-medium">
                    Describe a component
                  </p>
                  <p className="text-copy-13 text-textSubtler">
                    e.g. &quot;A notification banner with success, warning, and error variants&quot;
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div
            className="flex items-end gap-2 p-3"
            style={{
              borderTop: "1px solid var(--ds-gray-400)",
              backgroundColor: "var(--ds-background-200)",
            }}
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={hasPreview ? "Describe changes..." : "Describe your component..."}
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none rounded-md px-3 py-2 text-copy-14 text-textDefault placeholder:text-textSubtler outline-none"
              style={{
                border: "1px solid var(--ds-gray-400)",
                backgroundColor: "var(--ds-background-100)",
                minHeight: "40px",
                maxHeight: "120px",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--ds-gray-600)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--ds-gray-400)")}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isLoading && inputValue.trim()) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <Button
              size="medium"
              variant="default"
              shape="square"
              onClick={handleGenerate}
              disabled={isLoading || !inputValue.trim()}
              loading={isLoading}
            >
              {!isLoading && <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT: Preview/Code Panel */}
        {/* ============================================================ */}
        {hasPreview && (
          <div
            className="flex flex-col flex-1 min-w-0"
            style={{ backgroundColor: "var(--ds-background-100)" }}
          >
            {/* Toolbar */}
            <div
              className="flex items-center justify-between px-3 flex-shrink-0"
              style={{
                height: "48px",
                borderBottom: "1px solid var(--ds-gray-400)",
                backgroundColor: "var(--ds-background-200)",
              }}
            >
              {/* Toggle: Preview / Code */}
              <div
                className="flex items-center rounded-md p-0.5"
                style={{
                  backgroundColor: "var(--ds-gray-200)",
                  border: "1px solid var(--ds-gray-400)",
                }}
              >
                <button
                  onClick={() => setActiveTab("preview")}
                  className="flex items-center gap-1.5 rounded px-2.5 py-1 text-label-13 transition-colors"
                  style={{
                    backgroundColor: activeTab === "preview" ? "var(--ds-background-100)" : "transparent",
                    color: activeTab === "preview" ? "var(--ds-gray-1000)" : "var(--ds-gray-600)",
                    boxShadow: activeTab === "preview" ? "var(--ds-shadow-small)" : "none",
                  }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className="flex items-center gap-1.5 rounded px-2.5 py-1 text-label-13 transition-colors"
                  style={{
                    backgroundColor: activeTab === "code" ? "var(--ds-background-100)" : "transparent",
                    color: activeTab === "code" ? "var(--ds-gray-1000)" : "var(--ds-gray-600)",
                    boxShadow: activeTab === "code" ? "var(--ds-shadow-small)" : "none",
                  }}
                >
                  <Code className="w-3.5 h-3.5" />
                  Code
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {componentName && (
                  <span
                    className="text-label-12 rounded px-2 py-0.5 mr-2"
                    style={{
                      backgroundColor: "var(--ds-gray-200)",
                      color: "var(--ds-gray-800)",
                    }}
                  >
                    {componentName}
                  </span>
                )}
                <IconButton
                  variant="tertiary"
                  size="small"
                  aria-label={copied ? "Copied" : "Copy code"}
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </IconButton>
                <IconButton
                  variant="tertiary"
                  size="small"
                  aria-label="Deploy to ui/"
                  onClick={() => handleDeploy()}
                  disabled={state === "deploying"}
                >
                  <Download className="w-4 h-4" />
                </IconButton>
                <IconButton
                  variant="tertiary"
                  size="small"
                  aria-label="Discard"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </IconButton>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto">
              {activeTab === "preview" ? (
                state === "generating" || state === "refining" ? (
                  <div className="flex items-center justify-center h-full gap-2" style={{ color: "var(--ds-gray-600)" }}>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-copy-14">Generating preview...</span>
                  </div>
                ) : (
                  <iframe
                    srcDoc={buildPreviewHtml(generatedCode)}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                    title="Component preview"
                  />
                )
              ) : (
                <div className="h-full overflow-auto [&_[data-code-block]]:border-0 [&_[data-code-block]]:rounded-none">
                  <CodeBlock
                    code={generatedCode}
                    language="tsx"
                    showLineNumbers
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
