import type { SiteContent } from "@/app/lib/getContent";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";
import Button from "../common/Button";

const DEFAULT_HERO_VIDEO = "/videos/home-video.mp4";

type Props = { content?: SiteContent["hero"] };

const DEFAULTS: SiteContent["hero"] = {
  title: "AN END-TO-END ENGINEERING SOLUTIONS COMPANY",
  since: "SINCE — 1995",
  description:
    "We deliver end-to-end manufacturing solutions — from precision machining and metal fabrication to injection molding and full-scale assembly — helping businesses turn complex engineering challenges into production-ready realities.",
  ctaText: "Explore our capabilities",
  location: "Gurugram, India",
};

export default function HeroSection({ content }: Props) {
  const c = { ...DEFAULTS, ...content };
  const videoSrc = resolveUploadSrc(c.videoUrl || DEFAULT_HERO_VIDEO);

  return (
    <section className="relative mt-20 min-h-[calc(100dvh-5rem)] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-center"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 sm:py-10 md:py-12 lg:px-8">
        <div className="flex flex-1 flex-col justify-center gap-8 sm:gap-10 md:gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 xl:gap-20">
          {/* Headline */}
          <div className="w-full lg:max-w-[55%]">
            <h1 className="text-[clamp(1.75rem,5vw,4.5rem)] leading-[1.08] font-extrabold tracking-tight text-white whitespace-pre-line">
              {c.title}
            </h1>
          </div>

          {/* Description */}
          <div className="flex w-full flex-col gap-4 sm:gap-5 md:gap-6 lg:max-w-md lg:shrink-0">
            <p className="font-mono text-[0.65rem] tracking-widest text-white/60 uppercase sm:text-xs">
              // {c.since} //
            </p>
            <p className="text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
              {c.description}
            </p>
            <Button href="/#services" className="w-full justify-center sm:w-auto">
              {c.ctaText}
            </Button>
          </div>
        </div>

        {/* Location */}
        <p className="mt-8 shrink-0 text-xs text-white/70 sm:mt-10 sm:text-sm md:mt-12">
          <span className="font-medium text-white/90">Based in:</span> {c.location}
        </p>
      </div>
    </section>
  );
}
