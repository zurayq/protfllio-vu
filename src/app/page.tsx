import Link from "next/link";

import { PhotoSwap } from "@/components/interactive/photo-swap";
import { CommandPanel } from "@/components/panels/command-panel";
import { SectionHeading } from "@/components/panels/section-heading";
import { QuestCard } from "@/components/cards/quest-card";
import { GameCard } from "@/components/projects/game-card";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/link-button";
import { experience } from "@/content/experience";
import { gameProjects, softwareProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { quests } from "@/content/quests";
import { toolboxGroups } from "@/content/toolbox";
import { ui } from "@/content/ui";

export default function HomePage() {
  const visibleExperience = experience.filter((entry) => entry.enabled && !entry.placeholder);
  const featuredSoftware = softwareProjects.filter((project) => project.featured).slice(0, 3);
  const featuredGame = gameProjects.find((project) => project.featured) ?? gameProjects[0];

  return (
    <div className="home-flow">
      <CommandPanel
        label={<span>~/start-here.md</span>}
        tone="olive"
        className="intro-panel home-section section-intro"
        action={<span className="panel-counter">01 / 07</span>}
      >
        <div className="intro-layout">
          <div className="intro-copy">
            <p className="intro-kicker">{ui.home.introLabel}</p>
            <h1>{ui.home.introTitle}</h1>
            <div className="normal-only intro-paragraphs">
              {profile.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="recruiter-only intro-paragraphs recruiter-intro">
              <p>{profile.headline}</p>
              <p>{profile.availability}</p>
            </div>
            <div className="intro-actions">
              <LinkButton href="/game-lab" variant="primary">Enter Game Lab</LinkButton>
              <LinkButton href="/projects">View Projects</LinkButton>
              <LinkButton href={profile.links.cv} download event="cv_clicked">Download CV</LinkButton>
            </div>
          </div>
          <aside className="intro-status">
            <div className="status-screen">
              <span className="status-screen-label">PLAYER STATUS</span>
              <strong>{profile.currentStatus}</strong>
            </div>
            <div className="role-interest recruiter-only">
              <span>ROLE INTERESTS</span>
              <ul>{profile.roleInterests.map((role) => <li key={role}>{role}</li>)}</ul>
            </div>
            <p className="easter-hint normal-only">psst: press G when no field is focused</p>
          </aside>
        </div>
      </CommandPanel>

      <CommandPanel
        label={<span>whoami</span>}
        tone="orange"
        className="home-section section-about"
        action={<span className="panel-counter">02 / 07</span>}
      >
        <div className="about-layout">
          <PhotoSwap />
          <div className="about-copy">
            <SectionHeading
              command="whoami"
              title="A developer in the middle of becoming one on purpose."
              casualDescription="The short version, before I turn it into a side quest."
              recruiterDescription="Background, education, and current direction."
              copyable
            />
            {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <dl className="identity-facts">
              <div><dt>origin</dt><dd>{profile.origin}</dd></div>
              <div><dt>base</dt><dd>{profile.location}</dd></div>
              <div><dt>study</dt><dd>{profile.program}</dd></div>
            </dl>
          </div>
        </div>
      </CommandPanel>

      <CommandPanel
        label={<span>~/current-quest.json</span>}
        tone="blue"
        className="home-section section-quests"
        action={<span className="panel-counter">03 / 07</span>}
      >
        <SectionHeading
          command="cat ~/current-quest.json"
          title="Currently in the quest log"
          casualDescription="No fake percentages. Just what has my attention right now."
          recruiterDescription="Current learning priorities and active development areas."
          copyable
        />
        <div className="quest-grid">{quests.map((quest) => <QuestCard key={quest.marker} quest={quest} />)}</div>
      </CommandPanel>

      <CommandPanel
        label={<span>~/game-lab</span>}
        tone="olive"
        className="home-section section-game-lab"
        action={<Link href="/game-lab" className="panel-text-link">open all →</Link>}
      >
        <SectionHeading
          command="launch game-lab"
          title="Game Lab"
          casualDescription={ui.home.gameLabCasual}
          recruiterDescription={ui.home.gameLabDirect}
        />
        {featuredGame ? <GameCard project={featuredGame} /> : null}
      </CommandPanel>

      <CommandPanel
        label={<span>~/software-projects</span>}
        tone="orange"
        className="home-section section-software"
        action={<Link href="/projects" className="panel-text-link">open archive →</Link>}
      >
        <SectionHeading
          command="ls ./projects --featured"
          title="Software projects"
          casualDescription={ui.home.softwareCasual}
          recruiterDescription={ui.home.softwareDirect}
          copyable
        />
        <div className="project-grid">{featuredSoftware.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      </CommandPanel>

      <CommandPanel
        label={<span>~/experience.log</span>}
        tone="blue"
        className="home-section section-experience"
      >
        <SectionHeading
          command="tail experience.log"
          title="Experience"
          casualDescription="The verified timeline will live here—no imaginary companies in the meantime."
          recruiterDescription="Professional entries are hidden until verified details are added."
        />
        {visibleExperience.length ? null : (
          <EmptyState title="No verified experience entries yet">
            The data model and accessible photo gallery are ready. Add factual entries in src/content/experience.ts.
          </EmptyState>
        )}
      </CommandPanel>

      <CommandPanel
        label={<span>~/toolbox/quick-look</span>}
        tone="olive"
        className="home-section section-toolbox recruiter-priority"
      >
        <SectionHeading
          command="toolbox --current"
          title="Technologies, without the expert cosplay"
          casualDescription="A practical snapshot of what I use and what I’m learning."
          recruiterDescription="Current stack and active learning areas."
        />
        <div className="toolbox-preview">
          {toolboxGroups.slice(0, 3).map((group) => (
            <div key={group.title}><span>{group.marker}</span><h3>{group.title}</h3><p>{group.items.join(" · ")}</p></div>
          ))}
        </div>
        <LinkButton href="/toolbox" variant="quiet">Open full toolbox</LinkButton>
      </CommandPanel>

      <CommandPanel label={<span>~/side-quests</span>} tone="neutral" className="home-section section-side-quests normal-only">
        <SectionHeading command="find ./side-quests -maxdepth 1" title="Other tabs still open" casualDescription="Personal context, languages, and the things around the code." />
        <div className="side-quest-links">
          <Link href="/lore"><span>01</span><strong>Lore</strong><p>A save-file timeline with honest TODOs.</p></Link>
          <Link href="/lore#languages"><span>02</span><strong>Languages</strong><p>Five languages, proficiency labels awaiting confirmation.</p></Link>
          <Link href="/toolbox"><span>03</span><strong>Things I’m learning</strong><p>The active build queue, minus the logo cloud.</p></Link>
        </div>
      </CommandPanel>

      <CommandPanel label={<span>~/contact.txt</span>} tone="orange" className="home-section section-contact">
        <div className="contact-strip">
          <div><span>READY FOR CO-OP?</span><h2>{profile.contactPrompt}</h2><p>{profile.availability}</p></div>
          <div className="contact-actions">
            <LinkButton href={profile.links.linkedin} variant="primary">LinkedIn</LinkButton>
            <LinkButton href={profile.links.github}>GitHub</LinkButton>
            <LinkButton href={profile.links.cv} download event="cv_clicked">CV</LinkButton>
          </div>
        </div>
      </CommandPanel>
    </div>
  );
}
