import type { Metadata } from "next";

import { CommandPanel } from "@/components/panels/command-panel";
import { toolboxGroups } from "@/content/toolbox";

export const metadata: Metadata = {
  title: "Toolbox",
  description: "The technologies Abdulwahid Zurayq uses now, is learning, and has encountered academically.",
  alternates: { canonical: "/toolbox" },
};

export default function ToolboxPage() {
  return (
    <div className="page-stack toolbox-page">
      <header className="page-hero toolbox-hero">
        <span>INVENTORY · HONEST LABELS ENABLED</span>
        <h1>Tools are save points, not personality traits.</h1>
        <p>A practical inventory of what I use, what I’m developing further, and what came through coursework.</p>
      </header>
      <CommandPanel label={<span>inventory --grouped</span>} tone="olive">
        <div className="toolbox-grid">
          {toolboxGroups.map((group, index) => (
            <section className="tool-group" key={group.title}>
              <div className="tool-group-index"><span>{group.marker}</span><small>0{index + 1}</small></div>
              <div className="tool-group-copy"><h2>{group.title}</h2><p>{group.description}</p></div>
              <ul>{group.items.map((item) => <li key={item}><span aria-hidden="true">+</span>{item}</li>)}</ul>
            </section>
          ))}
        </div>
      </CommandPanel>
      <p className="toolbox-note">Icons are intentionally omitted here: the names scan faster, remain accessible, and avoid pretending a logo means mastery.</p>
    </div>
  );
}
