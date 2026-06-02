import type { ReactNode } from "react";

export default function DesignSystemLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      id="main-content"
      className="flex flex-col"
      style={{
        background: "hsl(var(--color-canvas))",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
