import { useState } from "react";

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState("");

  // Handle form submission: trim input, validate, then pass to parent
  // and reset the input field for the next message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setInput("");
  };

  // Handle Enter key: submit on Enter, allow Shift+Enter for new lines
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-border bg-card px-4 py-3 shadow-sm"
    >
      {/* Textarea allows multi-line input while staying compact */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        placeholder={
          isLoading
            ? "Waiting for response..."
            : "Ask about an incident or paste an incident link..."
        }
        className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-ring focus:ring-offset-0"
        rows={3}
      />

      {/* Submit button: disabled during loading to prevent multiple submissions */}
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="self-end rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "..." : "Send"}
      </button>
    </form>
  );
}
