import { getContent } from "./lib/getContent";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import HeroSection from "./components/home/HeroSection";
import AboutSection from "./components/home/AboutSection";
import OurServicesSection from "./components/home/OurServicesSection";
import IndustriesSection from "./components/home/IndustriesSection";
import LogoMarquee from "./components/home/LogoMarquee";

// Re-read content.json on every request so admin changes appear immediately
export const dynamic = "force-dynamic";

export default function Home() {
  const content = getContent();

  return (
    <>
      <Navbar activePage="home" />
      <main>
        <HeroSection content={content?.hero} />
        <AboutSection content={content?.about} />
        <OurServicesSection content={content?.homeServices} />
        <IndustriesSection content={content?.homeIndustries} />
      </main>
      <LogoMarquee content={content?.marquee} />
      <Footer content={content?.footer} />
    </>
  );
}
