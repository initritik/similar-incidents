import { useState } from "react";
import { ChevronDown, Hash } from "lucide-react";
import type { SimilarIncident } from "@/types/incident";

export interface IncidentCardProps {
  incident: SimilarIncident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scorePercent = Math.round(incident.similarity_score * 100);

  const scoreStyle =
    scorePercent >= 80
      ? {
          bg: "hsl(173 72% 52% / 0.12)",
          text: "hsl(173 72% 62%)",
          border: "hsl(173 72% 40% / 0.25)",
        }
      : scorePercent >= 60
      ? {
          bg: "hsl(var(--accent-violet) / 0.12)",
          text: "hsl(var(--accent-violet))",
          border: "hsl(var(--accent-violet) / 0.25)",
        }
      : {
          bg: "hsl(38 95% 62% / 0.12)",
          text: "hsl(38 95% 62%)",
          border: "hsl(38 95% 40% / 0.25)",
        };

  const priorityColor =
    incident.priority?.toLowerCase().includes("1") || incident.priority?.toLowerCase().includes("critical")
      ? "hsl(350 80% 65%)"
      : incident.priority?.toLowerCase().includes("2") || incident.priority?.toLowerCase().includes("high")
      ? "hsl(38 95% 62%)"
      : "hsl(var(--muted-foreground))";

  return (
    <div
      className="group rounded-xl border p-4 transition-all duration-200"
      style={{
        background: "hsl(var(--surface-1))",
        borderColor: "hsl(var(--border))",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "hsl(var(--border-subtle))";
        (e.currentTarget as HTMLDivElement).style.background =
          "hsl(var(--surface-2))";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "hsl(var(--border))";
        (e.currentTarget as HTMLDivElement).style.background =
          "hsl(var(--surface-1))";
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          <Hash
            size={13}
            className="mt-0.5 flex-shrink-0 text-[hsl(var(--muted-foreground)/0.5)]"
            strokeWidth={2}
          />
          <div className="min-w-0">
            <p
              className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              {incident.incident_number}
            </p>
            <p className="line-clamp-2 text-sm font-medium leading-snug text-[hsl(var(--foreground))]">
              {incident.short_description}
            </p>
          </div>
        </div>

        {/* Score badge */}
        <div
          className="flex-shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold"
          style={{
            background: scoreStyle.bg,
            color: scoreStyle.text,
            borderColor: scoreStyle.border,
          }}
        >
          {scorePercent}%
        </div>
      </div>

      {/* Metadata */}
      <div
        className="mt-3.5 grid grid-cols-3 gap-3 border-t pt-3.5"
        style={{ borderColor: "hsl(var(--border-subtle))" }}
      >
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground)/0.5)]">
            Category
          </p>
          <p className="text-xs text-[hsl(var(--foreground)/0.8)]">{incident.category}</p>
        </div>
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground)/0.5)]">
            Priority
          </p>
          <p className="text-xs font-medium" style={{ color: priorityColor }}>
            {incident.priority}
          </p>
        </div>
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground)/0.5)]">
            Assigned To
          </p>
          <p className="truncate text-xs text-[hsl(var(--foreground)/0.8)]">
            {incident.assignment_group}
          </p>
        </div>
      </div>

      {/* Resolution notes */}
      {incident.resolution_notes && (
        <div
          className="mt-3 border-t pt-3"
          style={{ borderColor: "hsl(var(--border-subtle))" }}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
            style={{ color: "hsl(var(--accent-violet))" }}
          >
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            />
            Resolution Notes
          </button>

          {isExpanded && (
            <div
              className="mt-2.5 animate-fade-up rounded-lg p-3"
              style={{ background: "hsl(var(--surface-0))" }}
            >
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                {incident.resolution_notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}