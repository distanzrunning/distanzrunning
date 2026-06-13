"use client";

import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Kbd } from "@/components/ui/Kbd";

// ============================================================================
// Search glyph (Geist's magnifier)
// ============================================================================

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" height="16" width="16" style={{ color: "currentcolor" }}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 6.5a5 5 0 1 1 10 0 5 5 0 0 1-10 0m5-6.5a6.5 6.5 0 1 0 4.04 11.6l3.43 3.43.53.53 1.06-1.06-.53-.53-3.43-3.43A6.5 6.5 0 0 0 6.5 0"
      />
    </svg>
  );
}

// ============================================================================
// SearchInput
// ============================================================================

export interface SearchInputProps
  extends Omit<InputProps, "prefix" | "type"> {
  /** Override the default magnifier prefix (e.g. a custom search icon). */
  prefix?: React.ReactNode;
  /** Show the ⌘K command-menu hint as a suffix. */
  cmdk?: boolean;
  /** Loading state — swaps the prefix for a {@link Spinner}. */
  loading?: boolean;
}

/**
 * A search-configured {@link Input}: a flush (borderless) magnifier prefix,
 * `type="search"`, and an optional ⌘K hint or loading spinner. Geist ships
 * "Search Input" as exactly this — the Input primitive pre-wired for search —
 * which is distinct from the app's command-menu Search molecule.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      prefix,
      cmdk = false,
      loading = false,
      suffix,
      "aria-label": ariaLabel = "Search",
      placeholder = "Enter some text...",
      ...props
    },
    ref,
  ) => {
    const resolvedPrefix = loading ? (
      <Spinner size={16} />
    ) : (
      (prefix ?? <SearchIcon />)
    );

    const resolvedSuffix = cmdk ? (
      <span className="flex gap-1 items-center">
        <Kbd size="small">⌘</Kbd>
        <Kbd size="small">K</Kbd>
      </span>
    ) : (
      suffix
    );

    return (
      <Input
        ref={ref}
        type="search"
        aria-label={ariaLabel}
        placeholder={placeholder}
        prefix={resolvedPrefix}
        prefixStyling={false}
        suffix={resolvedSuffix}
        suffixStyling={false}
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
