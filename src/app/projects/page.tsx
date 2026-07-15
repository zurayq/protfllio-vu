import type { Metadata } from "next";

import { CommandPanel } from "@/components/panels/command-panel";
import { SectionHeading } from "@/components/panels/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { softwareProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Software Projects",
  description: "Selected software, automation, backend, and creative-development projects by Abdulwahid Zurayq.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="page-stack">
      <header className="page-hero">
        <span>PROJECT ARCHIVE · SOFTWARE</span>
        <h1>Useful things built from very specific problems.</h1>
        <p>A selected set—not every tutorial, assignment, or folder called final-final-v2.</p>
      </header>
      <CommandPanel label={<span>ls ~/projects</span>} tone="orange">
        <SectionHeading
          command="ls ~/projects --selected"
          title={softwareProjects.length + " project files"}
          casualDescription="Each case file separates what exists from what is still planned."
          copyable
        />
        <div className="project-grid project-grid-archive">
          {softwareProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
        </div>
      </CommandPanel>
    </div>
  );
}
