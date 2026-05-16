import { Layers } from "lucide-react";
import type { SimilarIncident } from "@/types/incident";
import { IncidentCard } from "./IncidentCard";

export interface IncidentsPanelProps {
  incidents: SimilarIncident[];
}

export function IncidentsPanel({ incidents }: IncidentsPanelProps) {
  if (!incidents || incidents.length === 0) return null;

  const avgScore = (
    incidents.reduce((sum, inc) => sum + inc.similarity_score, 0) / incidents.length
  ).toFixed(2);

  return (
    <div
      className="mt-4 overflow-hidden rounded-2xl border"
      style={{
        background: "hsl(var(--surface-1))",
        borderColor: "hsl(var(--border))",
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{
          borderColor: "hsl(var(--border-subtle))",
          background: "hsl(var(--surface-0) / 0.5)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ background: "hsl(var(--accent-teal) / 0.15)" }}
          >
            <Layers
              size={12}
              strokeWidth={2}
              style={{ color: "hsl(var(--accent-teal))" }}
            />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[hsl(var(--muted-foreground))]">
            Similar Incidents
          </p>
          <span
            className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
            style={{
              background: "hsl(var(--accent-teal) / 0.12)",
              color: "hsl(var(--accent-teal))",
            }}
          >
            {incidents.length}
          </span>
        </div>
        <p className="text-[11px] text-[hsl(var(--muted-foreground)/0.6)]">
          Avg match{" "}
          <span className="font-semibold text-[hsl(var(--foreground)/0.7)]">
            {Math.round(parseFloat(avgScore) * 100)}%
          </span>
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-2 p-3">
        {incidents.map((incident, index) => (
          <IncidentCard
            key={`${incident.incident_number}-${index}`}
            incident={incident}
          />
        ))}
      </div>
    </div>
  );
}