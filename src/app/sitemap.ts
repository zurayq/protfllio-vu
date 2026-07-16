import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { projectHref } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/game-lab", "/lore", "/toolbox", "/contact"];
  return [
    ...staticRoutes.map((route) => ({
      url: profile.siteUrl + route,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...projects.map((project) => ({
      url: profile.siteUrl + projectHref(project),
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
  ];
}
