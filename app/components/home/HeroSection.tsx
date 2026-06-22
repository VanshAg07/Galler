import type { SiteContent } from "@/app/lib/getContent";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";

const DEFAULT_HERO_VIDEO = "/videos/home-video.mp4";

type Props = { content?: SiteContent["hero"] };

const DEFAULT_TITLE = "AN END-TO-END ENGINEERING\nSOLUTIONS COMPANY";

export default function HeroSection({ content }: Props) {
  const title = content?.title?.trim() || DEFAULT_TITLE;
  const videoSrc = resolveUploadSrc(content?.videoUrl || DEFAULT_HERO_VIDEO);

  return (
    <section className="relative mt-20 min-h-[55dvh] overflow-hidden md:min-h-[65dvh] lg:min-h-[calc(100dvh-5rem)]">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-[center_35%] lg:object-center"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[55dvh] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16 md:min-h-[65dvh] lg:min-h-[calc(100dvh-5rem)] lg:px-8 lg:py-16">
        <h1 className="max-w-4xl font-cinzel text-[24px] leading-[1.08] font-normal tracking-tight text-white whitespace-pre-line md:text-[40px]">
          {title}
        </h1>
      </div>
    </section>
  );
}
