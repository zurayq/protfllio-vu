import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/projects/project-detail";
import { gameProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { getAdjacentProjects, getProject } from "@/lib/projects";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return gameProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug, "game");
  if (!project) return {};
  return {
    title: project.title + " · Game Lab",
    description: project.summary,
    alternates: { canonical: "/game-lab/" + project.slug },
    openGraph: {
      title: project.title + " — Game Lab by " + profile.name,
      description: project.summary,
      url: profile.siteUrl + "/game-lab/" + project.slug,
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
  };
}

export default async function GameProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug, "game");
  if (!project) notFound();
  const adjacent = getAdjacentProjects(project);
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: project.title,
    description: project.summary,
    author: { "@type": "Person", name: profile.name, url: profile.siteUrl },
    gamePlatform: "Mobile web",
    applicationCategory: "Game",
    url: profile.siteUrl + "/game-lab/" + project.slug,
  };
  return (
    <>
      <ProjectDetail project={project} {...adjacent} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
