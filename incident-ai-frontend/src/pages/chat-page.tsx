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

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [assistantResponses, setAssistantResponses] = useState<AssistantResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat from localStorage on component mount
  // This restores the previous conversation if the page is refreshed
  useEffect(() => {
    const stored = loadChatFromStorage();

    if (stored.length === 0) return;

    // Reconstruct messages with JSX content
    const reconstructed: ChatMessageProps[] = [];
    const responses: AssistantResponse[] = [];

    stored.forEach((msg) => {
      if (msg.role === "user") {
        reconstructed.push({
          role: "user",
          content: msg.content as string,
        });
      } else {
        // Assistant messages: reconstruct JSX from stored data
        const data = msg.content as { answerText: string; incidents: SimilarIncident[] };
        responses.push({
          answerText: data.answerText,
          incidents: data.incidents,
        });

        reconstructed.push({
          role: "assistant",
          content: (
            <div className="space-y-2">
              <p className="text-sm leading-relaxed">{data.answerText}</p>
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

  // Handle chat clearing: remove from state and localStorage
  const handleClearChat = () => {
    setMessages([]);
    setAssistantResponses([]);
    setError(null);
    clearChatStorage();
  };

  // Handle user message submission: call backend API and update chat state
  const handleSendMessage = async (userMessage: string) => {
    // Clear any previous errors when user sends a new message
    setError(null);

    // Add user message to chat immediately for instant feedback
    const userMsg: ChatMessageProps = {
      role: "user",
      content: userMessage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Prepare API request: use user's message as the query
      // Backend will embed this, search for similar incidents, and format response
      const request: ChatRequest = {
        user_query: userMessage,
        top_k: 5, // Request top 5 similar incidents (default)
      };

      // Call backend chat orchestration endpoint
      // This coordinates: embed query → search → LLM format → return answer
      const response = await chatWithIncidents(request);

      // Track response data for storage: keep answer text and incidents separate
      // from the rendered JSX so we can serialize to localStorage
      const responseData: AssistantResponse = {
        answerText: response.answer,
        incidents: response.results || [],
      };

      // Create assistant message with both the answer text and retrieved incidents
      // Combining these keeps related information together and provides context
      // to support engineers about which incidents were found
      const assistantMessage: ChatMessageProps = {
        role: "assistant",
        content: (
          <div className="space-y-2">
            {/* LLM-formatted answer with summary and guidance */}
            <p className="text-sm leading-relaxed">{response.answer}</p>

            {/* Retrieved similar incidents: support engineers use these to understand */}
            {/* which existing incidents are most relevant to the user's query */}
            {response.results && response.results.length > 0 && (
              <IncidentsPanel incidents={response.results} />
            )}
          </div>
        ),
      };

      // Add assistant response to chat state and track the data for storage
      setMessages((prev) => [...prev, assistantMessage]);
      setAssistantResponses((prev) => [...prev, responseData]);

      // Save chat to localStorage after successfully adding messages
      // This ensures the conversation persists across page refreshes
      const updatedMessages = [...messages, userMsg, assistantMessage];
      const updatedResponses = [...assistantResponses, responseData];
      saveChatToStorage(updatedMessages, updatedResponses);
    } catch (err) {
      // Handle errors gracefully with user-friendly messages
      // Display error in chat so user knows what went wrong
      const errorMessage = err instanceof Error ? err.message : "An error occurred";

      // Log error for debugging
      console.error("Chat API error:", errorMessage);

      // Add error message to chat so user sees it
      const errorMsg: ChatMessageProps = {
        role: "assistant",
        content: `Error: ${errorMessage}. Please try again.`,
      };

      setMessages((prev) => [...prev, errorMsg]);
      setError(errorMessage);
    } finally {
      // Always clear loading state, whether request succeeded or failed
      setIsLoading(false);
    }
  };

  // Chat layout: stacked container with flexible message area and fixed input
  // This creates the classic ChatGPT-style interface where the input stays
  // at the bottom while messages scroll above it, powered by real backend API
  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-lg border border-border bg-card shadow-sm lg:h-[calc(100vh-12rem)]">
      {/* Chat toolbar: clear button and status indicators */}
      {/* Placed at top so it doesn't interfere with input but remains accessible */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Chat History
        </p>
        <button
          onClick={handleClearChat}
          disabled={messages.length === 0}
          className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      {/* Message display area: flex-1 to fill available space, overflow-y for scrolling */}
      <ChatContainer messages={messages} isLoading={isLoading} />

      {/* Fixed input section: always visible at bottom */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

      {/* Temporary error notification: removed once user sends next message */}
      {error && (
        <div className="border-t border-border bg-destructive/10 px-4 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
