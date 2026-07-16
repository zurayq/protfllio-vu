import Image from "next/image";

import { LinkButton } from "@/components/ui/link-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { TechList } from "@/components/ui/tech-list";
import type { Project } from "@/types/content";

export function GameCard({ project }: { project: Project }) {
  const features = project.features;
  return (
    <article className="game-card">
      <div className="game-card-copy">
        <div className="game-slot-row">
          <span>{project.eyebrow}</span>
          <StatusBadge status={project.status} />
        </div>
        <h3>{project.title}</h3>
        <p className="game-summary">{project.summary}</p>
        <TechList items={project.stack} limit={4} />

        <div className="game-solving">
          <span>WHAT I’M SOLVING</span>
          <p>{project.problem}</p>
        </div>

        {features ? (
          <div className="feature-counts" aria-label="Feature state summary">
            <div><strong>{features.available.length}</strong><span>available</span></div>
            <div><strong>{features.inProgress.length}</strong><span>in progress</span></div>
            <div><strong>{features.planned.length}</strong><span>planned</span></div>
          </div>
        ) : null}

        <div className="card-actions">
          <LinkButton
            href={"/game-lab/" + project.slug}
            variant="primary"
            event="project_opened"
            eventProperties={{ slug: project.slug }}
          >
            Open dev file
          </LinkButton>
          {project.devlogUrl ? <LinkButton href={project.devlogUrl}>Devlog</LinkButton> : null}
          {project.liveUrl ? (
            <LinkButton href={project.liveUrl} event="game_play_clicked" eventProperties={{ slug: project.slug }}>
              Play
            </LinkButton>
          ) : null}
        </div>
      </div>
      {project.coverImage ? (
        <div className="game-card-media">
          <Image
            src={project.coverImage}
            alt={project.coverAlt ?? ""}
            width={1120}
            height={800}
            sizes="(max-width: 900px) 100vw, 48vw"
            priority
          />
          <div className="game-media-note">
            <span>BUILD STATE</span>
            <strong>Not playable yet</strong>
          </div>
        </div>
      ) : null}
    </article>
  );
}
