import type { ReactNode } from "react";

// Message type discriminator: 'user' or 'assistant'
export type MessageRole = "user" | "assistant";

export interface ChatMessageProps {
  role: MessageRole;
  content: string | ReactNode;
}

// Premium chat message component inspired by Claude.
//
// Design principles:
// - User messages: subtle gradient background, right-aligned, rounded design
// - Assistant messages: clean left-aligned layout with generous spacing
// - Typography: improved readability through careful font sizing
// - Spacing: breathing room between messages for premium feel
// - Animations: smooth fade-in transitions (via Tailwind animation utilities)
export function ChatMessage({ role, content }: ChatMessageProps) {
  // Determine styling based on message role
  const isUserMessage = role === "user";

  if (isUserMessage) {
    // User message: right-aligned, gradient background, premium styling
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-md rounded-2xl bg-blue-600 px-4 py-3 text-sm text-white shadow-sm">
          {typeof content === "string" ? (
            <p className="leading-relaxed">{content}</p>
          ) : (
            content
          )}
        </div>
      </div>
    );
  }

  // Assistant message: left-aligned, clean design, premium spacing
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-2xl space-y-3">
        {typeof content === "string" ? (
          <p className="text-sm leading-relaxed text-foreground">{content}</p>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
