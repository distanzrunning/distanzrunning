// src/lib/scroll-lock.ts
//
// Document scroll lock with scrollbar-width compensation. There is NO
// reserved scrollbar-gutter (the chrome runs full-bleed to the viewport
// edge — see globals.css), so hiding the root scrollbar frees its width
// and the page would reflow right by ~15px on classic-scrollbar setups.
// Locking therefore pads <html> by the freed width for the duration.
//
// Locks are ref-counted so overlapping overlays (e.g. a modal opening
// over a popover backdrop) don't unlock the document early. Radix/Vaul
// overlays (react-remove-scroll) manage their own compensation on
// <body>; the two compose safely — whichever locks second measures a
// scrollbar width of 0 and no-ops its padding.

let lockCount = 0;
let prevOverflow = "";
let prevPaddingRight = "";

/** Locks document scrolling; returns an idempotent unlock function. */
export function lockDocumentScroll(): () => void {
  const html = document.documentElement;
  if (lockCount === 0) {
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    prevOverflow = html.style.overflow;
    prevPaddingRight = html.style.paddingRight;
    html.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      html.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  lockCount += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount -= 1;
    if (lockCount === 0) {
      html.style.overflow = prevOverflow;
      html.style.paddingRight = prevPaddingRight;
    }
  };
}
