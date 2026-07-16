import type { Metadata } from "next";

import { CommandPanel } from "@/components/panels/command-panel";
import { SectionHeading } from "@/components/panels/section-heading";
import { GameCard } from "@/components/projects/game-card";
import { gameProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Game Lab",
  description: "Games, prototypes, mechanics tests, and honest development notes from Abdulwahid Zurayq.",
  alternates: { canonical: "/game-lab" },
};

const futureSlots = ["Movement experiment", "Dialogue system test", "Small game-jam project"];

export default function GameLabPage() {
  return (
    <div className="page-stack game-lab-page">
      <header className="page-hero game-lab-hero">
        <span>GAME LAB · BUILD QUEUE</span>
        <h1>Playable soon beats perfect someday.</h1>
        <p>Finished games, unfinished games, mechanics tests, and ideas that escaped the notes app live here.</p>
      </header>
      <CommandPanel label={<span>launch ./active-builds</span>} tone="olive">
        <SectionHeading command="game-lab --active" title="Active build" casualDescription="One real game in development. No fake screenshots and no invented launch date." copyable />
        {gameProjects.map((project) => <GameCard key={project.slug} project={project} />)}
      </CommandPanel>
      <CommandPanel label={<span>~/future-slots</span>} tone="blue">
        <SectionHeading command="ls ./future-slots" title="Empty cartridges" casualDescription="Reserved directions, not projects I’m claiming to have built." />
        <div className="future-slot-grid">
          {futureSlots.map((slot, index) => (
            <div className="future-slot" key={slot}>
              <span>EMPTY 0{index + 2}</span><strong>{slot}</strong><p>Future slot · no build exists yet</p>
            </div>
          ))}
        </div>
      </CommandPanel>
    </div>
  );
}
