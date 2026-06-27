import { API_URL } from "@/app/lib/apiUrl";
import type { SiteContent } from "@/app/lib/getContent";
import Navbar from "@/app/components/common/Navbar";
import Footer from "@/app/components/common/Footer";
import ProjectsIndustryHero from "@/app/components/projects/ProjectsIndustryHero";
import ProjectCard from "./ProjectCard";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getContentFromAPI(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`${API_URL}/api/content`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function ProjectIndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getContentFromAPI();
  const projectsPage = content?.projectsPage;

  const industries = projectsPage?.industries ?? [];
  const industry = industries.find(
    (i: { id: string; slug?: string; name: string }) =>
      (i.slug || i.name.toLowerCase().replace(/\s+/g, "-")) === slug
  );

  if (!industry) {
    notFound();
  }

  const projects = industry.projects ?? [];

  return (
    <>
      <Navbar activePage="our projects" />
      <main className="min-h-screen">
        <ProjectsIndustryHero name={industry.name} backgroundImage={industry.image} />

        <section className="bg-gray-50 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            {projects.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <p className="font-century text-[15px] text-gray-400">
                  No projects added for this industry yet
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map(
                  (
                    project: {
                      id: string;
                      name: string;
                      description?: string;
                      features?: string[];
                      image?: string;
                    },
                    index: number
                  ) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer content={content?.footer} />
    </>
  );
}
