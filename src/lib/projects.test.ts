import { describe, expect, it } from "vitest";

import { getAdjacentProjects, getProject, projectHref } from "./projects";

describe("project utilities", () => {
  it("finds projects inside the requested category", () => {
    expect(getProject("imposter", "game")?.title).toBe("Imposter");
    expect(getProject("imposter", "software")).toBeUndefined();
  });

  it("builds category-aware routes", () => {
    const game = getProject("imposter", "game");
    const software = getProject("cv-bro", "software");
    expect(game && projectHref(game)).toBe("/game-lab/imposter");
    expect(software && projectHref(software)).toBe("/projects/cv-bro");
  });

  it("keeps adjacent navigation within a category", () => {
    const project = getProject("cv-bro", "software");
    if (!project) throw new Error("Fixture missing");
    const adjacent = getAdjacentProjects(project);
    expect(adjacent.previous).toBeUndefined();
    expect(adjacent.next?.slug).toBe("portfolio-analytics");
  });
});
