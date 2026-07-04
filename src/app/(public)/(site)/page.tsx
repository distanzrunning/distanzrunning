// Homepage — cleared for rebuild. The Masthead + announcement banner come
// from the (site) route-group layout; this page only renders its sections. IMPORTANT: don't mount MastheadWrapper here — the layout
// already renders it, and a second mount site double-stacks the header after
// client-side navigation (the root layout persists across soft navs).
export default function HomePage() {
  return null;
}
