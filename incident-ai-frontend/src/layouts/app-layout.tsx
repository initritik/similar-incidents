import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

// Premium AI workspace layout inspired by Claude and modern AI copilots.
//
// This layout uses a three-column architecture:
// - Left sidebar: navigation, chat history
// - Center: main chat interface
// - Right: context panel (incidents, metadata)
//
// The design emphasizes calm, organized information hierarchy with soft
// colors, generous spacing, and premium visual polish. This creates an
// environment where users can focus on their work without distraction.
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Left Sidebar: Navigation and Chat History */}
      {/* Provides persistent context about available actions and recent conversations */}
      <Sidebar />

      {/* Main Content Area: Chat Interface */}
      {/* Flexible container that expands to fill remaining space */}
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
