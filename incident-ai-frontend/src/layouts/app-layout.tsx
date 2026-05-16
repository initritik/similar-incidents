import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

type AppLayoutProps = { children: ReactNode };

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      className="flex h-screen overflow-hidden text-foreground"
      style={{ background: "hsl(var(--surface-0))" }}
    >
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}