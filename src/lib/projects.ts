import { projects } from "../content/projects";
import type { Project, ProjectCategory } from "../types/content";

export function getProject(slug: string, category?: ProjectCategory) {
  return projects.find(
    (project) => project.slug === slug && (!category || project.category === category),
  );
}

export function getAdjacentProjects(project: Project) {
  const siblings = projects.filter((item) => item.category === project.category);
  const index = siblings.findIndex((item) => item.slug === project.slug);

  return {
    previous: index > 0 ? siblings[index - 1] : undefined,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined,
  };
}

export function projectHref(project: Project) {
  return project.category === "game"
    ? "/game-lab/" + project.slug
    : "/projects/" + project.slug;
}
