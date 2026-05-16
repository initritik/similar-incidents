import { useState } from "react";
import type { SimilarIncident } from "@/types/incident";

export interface IncidentCardProps {
  incident: SimilarIncident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format similarity score as percentage for better readability
  // Scores range from 0-1, so multiplying by 100 gives percentage
  const scorePercent = Math.round(incident.similarity_score * 100);

  // Determine score badge color based on similarity threshold
  // Higher scores (>70%) are more relevant to the user's query
  const scoreColor =
    scorePercent >= 80
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : scorePercent >= 60
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";

  return (
    <div className="rounded-md border border-input bg-background p-3 text-xs">
      {/* Header: incident number and similarity score */}
      {/* Similarity score is visually emphasized because it indicates relevance */}
      {/* to the user's query. Higher scores mean better matches for support engineers */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-mono font-semibold text-foreground">
            {incident.incident_number}
          </span>
          <p className="line-clamp-2 text-foreground">
            {incident.short_description}
          </p>
        </div>
        <span className={`flex-shrink-0 rounded px-2 py-1 font-medium ${scoreColor}`}>
          {scorePercent}%
        </span>
      </div>

      {/* Metadata grid: category, priority, assignment group */}
      {/* This metadata is critical for support engineers to quickly assess */}
      {/* whether an incident applies to their current case and who to contact */}
      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-input pt-2 text-muted-foreground">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide">Category</p>
          <p className="text-foreground">{incident.category}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide">Priority</p>
          <p className="text-foreground">{incident.priority}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide">Assigned To</p>
          <p className="truncate text-foreground">{incident.assignment_group}</p>
        </div>
      </div>

      {/* Optional: collapsible resolution notes */}
      {/* Resolution notes are kept in a collapsible section to reduce visual clutter */}
      {/* while still providing support engineers access to quick resolution references */}
      {incident.resolution_notes && (
        <div className="mt-2 border-t border-input pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <span>{isExpanded ? "▼" : "▶"}</span>
            Resolution Notes
          </button>

          {isExpanded && (
            <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-foreground">
              {incident.resolution_notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
