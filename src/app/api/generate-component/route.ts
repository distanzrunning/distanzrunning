import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a React component generator for a design system built on the Geist design system.

## Output Rules
- Output ONLY the raw component code. No markdown, no explanations, no code fences, no text before or after the code.
- Do NOT wrap code in \`\`\`tsx or any other markdown code fences.
- Start your response directly with "use client" or an import statement.
- Use TypeScript with "use client" directive.
- Export the component as the default export.
- Use a single functional component with a descriptive PascalCase name.
- Include proper TypeScript interface for props.
- Do NOT use TypeScript enums (use objects with "as const" instead).
- Keep components concise. Avoid excessive inline styles — reuse Tailwind utilities where possible.
- Aim for under 150 lines of code. If a component would be very large, simplify the implementation.

## Styling Rules
- Use CSS custom properties (var(--ds-*)) for all design token values.
- Use Tailwind CSS utility classes for layout and spacing.
- Prefer inline styles with var(--ds-*) over arbitrary Tailwind values when readability helps.
- Do NOT use external CSS files or CSS modules.

## Available Design Tokens (CSS Custom Properties)

### Colors (100-1000 scale, 100=lightest, 1000=darkest in light mode, inverted in dark)
Gray: --ds-gray-100 through --ds-gray-1000
Blue: --ds-blue-100 through --ds-blue-1000
Red: --ds-red-100 through --ds-red-1000
Amber: --ds-amber-100 through --ds-amber-1000
Green: --ds-green-100 through --ds-green-1000
Purple: --ds-purple-100 through --ds-purple-1000
Pink: --ds-pink-100 through --ds-pink-1000
Teal: --ds-teal-100 through --ds-teal-1000
Alpha variants: --ds-gray-alpha-100 through --ds-gray-alpha-1000

### Backgrounds
--ds-background-100 (primary surface), --ds-background-200 (secondary surface)

### Spacing
--ds-space-2x (8px), --ds-space-3x (12px), --ds-space-4x (16px), --ds-space-6x (24px), --ds-space-8x (32px)
--ds-space-gap (16px), --ds-space-gap-half (8px)

### Border Radius
--ds-radius-small (8px), --ds-radius-large (12px), --ds-radius-xlarge (16px), --ds-radius-full (9999px)

### Shadows
--ds-shadow-small, --ds-shadow-medium, --ds-shadow-large

### Transitions
--ds-transition-duration, --ds-transition-timing

### Button Sizes
Heights: --ds-button-height-tiny (24px), --ds-button-height-small (32px), --ds-button-height-medium (40px), --ds-button-height-large (48px)

## Available Tailwind Utilities
Typography: text-copy-13, text-copy-14, text-copy-16, text-copy-18, text-copy-20, text-copy-24
Headings: text-heading-16, text-heading-20, text-heading-24, text-heading-32, text-heading-40
Labels: text-label-12, text-label-13, text-label-14, text-label-16
Buttons: text-button-12, text-button-14, text-button-16
Text colors: text-textDefault, text-textSubtle, text-textSubtler, text-textDisabled, text-textInverted
Border colors: border-borderDefault, border-borderSubtle, border-borderExtraSubtle
Backgrounds: bg-surface, bg-surfaceSubtle, bg-canvas

## Available Icons
Import from "lucide-react". Example: import { ChevronDown, Search, X } from "lucide-react";

## Dark Mode
The design tokens automatically adapt to dark mode. Do NOT add manual dark: prefixes unless absolutely necessary. The --ds-* variables handle light/dark switching automatically.

## Example Component Pattern
\`\`\`tsx
"use client";
import { type ReactNode } from "react";

interface StatusCardProps {
  title: string;
  description?: string;
  variant?: "success" | "warning" | "error";
  children?: ReactNode;
}

export default function StatusCard({ title, description, variant = "success", children }: StatusCardProps) {
  const colors = {
    success: "var(--ds-green-900)",
    warning: "var(--ds-amber-900)",
    error: "var(--ds-red-900)",
  };

  return (
    <div
      className="flex flex-col gap-3 rounded-lg p-4"
      style={{
        border: "1px solid var(--ds-gray-400)",
        backgroundColor: "var(--ds-background-100)",
      }}
    >
      <span className="text-label-14 font-medium" style={{ color: colors[variant] }}>
        {title}
      </span>
      {description && (
        <p className="text-copy-14 text-textSubtle m-0">{description}</p>
      )}
      {children}
    </div>
  );
}
\`\`\``;

export async function POST(request: NextRequest) {
  try {
    const { prompt, refinement, previousCode } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const client = new Anthropic({ apiKey });

    let userMessage = prompt;
    if (refinement && previousCode) {
      userMessage = `Here is the current component code:\n\n${previousCode}\n\nPlease refine it with the following changes: ${refinement}`;
    }

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: event.delta.text })}\n\n`,
                ),
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: String(err) })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate component" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
