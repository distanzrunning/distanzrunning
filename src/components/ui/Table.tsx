"use client";

import React, { forwardRef, createContext, useContext } from "react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Context
// ============================================================================

interface TableContextValue {
  striped?: boolean;
  bordered?: boolean;
  interactive?: boolean;
}

const TableContext = createContext<TableContextValue>({});

// ============================================================================
// Table
// ============================================================================

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  bordered?: boolean;
  interactive?: boolean;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, striped, bordered, interactive, children, ...props }, ref) => {
    return (
      <TableContext.Provider value={{ striped, bordered, interactive }}>
        <div className="relative w-full overflow-x-auto">
          <table
            ref={ref}
            className={cn(
              "w-full caption-bottom",
              className,
            )}
            style={{ color: "hsl(var(--color-textSubtle))", fontSize: 14, lineHeight: "20px" }}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  },
);
Table.displayName = "Table";

// ============================================================================
// TableHeader
// ============================================================================

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-borderDefault [&_tr]:border-b", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

// ============================================================================
// TableBody
// ============================================================================

const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  const { striped, bordered, interactive } = useContext(TableContext);

  return (
    <>
      {/* Geist inserts a block spacer tbody so a 12px gap sits between the
          header underline and the first data row. */}
      <tbody aria-hidden="true" className="h-3 block" />
      <tbody
        ref={ref}
        className={cn(
          "[&_td:first-child]:rounded-l-sm [&_td:last-child]:rounded-r-sm",
          // Zebra rows use the recessed canvas tone (bg-200) so they read
          // against the bg-100 table — NOT bg-surface, which is the same tone.
          striped && "[&_tr:where(:nth-child(odd))]:bg-canvas",
          bordered &&
            "[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-borderDefault",
          interactive && "[&_tr:hover]:bg-[var(--ds-gray-100)]",
          className,
        )}
        {...props}
      >
        {children}
      </tbody>
    </>
  );
});
TableBody.displayName = "TableBody";

// ============================================================================
// TableRow
// ============================================================================

const TableRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("transition-colors", className)}
    {...props}
  />
));
TableRow.displayName = "TableRow";

// ============================================================================
// TableHead
// ============================================================================

const TableHead = forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium whitespace-nowrap last:text-right border-borderDefault [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    style={{ color: "hsl(var(--color-textSubtle))" }}
    {...props}
  />
));
TableHead.displayName = "TableHead";

// ============================================================================
// TableCell
// ============================================================================

const TableCell = forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      // No blanket whitespace-nowrap here (Geist has it): real consumers rely on
      // wrapping inside max-w-capped cells, and the local cn can't reliably
      // override it. Callers opt into nowrap per-cell where they need it.
      "px-2 py-2.5 align-middle last:text-right [&:has([data-cell-link=true])]:p-0 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// ============================================================================
// TableFooter
// ============================================================================

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-borderDefault font-medium border-t [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

// Compound aliases so callers can use `<Table.Body>` / `<Table.Head>`
// notation that matches Geist's BP wording. Named exports remain for
// existing consumers.
const TableWithSubcomponents = Object.assign(Table, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Footer: TableFooter,
});

export {
  TableWithSubcomponents as Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
};
