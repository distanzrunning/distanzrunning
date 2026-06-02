"use client";

import React, { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { TbBrandGoogleFilled } from "react-icons/tb";
import { Section } from "../ContentWithTOC";
import {
  useShikiHighlighter,
  getTokenStyle,
  type DualThemeToken,
} from "@/components/ui/useShikiHighlighter";
import { useToast } from "@/components/ui/Toast";
import { Login } from "@/components/ui/Login";

// ============================================================================
// Section header + copy link (matches other DS pages)
// ============================================================================

const HEADER_HEIGHT = 112;
const SECTION_PADDING = 48;

function LinkIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ width: 14, height: 14, color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.46968 1.46968C10.1433 -0.203925 12.8567 -0.203923 14.5303 1.46968C16.2039 3.14329 16.2039 5.85674 14.5303 7.53034L12.0303 10.0303L10.9697 8.96968L13.4697 6.46968C14.5575 5.38186 14.5575 3.61816 13.4697 2.53034C12.3819 1.44252 10.6182 1.44252 9.53034 2.53034L7.03034 5.03034L5.96968 3.96968L8.46968 1.46968ZM11.5303 5.53034L5.53034 11.5303L4.46968 10.4697L10.4697 4.46968L11.5303 5.53034ZM1.46968 14.5303C3.14329 16.2039 5.85673 16.204 7.53034 14.5303L10.0303 12.0303L8.96968 10.9697L6.46968 13.4697C5.38186 14.5575 3.61816 14.5575 2.53034 13.4697C1.44252 12.3819 1.44252 10.6182 2.53034 9.53034L5.03034 7.03034L3.96968 5.96968L1.46968 8.46968C-0.203923 10.1433 -0.203925 12.8567 1.46968 14.5303Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SectionHeader({
  id,
  children,
  onCopyLink,
}: {
  id: string;
  children: React.ReactNode;
  onCopyLink?: (message: string) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    onCopyLink?.("Copied link to clipboard");
    window.history.pushState(null, "", `#${id}`);
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;
      const scrollTarget = absoluteElementTop - HEADER_HEIGHT - SECTION_PADDING;
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative -ml-5 inline-block pl-5 no-underline outline-none text-inherit text-left cursor-pointer bg-transparent border-none"
      id={id}
      style={{ scrollMarginTop: 32 }}
    >
      <h2 className="text-heading-24 text-textDefault">
        <div className="absolute left-0 top-[8px] opacity-0 outline-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
          <LinkIcon />
        </div>
        {children}
      </h2>
    </button>
  );
}

// ============================================================================
// Code preview (preview box + collapsible code, matches other DS pages)
// ============================================================================

function RenderShikiToken({ token }: { token: DualThemeToken }) {
  const style = getTokenStyle(token);
  return <span style={style}>{token.content}</span>;
}

function CopyIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CopyIconButton({ copied }: { copied: boolean }) {
  return (
    <div className="relative w-4 h-4">
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
      >
        <CopyIcon />
      </span>
      <span
        className={`absolute inset-0 transition-all duration-150 ease-out ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      >
        <CheckIcon />
      </span>
    </div>
  );
}

interface CodePreviewProps {
  children: React.ReactNode;
  componentCode: string;
}

function CodePreview({ children, componentCode }: CodePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const tokenizedLines = useShikiHighlighter(componentCode, "tsx");
  const lines: DualThemeToken[][] =
    tokenizedLines ||
    componentCode.split("\n").map(
      (line) =>
        [
          {
            content: line,
            color: "rgb(var(--color-textDefault))",
            darkColor: "rgb(var(--color-textDefault))",
          },
        ] as DualThemeToken[],
    );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [componentCode]);

  return (
    <div className="border border-borderDefault rounded-lg w-full min-w-0 overflow-hidden">
      <div
        className="p-6 flex items-center justify-center min-h-[320px]"
        style={{ background: "var(--ds-background-100)" }}
      >
        {children}
      </div>
      <div style={{ background: "var(--ds-background-200)" }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-borderDefault"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>
        {isOpen && (
          <div
            className="border-t border-borderDefault overflow-x-auto font-mono text-copy-13"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-borderDefault opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-canvas hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>
              <pre className="overflow-x-auto py-4" data-code-block>
                <code className="block text-copy-13 leading-[20px] font-mono">
                  {lines.map((lineTokens, index) => (
                    <div
                      key={index}
                      className="flex px-4"
                      style={{ fontFeatureSettings: '"liga" off' }}
                    >
                      <span className="select-none w-[32px] min-w-[32px] text-right pr-4 text-textSubtler">
                        {index + 1}
                      </span>
                      <span className="flex-1 pr-4">
                        {lineTokens.map((token, i) => (
                          <RenderShikiToken key={i} token={token} />
                        ))}
                        {lineTokens.length === 0 && " "}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Logo slot used by the staging-gate variant
// ============================================================================

function WordmarkLogo() {
  // Intrinsic SVG viewBox is 1579.12 × 484.75 (aspect ratio ~3.26:1).
  // At height 40, width is ~130 — set both explicitly so the browser
  // reserves the layout slot before the SVG loads (prevents the
  // logo-pop on first paint).
  const dims = { width: 130, height: 40 };
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/wordmark-black.svg"
        alt="Distanz Running"
        className="block dark:hidden"
        width={dims.width}
        height={dims.height}
        loading="eager"
        decoding="async"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/wordmark-white.svg"
        alt=""
        aria-hidden="true"
        className="hidden dark:block"
        width={dims.width}
        height={dims.height}
        loading="eager"
        decoding="async"
      />
    </>
  );
}

// ============================================================================
// Demo components (live previews)
// ============================================================================

function StagingGateDemo() {
  return (
    <Login
      header={<WordmarkLogo />}
      title="Staging Access"
      fields={[
        {
          id: "password",
          type: "password",
          label: "Password",
          placeholder: "Password",
          autoComplete: "current-password",
          required: true,
        },
      ]}
      onSubmit={() => {}}
    />
  );
}

function EmailPasswordDemo() {
  return (
    <Login
      title="Sign in"
      subtitle="Welcome back to Distanz Running."
      fields={[
        {
          id: "email",
          type: "email",
          label: "Email",
          placeholder: "Email",
          autoComplete: "email",
          required: true,
        },
        {
          id: "password",
          type: "password",
          label: "Password",
          placeholder: "Password",
          autoComplete: "current-password",
          required: true,
        },
      ]}
      onSubmit={() => {}}
    />
  );
}

function ForgotPasswordDemo() {
  return (
    <Login
      title="Sign in"
      fields={[
        {
          id: "email",
          type: "email",
          label: "Email",
          placeholder: "Email",
          autoComplete: "email",
          required: true,
        },
        {
          id: "password",
          type: "password",
          label: "Password",
          placeholder: "Password",
          autoComplete: "current-password",
          required: true,
        },
      ]}
      footer={
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-textSubtle hover:text-textDefault underline"
        >
          Forgot password?
        </a>
      }
      onSubmit={() => {}}
    />
  );
}

function GoogleOnlyDemo() {
  return (
    <Login
      title="Sign in"
      providers={[
        {
          id: "google",
          label: "Continue with Google",
          icon: <TbBrandGoogleFilled size={18} />,
          onClick: () => {},
        },
      ]}
      footer={
        <span className="text-textSubtle">
          Don&apos;t have an account?{" "}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-textDefault underline"
          >
            Sign up
          </a>
        </span>
      }
    />
  );
}

function GoogleAndEmailDemo() {
  return (
    <Login
      title="Sign in"
      providers={[
        {
          id: "google",
          label: "Continue with Google",
          icon: <TbBrandGoogleFilled size={18} />,
          onClick: () => {},
        },
      ]}
      divider
      fields={[
        {
          id: "email",
          type: "email",
          label: "Email",
          placeholder: "Email",
          autoComplete: "email",
          required: true,
        },
        {
          id: "password",
          type: "password",
          label: "Password",
          placeholder: "Password",
          autoComplete: "current-password",
          required: true,
        },
      ]}
      onSubmit={() => {}}
    />
  );
}

function SignUpDemo() {
  return (
    <Login
      title="Create your account"
      providers={[
        {
          id: "google",
          label: "Continue with Google",
          icon: <TbBrandGoogleFilled size={18} />,
          onClick: () => {},
        },
      ]}
      divider="Or sign up with email"
      fields={[
        {
          id: "name",
          type: "text",
          label: "Full name",
          placeholder: "Full name",
          autoComplete: "name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email",
          placeholder: "Email",
          autoComplete: "email",
          required: true,
        },
      ]}
      submitLabel="Continue"
      disclaimer={
        <>
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-textDefault underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-textDefault underline"
          >
            Privacy Policy
          </a>
          .
        </>
      }
      onSubmit={() => {}}
    />
  );
}

function ErrorStateDemo() {
  return (
    <Login
      title="Sign in"
      fields={[
        {
          id: "email",
          type: "email",
          label: "Email",
          placeholder: "Email",
          autoComplete: "email",
          required: true,
          defaultValue: "runner@distanzrunning.com",
        },
        {
          id: "password",
          type: "password",
          label: "Password",
          placeholder: "Password",
          autoComplete: "current-password",
          required: true,
          defaultValue: "wrong",
        },
      ]}
      error="Incorrect email or password."
      onSubmit={() => {}}
    />
  );
}

// ============================================================================
// Code strings
// ============================================================================

const stagingGateCode = `import { Login } from '@/components/ui/Login';

export function StagingGate() {
  return (
    <Login
      header={<img src="/brand/wordmark-black.svg" alt="Logo" height={40} />}
      title="Staging Access"
      fields={[
        {
          id: 'password',
          type: 'password',
          placeholder: 'Password',
          autoComplete: 'current-password',
          required: true,
        },
      ]}
      onSubmit={(values) => {
        // POST values.password to /api/auth, redirect on success
      }}
    />
  );
}`;

const emailPasswordCode = `import { Login } from '@/components/ui/Login';

export function SignIn() {
  return (
    <Login
      title="Sign in"
      subtitle="Welcome back to Distanz Running."
      fields={[
        { id: 'email', type: 'email', placeholder: 'Email', autoComplete: 'email', required: true },
        { id: 'password', type: 'password', placeholder: 'Password', autoComplete: 'current-password', required: true },
      ]}
      onSubmit={(values) => {
        // values.email, values.password
      }}
    />
  );
}`;

const forgotPasswordCode = `import { Login } from '@/components/ui/Login';

export function SignInWithReset() {
  return (
    <Login
      title="Sign in"
      fields={[
        { id: 'email', type: 'email', placeholder: 'Email', required: true },
        { id: 'password', type: 'password', placeholder: 'Password', required: true },
      ]}
      footer={<a href="/forgot-password">Forgot password?</a>}
      onSubmit={(values) => {
        // ...
      }}
    />
  );
}`;

const googleOnlyCode = `import { TbBrandGoogleFilled } from 'react-icons/tb';
import { Login } from '@/components/ui/Login';

export function GoogleSignIn() {
  return (
    <Login
      title="Sign in"
      providers={[
        {
          id: 'google',
          label: 'Continue with Google',
          icon: <TbBrandGoogleFilled size={18} />,
          onClick: () => signInWithGoogle(),
        },
      ]}
      footer={<span>Don't have an account? <a href="/signup">Sign up</a></span>}
    />
  );
}`;

const googleAndEmailCode = `import { TbBrandGoogleFilled } from 'react-icons/tb';
import { Login } from '@/components/ui/Login';

export function SignIn() {
  return (
    <Login
      title="Sign in"
      providers={[
        {
          id: 'google',
          label: 'Continue with Google',
          icon: <TbBrandGoogleFilled size={18} />,
          onClick: () => signInWithGoogle(),
        },
      ]}
      divider
      fields={[
        { id: 'email', type: 'email', placeholder: 'Email', required: true },
        { id: 'password', type: 'password', placeholder: 'Password', required: true },
      ]}
      onSubmit={(values) => {
        // ...
      }}
    />
  );
}`;

const signUpCode = `import { TbBrandGoogleFilled } from 'react-icons/tb';
import { Login } from '@/components/ui/Login';

export function SignUp() {
  return (
    <Login
      title="Create your account"
      providers={[
        {
          id: 'google',
          label: 'Continue with Google',
          icon: <TbBrandGoogleFilled size={18} />,
          onClick: () => signInWithGoogle(),
        },
      ]}
      divider="Or sign up with email"
      fields={[
        { id: 'name', type: 'text', placeholder: 'Full name', required: true },
        { id: 'email', type: 'email', placeholder: 'Email', required: true },
      ]}
      submitLabel="Continue"
      disclaimer={
        <>
          By clicking continue, you agree to our{' '}
          <a href="/terms">Terms of Service</a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </>
      }
      onSubmit={(values) => {
        // ...
      }}
    />
  );
}`;

const errorStateCode = `import { useState } from 'react';
import { Login } from '@/components/ui/Login';

export function SignInWithError() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: Record<string, string>) => {
    setIsLoading(true);
    setError('');
    const ok = await authenticate(values);
    if (!ok) setError('Incorrect email or password.');
    setIsLoading(false);
  };

  return (
    <Login
      title="Sign in"
      fields={[
        { id: 'email', type: 'email', placeholder: 'Email', required: true },
        { id: 'password', type: 'password', placeholder: 'Password', required: true },
      ]}
      error={error}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}`;

// ============================================================================
// Main component
// ============================================================================

export default function LoginComponent() {
  const { showToast } = useToast();

  return (
    <div>
      {/* Intro */}
      <Section>
        <SectionHeader id="intro" onCopyLink={showToast}>
          Intro
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-4 xl:mt-7 mb-6">
          The Login component is a composable card for authentication flows.
          It provides a logo slot, title and subtitle, configurable fields,
          a built-in password show/hide toggle, error state, and a footer
          slot for links such as "Forgot password?". The same component
          powers the staging gate at{" "}
          <code className="inline-code">
            /login
          </code>{" "}
          and is suitable for any sign-in surface across the product.
        </p>
      </Section>

      {/* Password only */}
      <Section>
        <SectionHeader id="password-only" onCopyLink={showToast}>
          Password only
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          The minimal variant — a single password field with a logo header
          and title. This is the pattern used by the Distanz Running staging
          gate.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={stagingGateCode}>
            <StagingGateDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Email + password */}
      <Section>
        <SectionHeader id="email-password" onCopyLink={showToast}>
          Email + password
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          A standard sign-in form with an email and password field, a
          subtitle for welcome copy, and no logo — useful when the logo is
          rendered by a surrounding layout.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={emailPasswordCode}>
            <EmailPasswordDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Social only */}
      <Section>
        <SectionHeader id="continue-with-google" onCopyLink={showToast}>
          Continue with Google
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          A social-only variant — no email form, just one or more OAuth
          providers. Pass each provider through the{" "}
          <code className="inline-code">
            providers
          </code>{" "}
          prop with a label, icon, and click handler.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={googleOnlyCode}>
            <GoogleOnlyDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Social + email */}
      <Section>
        <SectionHeader id="google-and-email" onCopyLink={showToast}>
          Google and email
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          When both a provider and email form are present, pass{" "}
          <code className="inline-code">
            divider
          </code>{" "}
          to render a separator between them. Use{" "}
          <code className="inline-code">
            true
          </code>{" "}
          for the default "Or continue with email" label or pass a custom
          string.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={googleAndEmailCode}>
            <GoogleAndEmailDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Sign up */}
      <Section>
        <SectionHeader id="sign-up" onCopyLink={showToast}>
          Sign up
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          A sign-up flow combines a Google provider, a name + email form,
          and a legal disclaimer. The{" "}
          <code className="inline-code">
            disclaimer
          </code>{" "}
          slot renders small, centered text under the submit button — use
          it to link out to Terms of Service and Privacy Policy.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={signUpCode}>
            <SignUpDemo />
          </CodePreview>
        </div>
      </Section>

      {/* With forgot password */}
      <Section>
        <SectionHeader id="forgot-password" onCopyLink={showToast}>
          With forgot password
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          Pass any React node to{" "}
          <code className="inline-code">
            footer
          </code>{" "}
          to render helper links — a forgot-password link, a sign-up link,
          or a support contact.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={forgotPasswordCode}>
            <ForgotPasswordDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Error state */}
      <Section>
        <SectionHeader id="error-state" onCopyLink={showToast}>
          Error state
        </SectionHeader>
        <p className="text-copy-16 text-textSubtle mt-4 mb-6">
          Pass an{" "}
          <code className="inline-code">
            error
          </code>{" "}
          string to render an inline error above the submit button. Fields
          pick up the error styling automatically.
        </p>
        <div className="mt-4 xl:mt-7">
          <CodePreview componentCode={errorStateCode}>
            <ErrorStateDemo />
          </CodePreview>
        </div>
      </Section>

      {/* Best Practices Section */}
      <Section>
        <SectionHeader id="best-practices" onCopyLink={showToast}>
          Best Practices
        </SectionHeader>

        <h3
          id="when-to-use"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          When to use
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Pick <code className="inline-code">&lt;Login&gt;</code> for any
            sign-in or sign-up surface that combines a brand logo, one or
            more credential fields, and optional OAuth providers — keeps
            spacing, button sizing, and password-toggle behaviour
            consistent across every auth screen.
          </li>
          <li>
            For short single-credential gates (a staging password prompt,
            a maintenance unlock), inline a{" "}
            <code className="inline-code">&lt;form&gt;</code> with{" "}
            <code className="inline-code">&lt;Input&gt;</code> +{" "}
            <code className="inline-code">&lt;Button&gt;</code> instead;{" "}
            <code className="inline-code">&lt;Login&gt;</code> is overkill
            when there&apos;s no title, no providers, and no disclaimer.
          </li>
          <li>
            For passwordless or magic-link flows where the next step is{" "}
            <code className="inline-code">Check your email</code>, render
            the post-submit confirmation outside the component; don&apos;t
            try to swap{" "}
            <code className="inline-code">&lt;Login&gt;</code>&apos;s
            internals into a success state.
          </li>
        </ul>

        <h3
          id="behavior"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Behavior
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            Pass <code className="inline-code">isLoading</code> while the
            request is in flight; the component swaps the submit label to{" "}
            <code className="inline-code">loadingLabel</code> and disables
            every input and provider button so users can&apos;t
            double-submit.
          </li>
          <li>
            Password fields ship with a built-in show/hide toggle (eye
            icon in the suffix). Don&apos;t add a second toggle outside
            the field.
          </li>
          <li>
            Surface server-side errors via the{" "}
            <code className="inline-code">error</code> string; it renders
            above the submit button with{" "}
            <code className="inline-code">role=&quot;alert&quot;</code>{" "}
            and tints every field red. Don&apos;t render extra error UI
            elsewhere in the form.
          </li>
          <li>
            OAuth providers render in the order passed. Put the
            most-likely path first.
          </li>
        </ul>

        <h3
          id="content"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Content
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            <code className="inline-code">title</code> is a short Title
            Case noun phrase that names the action (
            <code className="inline-code">Sign In</code>,{" "}
            <code className="inline-code">Create Account</code>).{" "}
            <code className="inline-code">subtitle</code> is sentence case,
            one sentence with a trailing period.
          </li>
          <li>
            Provider button labels follow the pattern{" "}
            <code className="inline-code">Continue with [Provider]</code>{" "}
            (<code className="inline-code">Continue with Google</code>,{" "}
            <code className="inline-code">Continue with GitHub</code>).
            Match canonical brand casing.
          </li>
          <li>
            <code className="inline-code">submitLabel</code> is a Title
            Case verb phrase (
            <code className="inline-code">Sign In</code>,{" "}
            <code className="inline-code">Reset Password</code>).{" "}
            <code className="inline-code">loadingLabel</code> is
            present-progressive (
            <code className="inline-code">Signing in&hellip;</code>,{" "}
            <code className="inline-code">Authenticating&hellip;</code>).
          </li>
          <li>
            Field placeholders show an example value (
            <code className="inline-code">you@example.com</code>), not
            instructions like{" "}
            <code className="inline-code">Enter your email</code>.
          </li>
          <li>
            <code className="inline-code">disclaimer</code> is small print
            for legal or privacy copy; keep it under two sentences and
            link the policy by name.
          </li>
        </ul>

        <h3
          id="accessibility"
          className="text-heading-20 text-textDefault mt-8 scroll-mt-32"
        >
          Accessibility
        </h3>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-copy-16 text-textSubtle">
          <li>
            The password show/hide toggle carries an{" "}
            <code className="inline-code">aria-label</code> that flips
            between{" "}
            <code className="inline-code">Show password</code> and{" "}
            <code className="inline-code">Hide password</code> so screen
            readers announce the state change.
          </li>
          <li>
            The provider/email divider is{" "}
            <code className="inline-code">aria-hidden=&quot;true&quot;</code>
            ; it&apos;s decorative, and the providers and fields carry
            their own semantics.
          </li>
          <li>
            When a field doesn&apos;t render a visible{" "}
            <code className="inline-code">label</code>, the component
            wires the{" "}
            <code className="inline-code">label</code> prop as an{" "}
            <code className="inline-code">sr-only</code>{" "}
            <code className="inline-code">&lt;label htmlFor&gt;</code>.
            Pass <code className="inline-code">label</code> even when the
            placeholder feels self-evident.
          </li>
        </ul>
      </Section>
    </div>
  );
}
