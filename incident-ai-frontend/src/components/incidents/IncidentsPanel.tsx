import type { SimilarIncident } from "@/types/incident";
import { IncidentCard } from "./IncidentCard";

export interface IncidentsPanelProps {
  incidents: SimilarIncident[];
}

export function IncidentsPanel({ incidents }: IncidentsPanelProps) {
  // Return early if no incidents to display
  if (!incidents || incidents.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      {/* Label: helps support engineers understand what they're looking at */}
      {/* Kept separate from card styling so it doesn't appear as a chat message */}
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Similar Incidents ({incidents.length})
      </p>

      {/* Card grid: displays all retrieved incidents */}
      {/* Each card is self-contained and reusable, making the component */}
      {/* maintainable and easy to extend with new incident metadata in the future */}
      <div className="space-y-2">
        {incidents.map((incident, index) => (
          <IncidentCard key={`${incident.incident_number}-${index}`} incident={incident} />
        ))}
      </div>
    </div>
  );
}
