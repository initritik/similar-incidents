import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { SimilarIncident } from "@/types/incident";

export interface IncidentCardProps {
  incident: SimilarIncident;
}

// Premium enterprise incident card component.
//
// Design features:
// - Clean header with incident number and similarity score badge
// - Semantic color-coding for similarity scores (green/blue/amber)
// - Organized metadata grid with clear labels
// - Collapsible resolution notes section
// - Smooth hover transitions
// - Premium spacing and typography
// - Enterprise-grade visual hierarchy
export function IncidentCard({ incident }: IncidentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format similarity score as percentage
  const scorePercent = Math.round(incident.similarity_score * 100);

  // Color-code based on similarity threshold
  const scoreColor =
    scorePercent >= 80
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      : scorePercent >= 60
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";

  return (
    <div className="group rounded-lg border border-border bg-card/50 p-4 transition-all hover:bg-card hover:shadow-md">
      {/* Header: Incident Number and Similarity Score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          {/* Incident Number: Monospace for technical identity */}
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {incident.incident_number}
          </p>

          {/* Short Description: Main content */}
          <p className="line-clamp-2 text-sm font-medium text-foreground">
            {incident.short_description}
          </p>
        </div>

        {/* Similarity Score Badge: Prominent and color-coded */}
        <div
          className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${scoreColor}`}
        >
          {scorePercent}%
        </div>
      </div>

      {/* Metadata Grid: Category, Priority, Assignment */}
      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-border/50 pt-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </p>
          <p className="mt-1 text-xs text-foreground">{incident.category}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Priority
          </p>
          <p className="mt-1 text-xs text-foreground">{incident.priority}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Assigned To
          </p>
          <p className="mt-1 truncate text-xs text-foreground">
            {incident.assignment_group}
          </p>
        </div>
      </div>

      {/* Collapsible Resolution Notes */}
      {incident.resolution_notes && (
        <div className="mt-3 border-t border-border/50 pt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
            Resolution Notes
          </button>

          {isExpanded && (
            <div className="mt-2 rounded bg-muted/30 p-2">
              <p className="line-clamp-4 whitespace-pre-wrap text-xs text-muted-foreground">
                {incident.resolution_notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
