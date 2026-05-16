import { useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const canSend = input.trim().length > 0 && !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div
      className="border-t border-[hsl(var(--border-subtle))] px-6 py-5 lg:px-12"
      style={{ background: "hsl(var(--surface-0))" }}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div
          className="relative rounded-2xl border transition-all duration-200"
          style={{
            background: "hsl(var(--surface-2))",
            borderColor: isFocused
              ? "hsl(var(--accent-violet) / 0.45)"
              : "hsl(var(--border))",
            boxShadow: isFocused
              ? "0 0 0 3px hsl(var(--accent-violet) / 0.08), 0 4px 24px hsl(var(--accent-violet) / 0.06)"
              : "none",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            placeholder={
              isLoading
                ? "Waiting for response…"
                : "Describe an incident, paste a link, or ask a question…"
            }
            className="w-full resize-none bg-transparent px-4 pt-4 pb-12 text-sm leading-relaxed text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground)/0.5)] outline-none disabled:opacity-50"
            rows={3}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          {/* Bottom bar inside textarea box */}
          <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
            <p className="text-[11px] text-[hsl(var(--muted-foreground)/0.45)]">
              Enter to send · Shift+Enter for newline
            </p>

            {/* Send button */}
            <button
              type="submit"
              disabled={!canSend}
              className="group flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
              style={
                canSend
                  ? {
                      background:
                        "linear-gradient(135deg, hsl(var(--accent-violet)) 0%, hsl(252 80% 48%) 100%)",
                      boxShadow: "0 2px 12px hsl(var(--accent-violet) / 0.3)",
                    }
                  : { background: "hsl(var(--surface-3))" }
              }
            >
              {isLoading ? (
                <Loader2
                  size={14}
                  className="animate-spin text-[hsl(var(--muted-foreground))]"
                />
              ) : (
                <ArrowUp
                  size={14}
                  strokeWidth={2.5}
                  className={canSend ? "text-white" : "text-[hsl(var(--muted-foreground))]"}
                />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}