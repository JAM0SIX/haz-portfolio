import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProjectById,
  PROJECTS,
} from "@/components/PortfolioDial/projects";
import ProjectDetailTemplate from "@/components/ProjectDetail/ProjectDetailTemplate";
import Footer from "@/components/sections/Footer/Footer";

type Props = { params: Promise<{ projectId: string }> };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ projectId: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;
  const project = getProjectById(projectId);
  if (!project) return { title: "Project · Haz." };
  return { title: `${project.title} · Haz.` };
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params;
  const project = getProjectById(projectId);
  if (!project) notFound();

  return (
    <>
      <ProjectDetailTemplate project={project} />
      <Footer />
    </>
  );
}
