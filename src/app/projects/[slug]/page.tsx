import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/projects/project-detail";
import { softwareProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { getAdjacentProjects, getProject } from "@/lib/projects";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return softwareProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug, "software");
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: "/projects/" + project.slug },
    openGraph: {
      title: project.title + " — " + profile.name,
      description: project.summary,
      url: profile.siteUrl + "/projects/" + project.slug,
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
  };
}

export default async function SoftwareProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug, "software");
  if (!project) notFound();
  const adjacent = getAdjacentProjects(project);
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    author: { "@type": "Person", name: profile.name, url: profile.siteUrl },
    codeRepository: project.sourceUrl ?? undefined,
    programmingLanguage: project.stack,
    url: profile.siteUrl + "/projects/" + project.slug,
  };
  return (
    <>
      <ProjectDetail project={project} {...adjacent} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
