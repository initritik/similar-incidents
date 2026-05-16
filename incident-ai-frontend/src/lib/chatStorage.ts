import type { SimilarIncident } from "@/types/incident";

const STORAGE_KEY = "incident_ai_chat_history";

// Internal storage format: separates storable data from React components
// Assistant messages store the answer text and incidents array separately
interface StoredMessage {
  role: "user" | "assistant";
  userText?: string; // For user messages
  answerText?: string; // For assistant messages
  incidents?: SimilarIncident[]; // For assistant messages
  timestamp: number;
}

// Reconstructed message format that includes rendered incidents
export interface ReconstructedMessage {
  role: "user" | "assistant";
  content: string | { answerText: string; incidents: SimilarIncident[] };
  timestamp: number;
}

/**
 * Save chat messages to localStorage.
 *
 * Frontend persistence improves UX because users expect their conversation
 * history to survive a page refresh. For POCs, localStorage is sufficient—
 * production systems would use backend databases with multi-device sync.
 */
export function saveChatToStorage(messages: Array<{
  role: "user" | "assistant";
  content: string | any; // Can be string or JSX
}>, assistantData?: Array<{ answerText: string; incidents: SimilarIncident[] }>): void {
  try {
    const stored: StoredMessage[] = [];

    messages.forEach((msg, index) => {
      if (msg.role === "user") {
        // User messages are simple strings
        stored.push({
          role: "user",
          userText: msg.content as string,
          timestamp: Date.now(),
        });
      } else if (msg.role === "assistant" && assistantData && assistantData[index]) {
        // Assistant messages: extract stored data from tracking array
        // JSX components (IncidentsPanel) can't be serialized, so we store the data
        stored.push({
          role: "assistant",
          answerText: assistantData[index].answerText,
          incidents: assistantData[index].incidents,
          timestamp: Date.now(),
        });
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    // Silently fail on storage errors (quota exceeded, etc.)
    // User experience degrades gracefully—chat continues without persistence
    console.error("Failed to save chat to localStorage:", error);
  }
}

/**
 * Load chat messages from localStorage.
 *
 * Safely handles corrupted data: if parsing fails, returns empty array
 * instead of crashing. This allows the app to recover from storage issues.
 */
export function loadChatFromStorage(): ReconstructedMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: StoredMessage[] = JSON.parse(stored);

    // Reconstruct messages in a format that chat components can render
    // User messages are strings; assistant messages include incidents
    return parsed.map((msg) => ({
      role: msg.role,
      content:
        msg.role === "user"
          ? (msg.userText || "")
          : {
              answerText: msg.answerText || "",
              incidents: msg.incidents || [],
            },
      timestamp: msg.timestamp,
    }));
  } catch (error) {
    // Return empty chat if storage is corrupted
    // Better than crashing: user gets a fresh start instead of errors
    console.error("Failed to load chat from localStorage:", error);
    return [];
  }
}

/**
 * Clear all chat history from localStorage.
 *
 * Useful for privacy or when starting a fresh conversation.
 */
export function clearChatStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear chat storage:", error);
  }
}
