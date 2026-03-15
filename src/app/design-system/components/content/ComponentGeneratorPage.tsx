"use client";

import { useState, useRef, useCallback, useEffect, useContext } from "react";
import { Sparkles, Copy, Download, Trash2, Loader2, Check, Eye, Code, Bot, User, Send, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { DarkModeContext } from "@/components/DarkModeProvider";

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
// Code Extraction
// ============================================================================

/**
 * Extract actual code from AI output that may include markdown fences or
 * explanatory text before/after the code block.
 */
function extractCodeFromResponse(raw: string): string {
  let cleaned = raw;

  // Strip markdown code fences if present
  const fenceMatch = cleaned.match(
    /```(?:tsx?|jsx?|javascript|typescript)?\s*\n([\s\S]*?)```/,
  );
  if (fenceMatch) {
    cleaned = fenceMatch[1];
  } else {
    const openFence = cleaned.match(
      /```(?:tsx?|jsx?|javascript|typescript)?\s*\n([\s\S]*)/,
    );
    if (openFence) {
      cleaned = openFence[1];
    }
    cleaned = cleaned
      .replace(/^```\w*\n?/gm, "")
      .replace(/```\s*$/gm, "");
  }

  // If the response starts with non-code text (AI explanation), find where code begins
  const lines = cleaned.split("\n");
  const codeStartIdx = lines.findIndex((line) => {
    const trimmed = line.trim();
    return (
      /^["']use client["']/.test(trimmed) ||
      trimmed.startsWith("import ") ||
      trimmed.startsWith("import{") ||
      trimmed.startsWith("export ") ||
      trimmed.startsWith("const ") ||
      trimmed.startsWith("let ") ||
      trimmed.startsWith("var ") ||
      trimmed.startsWith("function ") ||
      trimmed.startsWith("class ") ||
      trimmed.startsWith("interface ") ||
      trimmed.startsWith("type ") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*")
    );
  });

  if (codeStartIdx > 0) {
    cleaned = lines.slice(codeStartIdx).join("\n");
  }

  return cleaned.trim();
}

// ============================================================================
// Iframe Preview
// ============================================================================

// Prepare transpiled ESM code for inline embedding in a single <script type="module">.
// Strips import/export statements since the wrapper provides all dependencies,
// and captures the default export as __Component__ for mounting.
function prepareForInline(code: string): string {
  // Remove all import lines — the wrapper script provides React, hooks, lucide icons, etc.
  let prepared = code.replace(/^\s*import\s+[\s\S]*?\s+from\s+["'][^"']+["'];?\s*$/gm, "");

  // Capture default export as __Component__
  const defaultFnMatch = prepared.match(/export\s+default\s+function\s+(\w+)/);
  const defaultClassMatch = prepared.match(/export\s+default\s+class\s+(\w+)/);

  if (defaultFnMatch) {
    prepared = prepared.replace(/export\s+default\s+function\s+/, "function ");
    prepared += `\nvar __Component__ = ${defaultFnMatch[1]};`;
  } else if (defaultClassMatch) {
    prepared = prepared.replace(/export\s+default\s+class\s+/, "class ");
    prepared += `\nvar __Component__ = ${defaultClassMatch[1]};`;
  } else {
    // export default <expression> (arrow function, etc.)
    prepared = prepared.replace(/export\s+default\s+/, "var __Component__ = ");
  }

  // Remove remaining named exports
  prepared = prepared.replace(/^\s*export\s+\{[^}]*\};?\s*$/gm, "");
  prepared = prepared.replace(/^\s*export\s+(const|let|var|function|class)\s+/gm, "$1 ");

  return prepared;
}

function buildPreviewHtml(transpiledCode: string, isDark: boolean): string {
  const componentCode = prepareForInline(transpiledCode);
  const encodedCode = JSON.stringify(componentCode).replace(/<\//g, "<\\/");

  // Output the correct token values directly based on isDark — no class-based switching
  // needed for custom properties. This avoids any srcDoc parsing issues with html class attributes.
  const grayTokens = isDark
    ? "--ds-gray-100:#1a1a1a;--ds-gray-200:#1f1f1f;--ds-gray-300:#292929;--ds-gray-400:#2e2e2e;--ds-gray-500:#454545;--ds-gray-600:#878787;--ds-gray-700:#8f8f8f;--ds-gray-800:#7d7d7d;--ds-gray-900:#a1a1a1;--ds-gray-1000:#ededed;"
    : "--ds-gray-100:#fafafa;--ds-gray-200:#f5f5f5;--ds-gray-300:#ebebeb;--ds-gray-400:#e0e0e0;--ds-gray-500:#c7c7c7;--ds-gray-600:#a0a0a0;--ds-gray-700:#8c8c8c;--ds-gray-800:#6e6e6e;--ds-gray-900:#444444;--ds-gray-1000:#171717;";
  const grayAlphaTokens = isDark
    ? "--ds-gray-alpha-100:rgba(255,255,255,0.06);--ds-gray-alpha-200:rgba(255,255,255,0.09);--ds-gray-alpha-300:rgba(255,255,255,0.13);--ds-gray-alpha-400:rgba(255,255,255,0.14);--ds-gray-alpha-500:rgba(255,255,255,0.24);--ds-gray-alpha-600:rgba(255,255,255,0.51);--ds-gray-alpha-700:rgba(255,255,255,0.54);--ds-gray-alpha-800:rgba(255,255,255,0.47);--ds-gray-alpha-900:rgba(255,255,255,0.61);--ds-gray-alpha-1000:rgba(255,255,255,0.92);"
    : "--ds-gray-alpha-100:rgba(0,0,0,0.05);--ds-gray-alpha-200:rgba(0,0,0,0.09);--ds-gray-alpha-300:rgba(0,0,0,0.13);--ds-gray-alpha-400:rgba(0,0,0,0.17);--ds-gray-alpha-500:rgba(0,0,0,0.24);--ds-gray-alpha-600:rgba(0,0,0,0.4);--ds-gray-alpha-700:rgba(0,0,0,0.49);--ds-gray-alpha-800:rgba(0,0,0,0.62);--ds-gray-alpha-900:rgba(0,0,0,0.77);--ds-gray-alpha-1000:rgba(0,0,0,0.92);";
  const blueTokens = isDark
    ? "--ds-blue-100:#101c30;--ds-blue-200:#11233d;--ds-blue-300:#143052;--ds-blue-400:#163961;--ds-blue-500:#194574;--ds-blue-600:#0099ff;--ds-blue-700:#0070f3;--ds-blue-800:#0062d4;--ds-blue-900:#52a9ff;--ds-blue-1000:#ebf8ff;"
    : "--ds-blue-100:#eef6ff;--ds-blue-200:#d8ebff;--ds-blue-300:#b7d9ff;--ds-blue-400:#85bfff;--ds-blue-500:#4da3ff;--ds-blue-600:#2b8dff;--ds-blue-700:#0070f3;--ds-blue-800:#0060d1;--ds-blue-900:#004fa8;--ds-blue-1000:#003580;";
  const redTokens = isDark
    ? "--ds-red-100:#32171b;--ds-red-200:#411c21;--ds-red-300:#5a2229;--ds-red-400:#6c2730;--ds-red-500:#842d38;--ds-red-600:#d75555;--ds-red-700:#d75555;--ds-red-800:#c83c3c;--ds-red-900:#ff6c6c;--ds-red-1000:#ffebeb;"
    : "--ds-red-100:#fff0f0;--ds-red-200:#ffd9d9;--ds-red-300:#ffb3b3;--ds-red-400:#ff8080;--ds-red-500:#ff4d4d;--ds-red-600:#f03;--ds-red-700:#e00;--ds-red-800:#c00;--ds-red-900:#a00;--ds-red-1000:#700;";
  const amberTokens = isDark
    ? "--ds-amber-100:#291a00;--ds-amber-200:#332000;--ds-amber-300:#4d3000;--ds-amber-400:#593700;--ds-amber-500:#714700;--ds-amber-600:#da9e24;--ds-amber-700:#f5a400;--ds-amber-800:#e68c00;--ds-amber-900:#e68c00;--ds-amber-1000:#fff5dc;"
    : "--ds-amber-100:#fff8eb;--ds-amber-200:#ffeccc;--ds-amber-300:#ffdb99;--ds-amber-400:#ffc266;--ds-amber-500:#ffa833;--ds-amber-600:#ff9500;--ds-amber-700:#e08200;--ds-amber-800:#b86a00;--ds-amber-900:#8f5200;--ds-amber-1000:#663b00;";
  const greenTokens = isDark
    ? "--ds-green-100:#0f2716;--ds-green-200:#11311c;--ds-green-300:#143820;--ds-green-400:#144526;--ds-green-500:#1e5e34;--ds-green-600:#328c50;--ds-green-700:#2fa34c;--ds-green-800:#248b3d;--ds-green-900:#66d982;--ds-green-1000:#e6fdeb;"
    : "--ds-green-100:#eefbf4;--ds-green-200:#d3f5e4;--ds-green-300:#a8ebc8;--ds-green-400:#6ddba1;--ds-green-500:#33cc7a;--ds-green-600:#1db965;--ds-green-700:#18a957;--ds-green-800:#128e47;--ds-green-900:#0d7339;--ds-green-1000:#085a2b;";
  const purpleTokens = isDark
    ? "--ds-purple-100:#261a32;--ds-purple-200:#2f2040;--ds-purple-300:#3e2a58;--ds-purple-400:#483069;--ds-purple-500:#56387e;--ds-purple-600:#7950be;--ds-purple-700:#7950be;--ds-purple-800:#643ca0;--ds-purple-900:#b482eb;--ds-purple-1000:#f8f0ff;"
    : "--ds-purple-100:#f5f0ff;--ds-purple-200:#e8dbff;--ds-purple-300:#d4b8ff;--ds-purple-400:#b78fff;--ds-purple-500:#9966ff;--ds-purple-600:#8247e5;--ds-purple-700:#6b2ec2;--ds-purple-800:#56209f;--ds-purple-900:#41177c;--ds-purple-1000:#2d105a;";
  const pinkTokens = isDark
    ? "--ds-pink-100:#301828;--ds-pink-200:#3c1e2a;--ds-pink-300:#4e2636;--ds-pink-400:#502638;--ds-pink-500:#642d44;--ds-pink-600:#a03c64;--ds-pink-700:#eb377d;--ds-pink-800:#da2d73;--ds-pink-900:#f078a5;--ds-pink-1000:#ffebf5;"
    : "--ds-pink-100:#fff0f8;--ds-pink-200:#ffd6ed;--ds-pink-300:#ffadd6;--ds-pink-400:#ff80bf;--ds-pink-500:#ff4da6;--ds-pink-600:#f0278a;--ds-pink-700:#d61e78;--ds-pink-800:#b31664;--ds-pink-900:#8f0e50;--ds-pink-1000:#6b073c;";
  const tealTokens = isDark
    ? "--ds-teal-100:#0c231f;--ds-teal-200:#0f2b26;--ds-teal-300:#143832;--ds-teal-400:#123a33;--ds-teal-500:#1e554b;--ds-teal-600:#3c8c7d;--ds-teal-700:#1aa390;--ds-teal-800:#118b7a;--ds-teal-900:#66d9c3;--ds-teal-1000:#e1fdf8;"
    : "--ds-teal-100:#edfcfc;--ds-teal-200:#d1f7f7;--ds-teal-300:#a3eded;--ds-teal-400:#6ee0e0;--ds-teal-500:#33cccc;--ds-teal-600:#20b8b8;--ds-teal-700:#18a3a3;--ds-teal-800:#128888;--ds-teal-900:#0d6e6e;--ds-teal-1000:#085454;";
  const bgTokens = isDark
    ? "--ds-background-100:#0a0a0a;--ds-background-200:#000000;"
    : "--ds-background-100:#ffffff;--ds-background-200:#fafafa;";
  const shadowTokens = isDark
    ? "--ds-shadow-small:0 1px 2px rgba(0,0,0,0.3);--ds-shadow-medium:0 2px 4px rgba(0,0,0,0.4);--ds-shadow-large:0 4px 8px rgba(0,0,0,0.5);"
    : "--ds-shadow-small:0 1px 2px rgba(0,0,0,0.04);--ds-shadow-medium:0 2px 4px rgba(0,0,0,0.06);--ds-shadow-large:0 4px 8px rgba(0,0,0,0.08);";

  const lines = [
    `<!DOCTYPE html><html class="${isDark ? "dark" : ""}"><head>`,
    '<meta charset="utf-8" />',
    // Set dark class via JS as well, in case srcDoc HTML attribute is stripped
    isDark ? "<script>document.documentElement.classList.add('dark')</" + "script>" : "",
    '<script src="https://cdn.tailwindcss.com"></' + 'script>',
    "<script>tailwind.config={darkMode:'class'}</" + "script>",
    "<style>",
    `:root {${isDark ? "color-scheme:dark;" : ""}`,
    grayTokens,
    grayAlphaTokens,
    blueTokens,
    redTokens,
    amberTokens,
    greenTokens,
    purpleTokens,
    pinkTokens,
    tealTokens,
    bgTokens,
    "--ds-space-2x:8px;--ds-space-3x:12px;--ds-space-4x:16px;--ds-space-6x:24px;--ds-space-8x:32px;--ds-space-gap:16px;--ds-space-gap-half:8px;",
    "--ds-radius-small:8px;--ds-radius-large:12px;--ds-radius-xlarge:16px;--ds-radius-full:9999px;",
    shadowTokens,
    "--ds-button-height-tiny:24px;--ds-button-height-small:32px;--ds-button-height-medium:40px;--ds-button-height-large:48px;",
    "}",
    "*{margin:0;padding:0;box-sizing:border-box;}",
    "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:24px;background:transparent;color:var(--ds-gray-1000);min-height:100vh;}",
    ".error-boundary{color:#e00;padding:1rem;border:2px solid #e00;margin:1rem;border-radius:8px;background:#fff0f0;white-space:pre-wrap;font-size:13px;font-family:monospace;}",
    "</style>",
    '<script type="importmap">',
    '{"imports":{',
    '"react":"https://esm.sh/react@18",',
    '"react-dom":"https://esm.sh/react-dom@18",',
    '"react-dom/client":"https://esm.sh/react-dom@18/client",',
    '"lucide-react":"https://esm.sh/lucide-react@latest?external=react"',
    "}}",
    "</" + "script>",
    "</head><body>",
    '<div id="root"></div>',
    '<script type="module">',
    "import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createContext, Fragment } from 'react';",
    "import ReactDOM from 'react-dom/client';",
    "import * as LucideIcons from 'lucide-react';",
    "",
    "// Expose React hooks and utilities as globals for eval'd component code",
    "Object.assign(window, { React, useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createContext, Fragment, ReactDOM });",
    "",
    "// Expose lucide icons without clobbering any browser globals (constructors, APIs, etc.)",
    "for (var _k in LucideIcons) { try { if (!(_k in window)) { window[_k] = LucideIcons[_k]; } } catch(e) {} }",
    "",
    "class ErrorBoundary extends React.Component {",
    "  constructor(props) { super(props); this.state = { hasError: false, error: null }; }",
    "  static getDerivedStateFromError(error) { return { hasError: true, error }; }",
    "  render() {",
    "    if (this.state.hasError) {",
    "      return React.createElement('div', { className: 'error-boundary' },",
    "        React.createElement('strong', null, 'Component Error'),",
    "        React.createElement('br'),",
    "        React.createElement('pre', null, this.state.error?.toString())",
    "      );",
    "    }",
    "    return this.props.children;",
    "  }",
    "}",
    "",
    "// Evaluate component code via indirect eval — catches syntax errors at runtime",
    "// instead of failing at parse time (which would blank the entire iframe).",
    "var __code = " + encodedCode + ";",
    "try {",
    "  (0, eval)(__code);",
    "  if (typeof __Component__ === 'function' || (typeof __Component__ === 'object' && __Component__)) {",
    "    var root = ReactDOM.createRoot(document.getElementById('root'));",
    "    root.render(React.createElement(ErrorBoundary, null, React.createElement(__Component__)));",
    "  } else {",
    "    document.getElementById('root').innerHTML = '<div class=\"error-boundary\">No component found. Make sure the code uses export default.</div>';",
    "  }",
    "} catch (e) {",
    "  document.getElementById('root').innerHTML = '<div class=\"error-boundary\"><strong>Error</strong><br/><pre>' + e.message + '</pre></div>';",
    "}",
    "</" + "script></body></html>",
  ];

  return lines.join("\n");
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
          backgroundColor: isUser ? "var(--ds-blue-700)" : "var(--ds-purple-700)",
          color: "var(--ds-background-100)",
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
  const { isDark } = useContext(DarkModeContext);
  const [state, setState] = useState<GeneratorState>("idle");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [transpiledCode, setTranspiledCode] = useState("");
  const [transpileError, setTranspileError] = useState("");
  const [componentName, setComponentName] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [toast, setToast] = useState<Toast | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Abort in-flight requests on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

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
    const fnMatch = code.match(/export\s+default\s+function\s+(\w+)/);
    if (fnMatch) return fnMatch[1];
    const classMatch = code.match(/export\s+default\s+class\s+(\w+)/);
    if (classMatch) return classMatch[1];
    return "GeneratedComponent";
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
      const firstUserMsg = messagesRef.current.find((m) => m.role === "user");
      // Build conversation history for refinements (exclude thinking messages)
      const history = isRefinement
        ? messagesRef.current
            .filter((m) => !m.isThinking && m.content)
            .map((m) => ({ role: m.role, content: m.role === "assistant" && m.code ? m.code : m.content }))
        : undefined;
      const body: Record<string, unknown> = isRefinement
        ? { prompt: firstUserMsg?.content || text, refinement: text, previousCode: generatedCode, history }
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
      let sseBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Flush the decoder and process any remaining buffered SSE data
          sseBuffer += decoder.decode();
          break;
        }

        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split("\n");
        // Keep the last (potentially incomplete) line in the buffer
        sseBuffer = lines.pop() || "";

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

      // Process any remaining data left in the SSE buffer after stream ends
      if (sseBuffer.trim()) {
        const remaining = sseBuffer.trim();
        if (remaining.startsWith("data: ")) {
          const data = remaining.slice(6);
          if (data !== "[DONE]") {
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }

      // Clean up AI output — strip markdown fences and explanatory text
      const cleanCode = extractCodeFromResponse(accumulated);

      // Store the cleaned code (for Code tab)
      setGeneratedCode(cleanCode);
      const name = extractName(cleanCode);
      setComponentName(name);

      // Transpile server-side
      try {
        const transpileRes = await fetch("/api/transpile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: cleanCode }),
        });
        const transpileData = await transpileRes.json();
        if (transpileRes.ok) {
          setTranspiledCode(transpileData.code);
          setTranspileError("");
        } else {
          // Include debug info (code tail + length) if available
          let errMsg = transpileData.error || "Transpilation failed";
          if (transpileData.codeTail) {
            errMsg += `\n\nCode ends with (${transpileData.codeLength} chars total):\n${transpileData.codeTail}`;
          }
          setTranspileError(errMsg);
          setTranspiledCode("");
        }
      } catch {
        setTranspileError("Failed to connect to transpile service");
        setTranspiledCode("");
      }

      setState("preview");

      // Update thinking message to completion message
      updateMessage(thinkingId, {
        isThinking: false,
        content: isRefinement
          ? `Updated ${name}. Check the preview to see the changes.`
          : `Generated ${name}. You can preview it on the right, refine it by sending another message, or deploy it to your UI library.`,
        code: cleanCode,
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
    setTranspiledCode("");
    setTranspileError("");
    setComponentName("");
    setMessages([]);
    setInputValue("");
    setState("idle");
    if (abortRef.current) abortRef.current.abort();
  }, []);

  const isLoading = state === "generating" || state === "refining" || state === "deploying";
  const hasPreview = generatedCode.length > 0;

  return (
    <div className="flex flex-col gap-6 p-12 flex-1">
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
            <div
              className="flex-1 overflow-auto"
              style={activeTab === "preview" ? {
                backgroundColor: "var(--ds-background-200)",
                backgroundImage: `linear-gradient(45deg, var(--ds-gray-alpha-100) 25%, transparent 25%, transparent 75%, var(--ds-gray-alpha-100) 75%), linear-gradient(45deg, var(--ds-gray-alpha-100) 25%, transparent 25%, transparent 75%, var(--ds-gray-alpha-100) 75%)`,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
              } : undefined}
            >
              {activeTab === "preview" ? (
                state === "generating" || state === "refining" ? (
                  <div className="flex items-center justify-center h-full gap-2" style={{ color: "var(--ds-gray-600)" }}>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-copy-14">Generating preview...</span>
                  </div>
                ) : transpileError ? (
                  <div className="p-6">
                    <pre className="text-copy-13 whitespace-pre-wrap" style={{ color: "var(--ds-red-700)" }}>
                      {transpileError}
                    </pre>
                  </div>
                ) : transpiledCode ? (
                  <iframe
                    key={`${transpiledCode}-${isDark}`}
                    srcDoc={buildPreviewHtml(transpiledCode, isDark)}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                    title="Component preview"
                  />
                ) : null
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
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
