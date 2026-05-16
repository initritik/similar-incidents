import { AlertCircle } from "lucide-react";
import type { SimilarIncident } from "@/types/incident";
import { IncidentCard } from "./IncidentCard";

export interface IncidentsPanelProps {
  incidents: SimilarIncident[];
}

// Premium incidents panel component that presents retrieved results elegantly.
//
// Design features:
// - Organized section header with incident count
// - Icon-based visual indicators
// - Grid layout for incident cards
// - Proper spacing and visual hierarchy
// - Context-aware presentation for support engineers
export function IncidentsPanel({ incidents }: IncidentsPanelProps) {
  if (!incidents || incidents.length === 0) {
    return null;
  }

  // Find the highest similarity incident for highlighting
  const topIncident = incidents[0];
  const avgScore = (
    incidents.reduce((sum, inc) => sum + inc.similarity_score, 0) / incidents.length
  ).toFixed(2);

  return (
    <div className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-4">
      {/* Section Header: Retrieved Incidents Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Similar Incidents Found
          </p>
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          Avg. Match: <span className="text-foreground">{Math.round(parseFloat(avgScore) * 100)}%</span>
        </p>
      </div>

      {/* Top Incident Highlight: Show the best match first */}
      {topIncident && (
        <div className="space-y-2 rounded border border-border/50 bg-background/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Best Match
          </p>
          <IncidentCard incident={topIncident} />
        </div>
      )}

      {/* Related Incidents: Show remaining matches */}
      {incidents.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Other Similar Incidents
          </p>
          <div className="space-y-2">
            {incidents.slice(1).map((incident, index) => (
              <IncidentCard
                key={`${incident.incident_number}-${index}`}
                incident={incident}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
