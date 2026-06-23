import { getContent } from "../lib/getContent";
import { resolveUploadSrc } from "../lib/resolveUploadSrc";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Projects — Galler Engineering",
  description: "Explore our successfully implemented projects across industries",
};

export default function ProjectsPage() {
  const content = getContent();
  const projectsPage = content?.projectsPage;

  const industries = projectsPage?.industries ?? [];
  const heroBackground = projectsPage?.hero?.backgroundImage
    ? resolveUploadSrc(projectsPage.hero.backgroundImage)
    : "";

  return (
    <>
      <Navbar activePage="our projects" />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative mt-20 flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#051c2c] via-[#0a3e65] to-[#051c2c] px-6 py-20">
          {heroBackground ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroBackground})` }}
              />
              <div className="absolute inset-0 bg-black/50" />
            </>
          ) : (
            <div className="absolute inset-0 bg-black/30" />
          )}

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="font-cinzel mb-6 text-4xl font-bold uppercase tracking-wide text-white md:text-5xl lg:text-6xl">
              {projectsPage?.hero?.heading ?? "OUR PROJECTS"}
            </h1>
            <p className="font-century mb-8 text-base text-gray-300 md:text-lg">
              {projectsPage?.hero?.subtitle ??
                "Select an industry below to explore our successfully implemented projects"}
            </p>
            <Link
              href="/about"
              className="inline-block rounded-full border-2 border-white bg-transparent px-8 py-3 font-medium text-white transition-all hover:bg-white hover:text-[#051c2c]"
            >
              {projectsPage?.hero?.ctaText ?? "START A PROJECT"}
            </Link>
          </div>
        </section>

        {/* Industries Grid */}
        <section className="bg-gray-50 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            {/* <div className="mb-8 text-center">
              <p className="font-century text-gray-600">Home &gt; Industries</p>
            </div> */}

            {industries.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <p className="text-gray-400">No industries added yet</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {industries.map(
                  (industry: {
                    id: string;
                    slug?: string;
                    name: string;
                    icon?: string;
                    image?: string;
                  }) => {
                    const slug =
                      industry.slug || industry.name.toLowerCase().replace(/\s+/g, "-");
                    const cardImage = industry.image
                      ? resolveUploadSrc(industry.image)
                      : "";

                    return (
                      <Link
                        key={industry.id}
                        href={`/projects/${slug}`}
                        className="group relative flex min-h-[220px] overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-primary hover:shadow-lg md:min-h-[260px]"
                      >
                        {cardImage ? (
                          <>
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                              style={{ backgroundImage: `url(${cardImage})` }}
                            />
                            <div className="absolute inset-0 bg-white/75 transition-colors group-hover:bg-white/65" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
                        )}

                        <div className="relative z-10 flex h-full w-full flex-col justify-end">
                          {industry.icon ? (
                            <div className="mb-auto flex h-14 w-14 items-center justify-center rounded-lg bg-white/80 shadow-sm">
                              <img
                                src={resolveUploadSrc(industry.icon)}
                                alt=""
                                className="h-9 w-9 object-contain"
                              />
                            </div>
                          ) : null}
                          <div>
                            <h3 className="font-cinzel text-xl font-bold uppercase tracking-wide text-gray-900 transition-colors group-hover:text-primary md:text-2xl">
                              {industry.name}
                            </h3>
                            <span className="mt-2 block h-0.5 w-12 bg-primary" />
                          </div>
                        </div>
                      </Link>
                    );
                  }
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
