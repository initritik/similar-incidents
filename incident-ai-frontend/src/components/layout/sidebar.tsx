import { Plus, MessageSquare, Zap, Settings, ChevronRight } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="relative flex w-64 flex-col overflow-hidden border-r border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-1))]">
      {/* Ambient top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(var(--accent-violet) / 0.5) 40%, hsl(var(--accent-teal) / 0.4) 70%, transparent 100%)",
        }}
      />

      {/* Header */}
      <div className="px-5 pb-4 pt-6">
        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--accent-violet)) 0%, hsl(var(--accent-teal)) 100%)",
            }}
          >
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">
              Incident
            </p>
            <p
              className="text-sm font-semibold leading-none tracking-tight text-[hsl(var(--foreground))]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              AI Assistant
            </p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          className="group relative w-full overflow-hidden rounded-xl border border-[hsl(var(--border))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--foreground))] transition-all duration-200 hover:border-[hsl(var(--accent-violet)/0.4)] hover:text-[hsl(var(--accent-violet))]"
          style={{
            background: "hsl(var(--surface-2))",
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background: "hsl(var(--accent-violet) / 0.06)",
            }}
          />
          <div className="relative flex items-center justify-center gap-2">
            <Plus size={15} strokeWidth={2} />
            <span>New Chat</span>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-[hsl(var(--border-subtle))]" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground)/0.6)]">
          History
        </p>

        <div className="sidebar-item flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2.5 text-[hsl(var(--muted-foreground))]">
          <MessageSquare size={14} className="flex-shrink-0 opacity-50" />
          <span className="text-xs">No recent chats</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[hsl(var(--border-subtle))] px-3 py-3">
        <button className="sidebar-item group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-[hsl(var(--muted-foreground))] transition-all duration-150 hover:bg-[hsl(var(--surface-2))] hover:text-[hsl(var(--foreground))]">
          <div className="flex items-center gap-2.5">
            <Settings size={15} strokeWidth={1.75} />
            <span className="text-xs font-medium">Settings</span>
          </div>
          <ChevronRight
            size={13}
            className="opacity-0 transition-opacity group-hover:opacity-50"
          />
        </button>
      </div>
    </aside>
  );
}