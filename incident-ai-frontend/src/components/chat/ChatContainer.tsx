import { useEffect, useRef } from "react";
import type { ChatMessageProps } from "./ChatMessage";
import { ChatMessage } from "./ChatMessage";
import { Zap, Search, AlertCircle } from "lucide-react";

export interface ChatContainerProps {
  messages: ChatMessageProps[];
  isLoading?: boolean;
}

const SUGGESTIONS = [
  {
    icon: Search,
    label: "VPN authentication failures",
    sub: "Find similar VPN incidents",
  },
  {
    icon: AlertCircle,
    label: "Email delivery problems",
    sub: "Explore email incidents",
  },
  {
    icon: Search,
    label: "Database connection timeout",
    sub: "Trace outage patterns",
  },
  {
    icon: AlertCircle,
    label: "SSL certificate errors",
    sub: "Certificate-related issues",
  },
];

export function ChatContainer({ messages, isLoading = false }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8 lg:px-12">
      {/* Empty State */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl space-y-8 text-center">
            {/* Logo lockup */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--accent-violet)) 0%, hsl(var(--accent-teal)) 100%)",
                  boxShadow:
                    "0 8px 32px hsl(var(--accent-violet) / 0.3), 0 0 0 1px hsl(var(--accent-violet) / 0.15)",
                }}
              >
                <Zap size={24} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <h2
                  className="text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))]"
                  style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.025em" }}
                >
                  Incident AI
                </h2>
                <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
                  Describe an incident, paste a link, or ask anything
                </p>
              </div>
            </div>

            {/* Divider with label */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[hsl(var(--border-subtle))]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[hsl(var(--surface-0))] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground)/0.5)]">
                  Try asking
                </span>
              </div>
            </div>

            {/* Suggestion grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map(({ icon: Icon, label, sub }, i) => (
                <button
                  key={i}
                  className="group relative overflow-hidden rounded-xl border border-[hsl(var(--border))] p-4 text-left transition-all duration-200 hover:border-[hsl(var(--accent-violet)/0.35)]"
                  style={{ background: "hsl(var(--surface-2))" }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ background: "hsl(var(--accent-violet) / 0.05)" }}
                  />
                  <div className="relative flex items-start gap-3">
                    <div
                      className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "hsl(var(--accent-violet) / 0.12)" }}
                    >
                      <Icon
                        size={13}
                        strokeWidth={2}
                        style={{ color: "hsl(var(--accent-violet))" }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                        &ldquo;{label}&rdquo;
                      </p>
                      <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                        {sub}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-7">
          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="mt-7 flex animate-fade-up items-start gap-3">
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
          <div className="rounded-xl border border-[hsl(var(--border))] px-4 py-3"
            style={{ background: "hsl(var(--surface-2))" }}
          >
            <div className="flex items-center gap-1.5">
              {[0, 0.18, 0.36].map((delay, i) => (
                <span
                  key={i}
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "hsl(var(--accent-violet))",
                    animation: `typing-dot 1.2s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}