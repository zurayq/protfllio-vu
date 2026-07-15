import Image from "next/image";

import { ui } from "@/content/ui";
import { LinkButton } from "@/components/ui/link-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { TechList } from "@/components/ui/tech-list";
import { projectHref } from "@/lib/projects";
import type { Project } from "@/types/content";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <article className="project-card" data-index={index}>
      {project.coverImage ? (
        <div className="project-card-media">
          <Image
            src={project.coverImage}
            alt={project.coverAlt ?? ""}
            width={960}
            height={600}
            sizes="(max-width: 760px) 100vw, 36vw"
          />
          <span className="project-index" aria-hidden="true">0{index + 1}</span>
        </div>
      ) : null}
      <div className="project-card-copy">
        <div className="project-card-meta">
          <span>{project.eyebrow}</span>
          <StatusBadge status={project.status} />
        </div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <TechList items={project.stack} limit={3} />
        <div className="card-actions">
          <LinkButton
            href={projectHref(project)}
            variant="primary"
            event="project_opened"
            eventProperties={{ slug: project.slug }}
          >
            {ui.common.details}
          </LinkButton>
          {project.sourceUrl ? (
            <LinkButton href={project.sourceUrl} variant="quiet">{ui.common.source}</LinkButton>
          ) : null}
        </div>
      </div>
    </article>
  );
}
