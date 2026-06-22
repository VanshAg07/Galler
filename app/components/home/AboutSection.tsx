import Link from "next/link";
import CountUpNumber from "@/app/components/common/CountUpNumber";
import type { SiteContent } from "@/app/lib/getContent";

type Props = { content?: SiteContent["about"] };

const DEFAULTS: SiteContent["about"] = {
  title: "ABOUT US",
  paragraph1:
    "Galler is India's leading industrial solution provider in the field of Electronics and Software. Founded in 1995, At present, it has more than 450 employees and more than 4 subsidiaries with business covering PAN India.",
  paragraph2:
    "The company focuses on the design, research and development, production of mechanical & Electro - mechanical Smart devices. It is one of the enterprises in India that focuses on the R&D of industrial electronics products. Rooted in care technology and focused on innovative applications in the industry, Galler provides customized solutions in retail, finance, petroleum, manufacturing, transportation and other industries.",
  stats: [
    { value: "200+", label: "Team Members" },
    { value: "100K", label: "Devices Deployed" },
    { value: "12+", label: "Happy Clients" },
    { value: "10+", label: "Industries Worked" },
  ],
  ctaText: "KNOW MORE",
};

function SideDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M60 20v360M20 80h80M20 200h80M20 320h80"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <circle cx="60" cy="80" r="4" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="200" r="4" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="320" r="4" fill="currentColor" opacity="0.5" />
      <rect x="35" y="130" width="50" height="30" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <rect x="35" y="250" width="50" height="30" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <path d="M10 140h20M90 140h20M10 260h20M90 260h20" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

export default function AboutSection({ content }: Props) {
  const c = { ...DEFAULTS, ...content, stats: content?.stats ?? DEFAULTS.stats };

  return (
    <section id="about" className="relative overflow-hidden bg-[#f5f5f5] py-16 sm:py-20 md:py-24 lg:py-28">
      <SideDecoration className="pointer-events-none absolute top-1/2 left-0 hidden h-[min(420px,70%)] w-16 -translate-y-1/2 text-[#b8d4e8] lg:block xl:w-24" />
      <SideDecoration className="pointer-events-none absolute top-1/2 right-0 hidden h-[min(420px,70%)] w-16 -translate-y-1/2 scale-x-[-1] text-[#b8d4e8] lg:block xl:w-24" />

      <div className="relative mx-auto max-w-4xl px-6 sm:px-8">
        <h2 className="text-center font-serif text-3xl tracking-wide text-[#1a1a1a] sm:text-4xl md:text-[2.75rem]">
          {c.title}
        </h2>

        <div className="mt-8 space-y-6 text-center sm:mt-10 md:mt-12">
          <p className="text-sm leading-relaxed text-[#333] sm:text-base md:text-[1.05rem] md:leading-7">
            {c.paragraph1}
          </p>
          <p className="text-sm leading-relaxed text-[#333] sm:text-base md:text-[1.05rem] md:leading-7">
            {c.paragraph2}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-14 sm:gap-x-8 md:mt-16 md:grid-cols-4 md:gap-y-0">
          {c.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <CountUpNumber
                value={stat.value}
                className="text-4xl font-light text-[#6ec4e8] sm:text-5xl md:text-[3.25rem] md:leading-none"
              />
              <p className="mt-2 text-sm text-[#1a1a1a] sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center sm:mt-14 md:mt-16">
          <Link
            href="/about"
            className="inline-flex min-w-[160px] items-center justify-center border border-[#6ec4e8] px-10 py-3 text-sm font-medium tracking-wide text-[#1a1a1a] transition-colors hover:bg-[#6ec4e8]/10 sm:text-base"
          >
            {c.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
