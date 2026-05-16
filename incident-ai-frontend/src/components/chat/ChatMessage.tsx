import type { ReactNode } from "react";
import { Zap } from "lucide-react";

export type MessageRole = "user" | "assistant";

export interface ChatMessageProps {
  role: MessageRole;
  content: string | ReactNode;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex animate-fade-up justify-end">
        <div
          className="relative max-w-[72%] rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed text-white shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, hsl(252 70% 55%) 0%, hsl(252 80% 48%) 100%)",
            boxShadow: "0 4px 24px hsl(252 87% 60% / 0.18), 0 1px 3px hsl(252 87% 60% / 0.12)",
          }}
        >
          {typeof content === "string" ? (
            <p className="leading-relaxed">{content}</p>
          ) : (
            content
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-fade-up items-start gap-3">
      {/* AI avatar */}
      <div
        className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--accent-violet)) 0%, hsl(var(--accent-teal)) 100%)",
          boxShadow: "0 2px 12px hsl(var(--accent-violet) / 0.25)",
        }}
      >
        <Zap size={12} className="text-white" strokeWidth={2.5} />
      </div>

      {/* Message body */}
      <div className="max-w-[85%] space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[hsl(var(--accent-violet)/0.7)]">
          Assistant
        </p>
        <div className="text-sm leading-relaxed text-[hsl(var(--foreground)/0.9)]">
          {typeof content === "string" ? (
            <p className="leading-relaxed">{content}</p>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}