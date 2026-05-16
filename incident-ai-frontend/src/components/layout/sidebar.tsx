import { Plus, MessageSquare, Settings } from "lucide-react";

// Premium sidebar component that provides navigation and chat history.
//
// The sidebar uses a minimal, organized design with:
// - Clear visual hierarchy through spacing and typography
// - Icon-based navigation for quick scanning
// - Expandable sections for context
// - Calm neutral colors that don't compete for attention
//
// This follows modern AI assistant design patterns seen in Claude,
// Copilot, and enterprise observability tools.
export function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      {/* Sidebar Header: Branding and New Chat Button */}
      {/* Uses padding and a distinctive button to draw attention to primary action */}
      <div className="border-b border-border px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Incident AI
            </p>
            <h2 className="mt-1 text-sm font-semibold text-foreground">
              Assistant
            </h2>
          </div>
        </div>

        {/* New Chat Button: Primary Action */}
        {/* Styled to be visually prominent while maintaining premium aesthetics */}
        <button className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 active:bg-muted/60">
          <div className="flex items-center justify-center gap-2">
            <Plus size={16} />
            <span>New Chat</span>
          </div>
        </button>
      </div>

      {/* Sidebar Content: Chat History and Navigation */}
      {/* Organized in sections with clear visual separation */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {/* Chat History Section */}
        <div className="space-y-2">
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            History
          </p>

          {/* Placeholder for recent chats */}
          {/* In production, this would be populated from localStorage/backend */}
          <div className="rounded-lg px-3 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} />
              <span>No recent chats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer: Settings and Additional Options */}
      {/* Provides access to secondary actions without cluttering main navigation */}
      <div className="border-t border-border px-2 py-4">
        <button className="w-full rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <div className="flex items-center gap-2">
            <Settings size={16} />
            <span>Settings</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
