import type { Metadata } from "next";

import { CommandPanel } from "@/components/panels/command-panel";
import { loreEntries, languages } from "@/content/lore";

export const metadata: Metadata = {
  title: "Lore",
  description: "A personal, editable save-file timeline for Abdulwahid Zurayq.",
  alternates: { canonical: "/lore" },
};

export default function LorePage() {
  return (
    <div className="page-stack lore-page">
      <header className="page-hero lore-hero">
        <span>PERSONAL LOG · SPOILERS MINIMIZED</span>
        <h1>Lore, not a formal biography.</h1>
        <p>Short save files from Libya to Türkiye to the current game-development chapter. Unwritten stories stay visibly unwritten.</p>
      </header>
      <CommandPanel label={<span>load ~/lore/save-files</span>} tone="orange">
        <div className="lore-timeline">
          {loreEntries.map((entry, index) => (
            <article className="lore-entry" id={entry.id} key={entry.id}>
              <div className="lore-rail" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className="lore-card">
                <div className="lore-card-top">
                  <span>{entry.chapter}</span>
                  <span className={"lore-status lore-status-" + entry.status}>{entry.status.replace("-", " ")}</span>
                </div>
                <h2>{entry.title}</h2>
                <p className="lore-summary">{entry.summary}</p>
                <p>{entry.body}</p>
              </div>
            </article>
          ))}
        </div>
      </CommandPanel>
      <CommandPanel id="languages" label={<span>~/lore/languages.json</span>} tone="blue">
        <div className="languages-header"><div><span>SIDE QUEST · LANGUAGES</span><h2>Five languages, zero fake proficiency bars.</h2></div><p>Levels stay unset until Abdulwahid confirms the human labels.</p></div>
        <div className="language-grid">
          {languages.map((language, index) => (
            <div key={language.name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{language.name}</strong><small>{language.level ?? "TODO: add level"}</small></div>
          ))}
        </div>
      </CommandPanel>
    </div>
  );
}
