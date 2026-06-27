import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { DocToc } from "./DocToc";

// ============================================================================
// Admin documentation primitives — a light, server-renderable doc layout for
// the /admin "how it works" pages: a readable content column, anchored section
// headings, a sticky "On this page" TOC, tables, and code blocks. No page <h1>
// (the admin shell header is the single title source).
// ============================================================================

export function DocCode({ children }: { children: ReactNode }) {
  return <code className="inline-code">{children}</code>;
}

export interface DocTocItem {
  id: string;
  label: string;
}

export function DocPage({
  lede,
  toc,
  children,
}: {
  lede: ReactNode;
  toc: DocTocItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Main content column */}
      <div className="min-w-0 flex-1 px-6 py-8 lg:px-10">
        <article className="max-w-[760px]">
          <p className="text-copy-18 mb-10 text-balance text-textSubtle">
            {lede}
          </p>
          <div className="space-y-12">{children}</div>
        </article>
      </div>

      {/* Right TOC rail — mirrors the design-system docs pages. */}
      <aside
        aria-label="On this page"
        className="hidden w-[252px] shrink-0 border-l border-borderSubtle xl:block"
      >
        <div className="sticky top-[56px] max-h-[calc(100vh-56px)] overflow-y-auto px-6 py-8">
          <h4 className="text-heading-14 mb-3 text-textDefault">On this page</h4>
          <DocToc items={toc} />
        </div>
      </aside>
    </div>
  );
}

export function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="text-heading-20 mb-3 scroll-mt-24 text-textDefault"
      >
        {title}
      </h2>
      <div className="text-copy-16 space-y-3 text-textSubtle [&_a]:text-textDefault [&_a]:underline hover:[&_a]:opacity-80 [&_strong]:font-medium [&_strong]:text-textDefault">
        {children}
      </div>
    </section>
  );
}

export function DocTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c}>{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function DocCodeBlock({ children }: { children: string }) {
  return (
    <pre className="text-copy-13 mt-4 overflow-x-auto rounded-md border border-borderSubtle bg-canvas p-4 font-mono text-textDefault">
      <code>{children}</code>
    </pre>
  );
}
