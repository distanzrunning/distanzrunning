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
        <div className="relative w-full overflow-auto">
          <table
            ref={ref}
            className={cn(
              "w-full caption-bottom text-sm",
              className,
            )}
            style={{ color: "var(--ds-gray-900)" }}
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
    className={cn("[&_th]:border-b", className)}
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
      {/* Spacer row between header and body */}
      <tbody aria-hidden="true">
        <tr className="table-row h-3" />
      </tbody>
      <tbody
        ref={ref}
        className={cn(
          "[&_td:first-child]:rounded-l [&_td:last-child]:rounded-r",
          striped &&
            "[&_tr:where(:nth-child(odd))]:bg-[var(--ds-background-200)]",
          bordered && "[&_tr:not(:last-child)]:border-b",
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
      "h-10 px-2 text-left align-middle font-medium last:text-right border-[var(--ds-gray-400)]",
      className,
    )}
    style={{ color: "var(--ds-gray-900)" }}
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
    className={cn("px-2 py-2.5 align-middle last:text-right", className)}
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
    className={cn("font-medium [&_td]:border-t", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
};
