"use client";

import React, { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { TbBrandGoogle } from "react-icons/tb";
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
      <h2 className="text-[24px] leading-[1.2] font-semibold text-textDefault">
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
            color: "var(--ds-gray-1000)",
            darkColor: "var(--ds-gray-1000)",
          },
        ] as DualThemeToken[],
    );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(componentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, [componentCode]);

  return (
    <div className="border border-[var(--ds-gray-400)] rounded-lg w-full min-w-0 overflow-hidden">
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
          className="flex h-12 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-textDefault border-t border-[var(--ds-gray-400)]"
        >
          <ChevronDown size={16} className={isOpen ? "" : "-rotate-90"} />
          {isOpen ? "Hide code" : "Show code"}
        </button>
        {isOpen && (
          <div
            className="border-t border-[var(--ds-gray-400)] overflow-x-auto font-mono text-[13px]"
            style={{ background: "var(--ds-background-100)" }}
          >
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded border border-[var(--ds-gray-400)] opacity-0 group-hover:opacity-100 transition-opacity z-10 text-textSubtle hover:text-textDefault bg-[var(--ds-background-200)] hover:bg-[var(--ds-gray-100)]"
                aria-label="Copy code"
              >
                <CopyIconButton copied={copied} />
              </button>
              <pre className="overflow-x-auto py-4" data-code-block>
                <code className="block text-[13px] leading-[20px] font-mono">
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
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/wordmark-black.svg"
        alt="Distanz Running"
        className="block dark:hidden"
        style={{ height: 40, width: "auto" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/wordmark-white.svg"
        alt="Distanz Running"
        className="hidden dark:block"
        style={{ height: 40, width: "auto" }}
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
          icon: <TbBrandGoogle size={18} />,
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
          icon: <TbBrandGoogle size={18} />,
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
          icon: <TbBrandGoogle size={18} />,
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

const googleOnlyCode = `import { TbBrandGoogle } from 'react-icons/tb';
import { Login } from '@/components/ui/Login';

export function GoogleSignIn() {
  return (
    <Login
      title="Sign in"
      providers={[
        {
          id: 'google',
          label: 'Continue with Google',
          icon: <TbBrandGoogle size={18} />,
          onClick: () => signInWithGoogle(),
        },
      ]}
      footer={<span>Don't have an account? <a href="/signup">Sign up</a></span>}
    />
  );
}`;

const googleAndEmailCode = `import { TbBrandGoogle } from 'react-icons/tb';
import { Login } from '@/components/ui/Login';

export function SignIn() {
  return (
    <Login
      title="Sign in"
      providers={[
        {
          id: 'google',
          label: 'Continue with Google',
          icon: <TbBrandGoogle size={18} />,
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

const signUpCode = `import { TbBrandGoogle } from 'react-icons/tb';
import { Login } from '@/components/ui/Login';

export function SignUp() {
  return (
    <Login
      title="Create your account"
      providers={[
        {
          id: 'google',
          label: 'Continue with Google',
          icon: <TbBrandGoogle size={18} />,
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
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 xl:mt-7 mb-6">
          The Login component is a composable card for authentication flows.
          It provides a logo slot, title and subtitle, configurable fields,
          a built-in password show/hide toggle, error state, and a footer
          slot for links such as "Forgot password?". The same component
          powers the staging gate at{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
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
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
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
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
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
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          A social-only variant — no email form, just one or more OAuth
          providers. Pass each provider through the{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
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
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          When both a provider and email form are present, pass{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
            divider
          </code>{" "}
          to render a separator between them. Use{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
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
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          A sign-up flow combines a Google provider, a name + email form,
          and a legal disclaimer. The{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
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
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          Pass any React node to{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
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
        <p className="text-[16px] leading-[1.6] text-textSubtle mt-4 mb-6">
          Pass an{" "}
          <code className="text-[13px] font-mono px-1.5 py-0.5 bg-surfaceSubtle border border-borderSubtle rounded text-textDefault">
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
    </div>
  );
}
