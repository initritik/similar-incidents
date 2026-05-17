import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/layouts/app-layout";
import { ChatPage } from "@/pages/chat-page";
import {
  createNewSession,
  getActiveSessionId,
  getAllSessions,
  deleteSession,
  type ChatSession,
} from "@/lib/chatStorage";

export default function App() {
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<Omit<ChatSession, "messages">[]>([]);

  // On first load, always start a new session (tab = new chat)
  useEffect(() => {
    let id = getActiveSessionId();
    if (!id) {
      id = createNewSession();
    }
    setActiveSessionId(id);
    setSessions(getAllSessions());
  }, []);

  const handleNewChat = useCallback(() => {
    const id = createNewSession();
    setActiveSessionId(id);
    setSessions(getAllSessions());
  }, []);

  const handleSelectSession = useCallback((id: string) => {
    // Import setActiveSessionId from storage to persist tab-scope
    import("@/lib/chatStorage").then(({ setActiveSessionId: persist }) => {
      persist(id);
    });
    setActiveSessionId(id);
    setSessions(getAllSessions());
  }, []);

  const handleDeleteSession = useCallback((id: string) => {
    deleteSession(id);
    const remaining = getAllSessions();
    setSessions(remaining);
    // If we deleted the active session, open a new one
    if (id === activeSessionId) {
      if (remaining.length > 0) {
        handleSelectSession(remaining[0].id);
      } else {
        handleNewChat();
      }
    }
  }, [activeSessionId, handleNewChat, handleSelectSession]);

  const refreshSessions = useCallback(() => {
    setSessions(getAllSessions());
  }, []);

  if (!activeSessionId) return null;

  return (
    <AppLayout
      sessions={sessions}
      activeSessionId={activeSessionId}
      onNewChat={handleNewChat}
      onSelectSession={handleSelectSession}
      onDeleteSession={handleDeleteSession}
    >
      <ChatPage
        key={activeSessionId}
        sessionId={activeSessionId}
        onSessionUpdated={refreshSessions}
      />
    </AppLayout>
  );
}