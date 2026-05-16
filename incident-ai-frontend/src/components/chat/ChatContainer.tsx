import { useEffect, useRef } from "react";
import type { ChatMessageProps } from "./ChatMessage";
import { ChatMessage } from "./ChatMessage";

export interface ChatContainerProps {
  messages: ChatMessageProps[];
  isLoading?: boolean;
}

// Premium chat container with elegant scrolling and spacing.
//
// Design features:
// - Generous vertical spacing between messages for premium feel
// - Smooth auto-scroll as new messages arrive
// - Beautiful empty state with welcoming message
// - Elegant loading indicator with animated dots
// - Responsive padding that works across device sizes
export function ChatContainer({ messages, isLoading = false }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message as conversation grows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-8 lg:px-12">
      {/* Empty State: Premium welcome screen */}
      {/* Shown when no messages exist, provides guidance and encouragement */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">
                Welcome to Incident AI
              </h2>
              <p className="mt-2 text-muted-foreground">
                Ask questions about incidents or paste an incident link
              </p>
            </div>

            {/* Suggested Prompts: Quick starting points */}
            <div className="grid gap-3 lg:grid-cols-2">
              <button className="rounded-lg border border-border bg-card px-4 py-3 text-left text-sm transition-all hover:border-border/80 hover:bg-muted">
                <p className="font-medium text-foreground">
                  "VPN authentication failures"
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Find similar VPN issues
                </p>
              </button>
              <button className="rounded-lg border border-border bg-card px-4 py-3 text-left text-sm transition-all hover:border-border/80 hover:bg-muted">
                <p className="font-medium text-foreground">
                  "Email delivery problems"
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore email incidents
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message List: Displays all conversation messages */}
      {/* Each message has breathing room with generous vertical spacing */}
      {messages.length > 0 && (
        <div className="space-y-6">
          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))}
        </div>
      )}

      {/* Loading State: Animated indicator while waiting for response */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="rounded-lg bg-muted px-4 py-2">
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

      {/* Auto-scroll anchor: maintains scroll position at latest message */}
      <div ref={messagesEndRef} />
    </div>
  );
}
