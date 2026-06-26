import { getContent } from "../lib/getContent";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectsIndustriesGrid from "../components/projects/ProjectsIndustriesGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Projects — Galler Engineering",
  description: "Explore our successfully implemented projects across industries",
};

export default function ProjectsPage() {
  const content = getContent();
  const projectsPage = content?.projectsPage;

  const industries = projectsPage?.industries ?? [];

  return (
    <>
      <Navbar activePage="our projects" />
      <main className="min-h-screen">
        <ProjectsHero
          heading={projectsPage?.hero?.heading}
          subtitle={projectsPage?.hero?.subtitle}
          ctaText={projectsPage?.hero?.ctaText}
          backgroundImage={projectsPage?.hero?.backgroundImage}
        />
        <ProjectsIndustriesGrid industries={industries} />
      </main>
      <Footer content={content?.footer} />
    </>
  );
}
