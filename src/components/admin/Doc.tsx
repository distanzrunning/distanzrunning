import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

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
    <div className="px-6 py-8">
      <div className="mx-auto flex max-w-[1040px] gap-12">
        <article className="min-w-0 max-w-[720px] flex-1">
          <p className="text-copy-18 mb-10 text-balance text-textSubtle">
            {lede}
          </p>
          <div className="space-y-12">{children}</div>
        </article>

        <nav
          aria-label="On this page"
          className="hidden w-[180px] shrink-0 lg:block"
        >
          <div className="sticky top-[88px]">
            <p className="text-label-12 mb-3 uppercase tracking-wide text-textSubtler">
              On this page
            </p>
            <ul className="space-y-px border-l border-borderSubtle">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-copy-13 -ml-px block border-l border-transparent py-1 pl-3 text-textSubtle transition-colors hover:border-textDefault hover:text-textDefault"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
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
