import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import type { ChatSession } from "@/lib/chatStorage";

type AppLayoutProps = {
  children: ReactNode;
  sessions: Omit<ChatSession, "messages">[];
  activeSessionId: string;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
};

export function AppLayout({
  children,
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: AppLayoutProps) {
  return (
    <div
      className="flex h-screen overflow-hidden text-foreground"
      style={{ background: "hsl(var(--surface-0))" }}
    >
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={onNewChat}
        onSelectSession={onSelectSession}
        onDeleteSession={onDeleteSession}
      />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}