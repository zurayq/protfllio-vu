import Image from "next/image";
import Link from "next/link";

import { LinkButton } from "@/components/ui/link-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { TechList } from "@/components/ui/tech-list";
import { projectHref } from "@/lib/projects";
import type { Project } from "@/types/content";

type ProjectDetailProps = {
  project: Project;
  previous?: Project;
  next?: Project;
};

function DetailList({ items, empty }: { items?: string[]; empty?: string }) {
  if (!items?.length) return empty ? <p className="detail-empty">{empty}</p> : null;
  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function ProjectDetail({ project, previous, next }: ProjectDetailProps) {
  return (
    <article className="project-detail">
      <header className="project-detail-header">
        <Link href={project.category === "game" ? "/game-lab" : "/projects"} className="back-link">
          ← Back to {project.category === "game" ? "Game Lab" : "projects"}
        </Link>
        <div className="project-detail-title-row">
          <div>
            <span className="detail-eyebrow">{project.eyebrow}</span>
            <h1>{project.title}</h1>
          </div>
          <StatusBadge status={project.status} />
        </div>
        <p className="project-detail-summary">{project.summary}</p>
      </header>

      {project.coverImage ? (
        <figure className="project-detail-cover">
          <Image
            src={project.coverImage}
            alt={project.coverAlt ?? ""}
            width={1440}
            height={900}
            sizes="(max-width: 1200px) 100vw, 1120px"
            priority
          />
          <figcaption>Placeholder project art · replace in /public/images when real media is ready.</figcaption>
        </figure>
      ) : null}

      <div className="project-detail-layout">
        <aside className="project-facts" aria-label="Project facts">
          <div><span>ROLE</span><p>{project.role ?? "TODO"}</p></div>
          <div><span>TEAM</span><p>{project.teamSize ?? "TODO"}</p></div>
          {project.year ? <div><span>YEAR</span><p>{project.year}</p></div> : null}
          <div><span>TOOLS</span><TechList items={project.stack} /></div>
          <div className="project-link-stack">
            {project.liveUrl ? <LinkButton href={project.liveUrl}>Open live project</LinkButton> : null}
            {project.sourceUrl ? <LinkButton href={project.sourceUrl}>View source</LinkButton> : null}
            {project.devlogUrl ? <LinkButton href={project.devlogUrl}>Read devlog</LinkButton> : null}
            {!project.liveUrl && !project.sourceUrl && !project.devlogUrl ? (
              <p className="detail-empty">No public external links yet.</p>
            ) : null}
          </div>
        </aside>

        <div className="project-story">
          <section>
            <span className="story-index">01</span>
            <h2>The file</h2>
            <p>{project.description}</p>
          </section>
          {project.problem ? (
            <section><span className="story-index">02</span><h2>Problem</h2><p>{project.problem}</p></section>
          ) : null}
          {project.approach ? (
            <section><span className="story-index">03</span><h2>Approach</h2><p>{project.approach}</p></section>
          ) : null}
          {project.features ? (
            <section>
              <span className="story-index">04</span>
              <h2>Feature state</h2>
              <div className="feature-state-grid">
                <div><h3>Available</h3><DetailList items={project.features.available} empty="Nothing is marked complete yet." /></div>
                <div><h3>In progress</h3><DetailList items={project.features.inProgress} empty="No active items listed." /></div>
                <div><h3>Planned</h3><DetailList items={project.features.planned} empty="No planned items listed." /></div>
              </div>
            </section>
          ) : null}
          {project.technicalDecisions?.length ? (
            <section><span className="story-index">05</span><h2>Technical decisions</h2><DetailList items={project.technicalDecisions} /></section>
          ) : null}
          {project.gallery?.length ? (
            <section>
              <span className="story-index">06</span><h2>Gallery</h2>
              <div className="project-gallery">
                {project.gallery.map((item) => (
                  <figure key={item.src}><Image src={item.src} alt={item.alt} width={960} height={640} />{item.caption ? <figcaption>{item.caption}</figcaption> : null}</figure>
                ))}
              </div>
            </section>
          ) : null}
          <div className="story-split">
            <section><span className="story-index">07</span><h2>Challenges</h2><DetailList items={project.challenges} empty="TODO: add verified challenges." /></section>
            <section><span className="story-index">08</span><h2>What I learned</h2><DetailList items={project.learnings} empty="TODO: add learnings after the next build." /></section>
          </div>
          <section><span className="story-index">09</span><h2>Next steps</h2><DetailList items={project.nextSteps} empty="TODO: add next steps." /></section>
        </div>
      </div>

      <nav className="project-pagination" aria-label="Adjacent projects">
        {previous ? <Link href={projectHref(previous)}><span>← Previous</span><strong>{previous.title}</strong></Link> : <span />}
        {next ? <Link href={projectHref(next)}><span>Next →</span><strong>{next.title}</strong></Link> : <span />}
      </nav>
    </article>
  );
}
