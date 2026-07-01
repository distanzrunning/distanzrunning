import { Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SECTIONS } from "./data";

// Lightweight header for the homepage mockups — matches the wireframe nav spec
// (icons left · centered wordmark · Log in + Subscribe right · section-links
// row). Not the production SiteHeader (which carries mega-menu data); this is a
// stand-in so the three layout mockups read correctly.
export default function MockHeader() {
  return (
    <header className="bg-surface">
      {/* utility bar */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-borderSubtle px-6 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-borderDefault text-[color:var(--ds-gray-900)] transition-colors hover:bg-[var(--ds-gray-100)]"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Toggle theme"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-borderDefault text-[color:var(--ds-gray-900)] transition-colors hover:bg-[var(--ds-gray-100)]"
          >
            <Sun className="h-4 w-4" />
          </button>
        </div>

        <a
          href="#"
          className="text-center text-[19px] font-bold uppercase tracking-[0.16em] text-textDefault no-underline"
        >
          Distanz
        </a>

        <div className="flex items-center justify-end gap-2">
          <Button variant="tertiary" size="small">
            Log in
          </Button>
          <Button variant="default" size="small">
            Subscribe
          </Button>
        </div>
      </div>

      {/* section links */}
      <nav className="flex items-center justify-center gap-7 border-b border-borderSubtle px-6 py-3">
        {SECTIONS.map((s) => (
          <a
            key={s}
            href="#"
            className="text-copy-13 font-medium tracking-[0.02em] text-textSubtle no-underline transition-colors hover:text-textDefault"
          >
            {s}
          </a>
        ))}
      </nav>
    </header>
  );
}
