import { cn } from "@/lib/cn";
import type { ProjectStatus } from "@/types/content";

const labels: Record<ProjectStatus, string> = {
  concept: "Concept",
  prototype: "Prototype",
  "in-development": "In development",
  playable: "Playable",
  shipped: "Shipped",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const active = status === "in-development" || status === "playable";
  return (
    <span className={cn("status-badge", "status-" + status)}>
      <span className={cn("status-dot", active && "status-dot-active")} aria-hidden="true" />
      {labels[status]}
    </span>
  );
}
