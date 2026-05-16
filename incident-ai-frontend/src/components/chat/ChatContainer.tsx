import { useEffect, useRef } from "react";
import type { ChatMessageProps } from "./ChatMessage";
import { ChatMessage } from "./ChatMessage";

export interface ChatContainerProps {
  messages: ChatMessageProps[];
  isLoading?: boolean;
}

export function ChatContainer({ messages, isLoading = false }: ChatContainerProps) {
  // Keep reference to scroll container so we can auto-scroll to latest messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change or loading state updates
  // This ensures the user always sees the most recent message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
      {/* Empty state: show prompt when no messages exist */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              Start a conversation
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask about an incident or paste an incident link or ticket number
            </p>
          </div>
        </div>
      )}

      {/* Message list: render all messages with proper styling */}
      {messages.map((message, index) => (
        <ChatMessage key={index} role={message.role} content={message.content} />
      ))}

      {/* Loading state: show placeholder while waiting for response */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="rounded-lg bg-muted px-4 py-2 text-sm text-foreground">
            <div className="flex gap-1">
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              <span
                className="inline-block h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: "0.1s" }}
              />
              <span
                className="inline-block h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Auto-scroll anchor: scroll container maintains this at bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
}
