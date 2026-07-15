import type { Quest } from "@/types/content";

export function QuestCard({ quest }: { quest: Quest }) {
  return (
    <article className="quest-card">
      <div className="quest-card-top">
        <span className="quest-marker">{quest.marker}</span>
        <span className={"quest-state quest-state-" + quest.state}>{quest.state}</span>
      </div>
      <p className="quest-label">{quest.label}</p>
      <h3>{quest.title}</h3>
      <p>{quest.description}</p>
    </article>
  );
}
