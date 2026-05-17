import { useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?:    boolean;
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [input,     setInput]     = useState("");
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
      className="px-4 py-4 sm:px-6 sm:py-5 lg:px-12"
      style={{
        background: "hsl(var(--rl-ink-950))",
        borderTop:  "1px solid hsl(var(--rl-ink-800))",
      }}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div
          className="relative rounded-2xl transition-all duration-200"
          style={{
            background: "hsl(var(--rl-ink-900))",
            border:     isFocused
              ? "1px solid hsl(var(--rl-gold-400) / 0.45)"
              : "1px solid hsl(var(--rl-ink-700))",
            boxShadow: isFocused
              ? "0 0 0 3px hsl(var(--rl-gold-400) / 0.07), 0 4px 20px hsl(var(--rl-ink-950) / 0.4)"
              : "0 2px 8px hsl(var(--rl-ink-950) / 0.3)",
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
            className="w-full resize-none bg-transparent px-4 pt-4 pb-12 text-sm leading-relaxed outline-none disabled:opacity-50"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color:      "hsl(var(--rl-ink-100))",
            }}
            rows={3}
          />

          {/* Bottom row */}
          <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
            <p
              className="text-[10px] hidden sm:block"
              style={{ color: "hsl(var(--rl-ink-600))" }}
            >
              Enter to send · Shift+Enter for newline
            </p>
            <p
              className="text-[10px] sm:hidden"
              style={{ color: "hsl(var(--rl-ink-600))" }}
            >
              Tap ↑ to send
            </p>

            <button
              type="submit"
              disabled={!canSend}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-25"
              style={
                canSend
                  ? {
                      background:
                        "linear-gradient(135deg, hsl(var(--rl-purple-950)) 0%, hsl(var(--rl-purple-800)) 100%)",
                      border:    "1px solid hsl(var(--rl-gold-400) / 0.4)",
                      boxShadow: "0 2px 10px hsl(var(--rl-purple-950) / 0.5)",
                    }
                  : {
                      background: "hsl(var(--rl-ink-800))",
                      border:     "1px solid hsl(var(--rl-ink-700))",
                    }
              }
            >
              {isLoading ? (
                <Loader2 size={13} className="animate-spin" style={{ color: "hsl(var(--rl-ink-400))" }} />
              ) : (
                <ArrowUp
                  size={13}
                  strokeWidth={2.5}
                  style={{ color: canSend ? "hsl(var(--rl-gold-300))" : "hsl(var(--rl-ink-600))" }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p
          className="mt-2.5 text-center text-[10px]"
          style={{ color: "hsl(var(--rl-ink-600))" }}
        >
          Royal London · Incident AI · Responses are AI-generated and for guidance only
        </p>
      </form>
    </div>
  );
}