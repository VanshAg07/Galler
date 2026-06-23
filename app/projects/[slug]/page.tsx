import { getContent } from "@/app/lib/getContent";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";
import Navbar from "@/app/components/common/Navbar";
import Footer from "@/app/components/common/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectCard from "./ProjectCard";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectIndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getContent();
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
  const heroBackground = industry.image ? resolveUploadSrc(industry.image) : "";

  return (
    <>
      <Navbar activePage="our projects" />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative mt-20 flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#051c2c] via-[#0a3e65] to-[#051c2c] px-6 py-20 md:min-h-[75vh] lg:min-h-[75vh]">
          {heroBackground ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroBackground})` }}
              />
              <div className="absolute inset-0 bg-black/60" />
            </>
          ) : (
            <div className="absolute inset-0 bg-black/30" />
          )}
          
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="font-cinzel text-4xl font-bold uppercase tracking-wide text-white md:text-5xl lg:text-6xl">
              {industry.name}
            </h1>
          </div>
        </section>

        {/* Breadcrumb */}
        {/* <section className="bg-white px-6 py-4">
          <div className="mx-auto max-w-7xl">
            <p className="font-century text-sm text-gray-600">
              <Link href="/" className="hover:text-primary">Home</Link>
              {" > "}
              <Link href="/projects" className="hover:text-primary">Projects</Link>
            </p>
          </div>
        </section> */}

        {/* Projects Grid */}
        <section className="bg-gray-50 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            {projects.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <p className="text-gray-400">No projects added for this industry yet</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project: { id: string; name: string; description?: string; features?: string[]; image?: string }) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer content={content?.footer} />
    </>
  );
}
