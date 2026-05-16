import { useState } from "react";
import { Send } from "lucide-react";

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

// Premium chat input component inspired by Claude and modern AI assistants.
//
// Design features:
// - Floating/sticky positioning at bottom with background
// - Rounded Claude-style composer with subtle borders
// - Send button with icon for visual clarity
// - Multi-line support with proper resizing
// - Focus states with soft glow effect
// - Smooth transitions and animations
export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

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
    <div className="border-t border-border bg-background/95 px-6 py-4 lg:px-12">
      {/* Input Container: Sticky floating composer */}
      {/* Uses subtle border and background to define the interactive area */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="flex gap-3 rounded-lg border border-border bg-card p-3 shadow-sm transition-all focus-within:border-border/50 focus-within:shadow-md">
          {/* Textarea: Multi-line message input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              isLoading
                ? "Waiting for response..."
                : "Ask about an incident, paste a link, or type your question..."
            }
            className="flex-1 resize-none rounded bg-transparent text-sm outline-none placeholder-muted-foreground disabled:opacity-50"
            rows={3}
          />

          {/* Send Button: Icon button with hover state */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="self-end rounded-md bg-blue-600 p-2 text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>

        {/* Input Helper Text */}
        <p className="mt-2 text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
