import type { Metadata } from "next";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import CareersHero from "../components/careers/CareersHero";
import WhyWorkAtGaller from "../components/careers/WhyWorkAtGaller";
import LifeAtGaller from "../components/careers/LifeAtGaller";
import CurrentOpenings from "../components/careers/CurrentOpenings";
import HiringProcess from "../components/careers/HiringProcess";
import { getContent, getCareersJobs } from "../lib/getContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers — Galler Engineering",
  description:
    "Join Galler India and work on innovative solutions that power industries. Explore career opportunities in engineering, sales, manufacturing, and more.",
};

export default function CareersPage() {
  const content = getContent();
  const jobs = getCareersJobs();
  const careers = content?.careersPage;

  return (
    <>
      <Navbar activePage="careers" />
      <main className="min-h-screen bg-white">
        <CareersHero content={careers?.hero} />
        <WhyWorkAtGaller content={careers?.whyWork} />
        <LifeAtGaller content={careers?.lifeAtGaller} />
        <CurrentOpenings initialJobs={jobs} sidebarContent={careers?.openingsSidebar} />
        <HiringProcess content={careers?.hiringProcess} />
      </main>
      <Footer content={content?.footer} />
    </>
  );
}
