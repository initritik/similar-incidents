import type { ReactNode } from "react";

// Message type discriminator: 'user' or 'assistant'
export type MessageRole = "user" | "assistant";

export interface ChatMessageProps {
  role: MessageRole;
  content: string | ReactNode;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  // Determine styling based on message role
  // User messages align right with primary color background
  // Assistant messages align left with muted background for visual distinction
  const isUserMessage = role === "user";

  return (
    <div
      className={`flex w-full ${isUserMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
          isUserMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        {typeof content === "string" ? (
          <p className="text-sm leading-relaxed">{content}</p>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
