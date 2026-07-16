import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type CommandPanelProps = {
  label: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  tone?: "olive" | "orange" | "blue" | "neutral";
  className?: string;
  id?: string;
};

export function CommandPanel({
  label,
  children,
  action,
  tone = "neutral",
  className,
  id,
}: CommandPanelProps) {
  return (
    <section id={id} className={cn("command-panel", "tone-" + tone, className)}>
      <div className="command-panel-bar">
        <div className="command-panel-label">
          <span className="panel-marker" aria-hidden="true" />
          {label}
        </div>
        {action ? <div className="command-panel-action">{action}</div> : null}
      </div>
      <div className="command-panel-body">{children}</div>
    </section>
  );
}
