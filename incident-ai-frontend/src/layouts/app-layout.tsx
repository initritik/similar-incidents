import type { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center">
          <h1 className="text-lg font-semibold tracking-normal">
            Incident AI Assistant
          </h1>
        </div>
      </header>
      <main className="container py-10">{children}</main>
    </div>
  );
}
