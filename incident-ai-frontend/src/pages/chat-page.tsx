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

// Track assistant response data separately for serialization
interface AssistantResponse {
  answerText: string;
  incidents: SimilarIncident[];
}

// Premium chat page component - the main AI assistant interface.
//
// Architecture:
// - Full-screen layout with sidebar + chat area
// - Manages conversation state and API orchestration
// - Handles message persistence via localStorage
// - Coordinates ChatContainer + ChatInput components
// - Integrates backend semantic search results
//
// Design patterns:
// - Modular component composition
// - Clean separation of concerns
// - Type-safe API integration
// - Graceful error handling
export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [assistantResponses, setAssistantResponses] = useState<AssistantResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load persisted chat from localStorage on mount
  useEffect(() => {
    const stored = loadChatFromStorage();

    if (stored.length === 0) return;

    const reconstructed: ChatMessageProps[] = [];
    const responses: AssistantResponse[] = [];

    stored.forEach((msg) => {
      if (msg.role === "user") {
        reconstructed.push({
          role: "user",
          content: msg.content as string,
        });
      } else {
        const data = msg.content as { answerText: string; incidents: SimilarIncident[] };
        responses.push({
          answerText: data.answerText,
          incidents: data.incidents,
        });

        reconstructed.push({
          role: "assistant",
          content: (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-foreground">{data.answerText}</p>
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

    const userMsg: ChatMessageProps = {
      role: "user",
      content: userMessage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const request: ChatRequest = {
        user_query: userMessage,
        top_k: 5,
      };

      const response = await chatWithIncidents(request);

      const responseData: AssistantResponse = {
        answerText: response.answer,
        incidents: response.results || [],
      };

      const assistantMessage: ChatMessageProps = {
        role: "assistant",
        content: (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-foreground">{response.answer}</p>
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
          <div className="rounded-lg border border-red-200/50 bg-red-50/20 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400">
            <p className="font-medium">Error</p>
            <p className="mt-1 text-xs">{errorMessage}</p>
          </div>
        ),
      };

      setMessages((prev) => [...prev, errorMsg]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Premium chat layout: flexbox structure with fixed input
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat Toolbar: Header with clear button and status */}
      <div className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-3 lg:px-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Conversation
          </p>
        </div>
        <button
          onClick={handleClearChat}
          disabled={messages.length === 0}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear Chat
        </button>
      </div>

      {/* Message Display: Flexible scrollable container */}
      <ChatContainer messages={messages} isLoading={isLoading} />

      {/* Chat Input: Fixed at bottom */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
