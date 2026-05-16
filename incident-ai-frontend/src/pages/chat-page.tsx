import { useState, useEffect } from "react";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import type { ChatMessageProps } from "@/components/chat/ChatMessage";
import { IncidentsPanel } from "@/components/incidents/IncidentsPanel";
import { chatWithIncidents } from "@/services/incidentApi";
import type { ChatRequest, SimilarIncident } from "@/types/incident";
import {
  saveChatToStorage,
  loadChatFromStorage,
  clearChatStorage,
} from "@/lib/chatStorage";
import { Trash2 } from "lucide-react";

interface AssistantResponse {
  answerText: string;
  incidents: SimilarIncident[];
}

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [assistantResponses, setAssistantResponses] = useState<AssistantResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadChatFromStorage();
    if (stored.length === 0) return;

    const reconstructed: ChatMessageProps[] = [];
    const responses: AssistantResponse[] = [];

    stored.forEach((msg) => {
      if (msg.role === "user") {
        reconstructed.push({ role: "user", content: msg.content as string });
      } else {
        const data = msg.content as { answerText: string; incidents: SimilarIncident[] };
        responses.push({ answerText: data.answerText, incidents: data.incidents });
        reconstructed.push({
          role: "assistant",
          content: (
            <div>
              <p className="text-sm leading-relaxed text-[hsl(var(--foreground)/0.9)]">
                {data.answerText}
              </p>
              {data.incidents && data.incidents.length > 0 && (
                <IncidentsPanel incidents={data.incidents} />
              )}
            </div>
          ),
        });
      }
    });

    setMessages(reconstructed);
    setAssistantResponses(responses);
  }, []);

  const handleClearChat = () => {
    setMessages([]);
    setAssistantResponses([]);
    setError(null);
    clearChatStorage();
  };

  const handleSendMessage = async (userMessage: string) => {
    setError(null);

    const userMsg: ChatMessageProps = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const request: ChatRequest = { user_query: userMessage, top_k: 5 };
      const response = await chatWithIncidents(request);

      const responseData: AssistantResponse = {
        answerText: response.answer,
        incidents: response.results || [],
      };

      const assistantMessage: ChatMessageProps = {
        role: "assistant",
        content: (
          <div>
            <p className="text-sm leading-relaxed text-[hsl(var(--foreground)/0.9)]">
              {response.answer}
            </p>
            {response.results && response.results.length > 0 && (
              <IncidentsPanel incidents={response.results} />
            )}
          </div>
        ),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setAssistantResponses((prev) => [...prev, responseData]);

      const updatedMessages = [...messages, userMsg, assistantMessage];
      const updatedResponses = [...assistantResponses, responseData];
      saveChatToStorage(updatedMessages, updatedResponses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      console.error("Chat API error:", errorMessage);

      const errorMsg: ChatMessageProps = {
        role: "assistant",
        content: (
          <div
            className="rounded-xl border px-4 py-3 text-sm"
            style={{
              background: "hsl(350 80% 65% / 0.08)",
              borderColor: "hsl(350 80% 65% / 0.2)",
              color: "hsl(350 80% 72%)",
            }}
          >
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1 text-xs opacity-80">{errorMessage}</p>
          </div>
        ),
      };

      setMessages((prev) => [...prev, errorMsg]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between border-b px-6 py-3.5 lg:px-12"
        style={{
          borderColor: "hsl(var(--border-subtle))",
          background: "hsl(var(--surface-1) / 0.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: "hsl(var(--accent-teal))",
              boxShadow: "0 0 6px hsl(var(--accent-teal) / 0.6)",
            }}
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">
            Conversation
          </p>
        </div>

        <button
          onClick={handleClearChat}
          disabled={messages.length === 0}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-all duration-150 hover:bg-[hsl(var(--surface-3))] hover:text-[hsl(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Trash2 size={12} strokeWidth={2} />
          Clear
        </button>
      </div>

      {/* Messages */}
      <ChatContainer messages={messages} isLoading={isLoading} />

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}