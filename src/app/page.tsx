// Homepage — being rebuilt from scratch. LayoutContent renders this route bare
// (a full-height <main> with no production SiteHeader/Footer), so the homepage
// owns its own header + sections. Clean canvas to build on.
export default function HomePage() {
  return <div className="min-h-screen bg-canvas" />;
}
