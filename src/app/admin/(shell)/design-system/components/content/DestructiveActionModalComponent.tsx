"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { DestructiveActionModal } from "@/components/ui/DestructiveActionModal";
import { Section } from "../ContentWithTOC";

export default function DestructiveActionModalComponent() {
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [reversibleOpen, setReversibleOpen] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  return (
    <>
      <Section>
        <div id="default" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">Default</h2>
          <p
            className="text-copy-16"
            style={{
              color: "var(--ds-gray-900)",
              marginBottom: 24,
            }}
          >
            A type-to-confirm gate disables submit until the user
            types the verification phrase exactly. The red band at
            the bottom names what cannot be undone.
          </p>
          <Button variant="error" onClick={() => setDefaultOpen(true)}>
            Delete Project
          </Button>
          <DestructiveActionModal
            open={defaultOpen}
            onOpenChange={setDefaultOpen}
            onConfirm={() => setDefaultOpen(false)}
            title="Delete Project"
            description={
              <>
                <strong className="font-semibold">next-year-boilerplate</strong>{" "}
                and all its deployments, domains, and environment
                variables will be permanently deleted.
              </>
            }
            irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
            verificationPhrase="next-year-boilerplate"
            verificationLabel="project name"
            confirmLabel="Delete Project"
          />
        </div>
      </Section>

      <Section>
        <div id="reversible" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            Reversible
          </h2>
          <p
            className="text-copy-16"
            style={{
              color: "var(--ds-gray-900)",
              marginBottom: 24,
            }}
          >
            Omit{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              irreversibleDescription
            </code>{" "}
            for actions that can be re-enabled, undone, or rolled
            back. The type-to-confirm gate stays — the friction is
            still warranted — but the red band is skipped.
          </p>
          <Button variant="error" onClick={() => setReversibleOpen(true)}>
            Disable Vercel Authentication
          </Button>
          <DestructiveActionModal
            open={reversibleOpen}
            onOpenChange={setReversibleOpen}
            onConfirm={() => setReversibleOpen(false)}
            title="Disable Vercel Authentication"
            description="Anyone with a deployment URL will be able to view your project without signing in."
            verificationPhrase="disable vercel authentication"
            confirmLabel="Disable Vercel Authentication"
          />
        </div>
      </Section>

      <Section>
        <div id="loading" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">Loading</h2>
          <p
            className="text-copy-16"
            style={{
              color: "var(--ds-gray-900)",
              marginBottom: 24,
            }}
          >
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              loading
            </code>{" "}
            disables both buttons and shows a spinner on the primary
            action. Use while the destructive API call is in flight.
            Caller controls{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              open
            </code>{" "}
            — don&apos;t dismiss the modal from inside{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              onConfirm
            </code>
            .
          </p>
          <Button variant="error" onClick={() => setLoadingOpen(true)}>
            Delete Project (loading)
          </Button>
          <DestructiveActionModal
            open={loadingOpen}
            onOpenChange={setLoadingOpen}
            onConfirm={() => {}}
            title="Delete Project"
            description={
              <>
                <strong className="font-semibold">next-year-boilerplate</strong>{" "}
                will be permanently deleted.
              </>
            }
            irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
            verificationPhrase="next-year-boilerplate"
            verificationLabel="project name"
            confirmLabel="Delete Project"
            loading
          />
        </div>
      </Section>

      <Section>
        <div id="with-error" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            With error
          </h2>
          <p
            className="text-copy-16"
            style={{
              color: "var(--ds-gray-900)",
              marginBottom: 24,
            }}
          >
            Pass{" "}
            <code
              className="text-label-13-mono"
              style={{
                background: "var(--ds-gray-100)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              error
            </code>{" "}
            (a string or an Error) to surface an inline error under
            the input. The modal stays open so the user can retry.
          </p>
          <Button variant="error" onClick={() => setErrorOpen(true)}>
            Delete Project (with error)
          </Button>
          <DestructiveActionModal
            open={errorOpen}
            onOpenChange={setErrorOpen}
            onConfirm={() => {}}
            title="Delete Project"
            description={
              <>
                <strong className="font-semibold">next-year-boilerplate</strong>{" "}
                will be permanently deleted.
              </>
            }
            irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
            verificationPhrase="next-year-boilerplate"
            verificationLabel="project name"
            confirmLabel="Delete Project"
            error="Couldn't delete the project. Try again."
          />
        </div>
      </Section>

      <Section>
        <div id="best-practices" style={{ scrollMarginTop: 96 }}>
          <h2 className="text-heading-24 text-textDefault mb-3">
            Best Practices
          </h2>

          <h3
            className="text-heading-20 mt-4"
            style={{ color: "var(--ds-gray-1000)" }}
          >
            When to use
          </h3>
          <ul
            className="text-copy-14"
            style={{
              color: "var(--ds-gray-900)",
              paddingLeft: 20,
              margin: "12px 0 0",
            }}
          >
            <li style={{ marginBottom: 6 }}>
              Reach for this over plain Modal when the action is
              destructive and warrants friction: delete, rotate,
              revoke, disconnect, downgrade, disable a security
              setting. The typed gate forces deliberate intent.
            </li>
            <li style={{ marginBottom: 6 }}>
              Use it for reversible destructive actions too, when the
              consequence is serious enough to warrant a pause —
              disabling deployment protection, revoking a shared
              token. Keep the typed gate; drop{" "}
              <code
                className="text-label-13-mono"
                style={{
                  background: "var(--ds-gray-100)",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                irreversibleDescription
              </code>
              .
            </li>
            <li>
              Don&apos;t use for routine confirmations (save draft,
              discard changes, close without saving). The typed gate
              reads as melodrama when the stakes are low — use a
              plain Modal instead.
            </li>
          </ul>

          <h3
            className="text-heading-20 mt-6"
            style={{ color: "var(--ds-gray-1000)" }}
          >
            Behavior
          </h3>
          <ul
            className="text-copy-14"
            style={{
              color: "var(--ds-gray-900)",
              paddingLeft: 20,
              margin: "12px 0 0",
            }}
          >
            <li style={{ marginBottom: 6 }}>
              The verification input gets focus on open so the user
              can start typing immediately. Submit stays disabled
              until the value matches{" "}
              <code
                className="text-label-13-mono"
                style={{
                  background: "var(--ds-gray-100)",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                verificationPhrase
              </code>{" "}
              exactly.
            </li>
            <li style={{ marginBottom: 6 }}>
              Enter submits only when the gate is open; it&apos;s a
              no-op otherwise. Cancel, outside-click, and Escape all
              dismiss.
            </li>
            <li style={{ marginBottom: 6 }}>
              <code
                className="text-label-13-mono"
                style={{
                  background: "var(--ds-gray-100)",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                loading
              </code>{" "}
              disables both buttons. The caller owns{" "}
              <code
                className="text-label-13-mono"
                style={{
                  background: "var(--ds-gray-100)",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                open
              </code>{" "}
              — do not self-dismiss from{" "}
              <code
                className="text-label-13-mono"
                style={{
                  background: "var(--ds-gray-100)",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                onConfirm
              </code>
              . Close the modal after the API settles (success or
              error), or keep it open on error so the user can retry.
            </li>
            <li>
              Pair the post-confirm success toast verb 1:1 with the
              primary button: <code>Delete Project</code> button,{" "}
              <code>Project deleted</code> toast. Never{" "}
              <code>Project removed</code>.
            </li>
          </ul>

          <h3
            className="text-heading-20 mt-6"
            style={{ color: "var(--ds-gray-1000)" }}
          >
            Content
          </h3>
          <ul
            className="text-copy-14"
            style={{
              color: "var(--ds-gray-900)",
              paddingLeft: 20,
              margin: "12px 0 0",
            }}
          >
            <li style={{ marginBottom: 6 }}>
              <code>title</code> is Title Case, Verb + Noun, a
              statement — never a question. <code>Delete Project</code>,
              not <code>Delete this project?</code>.
            </li>
            <li style={{ marginBottom: 6 }}>
              <code>description</code> is sentence case, names the
              consequence, and interpolates the specific resource
              when relevant.
            </li>
            <li style={{ marginBottom: 6 }}>
              <code>confirmLabel</code> matches the title 1:1. Never
              generic (<code>Confirm</code>, <code>OK</code>,{" "}
              <code>Continue</code>), never a bare verb (
              <code>Delete</code>).
            </li>
            <li style={{ marginBottom: 6 }}>
              <code>verificationPhrase</code>: for entity deletes,
              type the resource name itself and pair with{" "}
              <code>verificationLabel="project name"</code> so the
              prompt reads{" "}
              <em>“To confirm, type the project name ‘my-project’”</em>.
              Fall back to a lowercase verb phrase only when there&apos;s
              no entity to name.
            </li>
            <li>
              <code>error</code> surfaces the API failure verbatim in
              Distanz voice: <em>“Couldn&apos;t save settings. Try again.”</em>{" "}
              Never dump a raw error object.
            </li>
          </ul>
        </div>
      </Section>
    </>
  );
}
