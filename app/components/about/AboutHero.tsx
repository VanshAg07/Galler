import Link from "next/link";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";

interface AboutHeroProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
}

const DEFAULT_DESCRIPTION =
  "A global provider of software, product engineering, electronics manufacturing services and solutions. We work with global customers in various technology domains including 5G, datacenter, networking & Wi-Fi, vision, automotive, IoT, cloud & apps.";

export default function AboutHero({
  title = "ABOUT US",
  description = DEFAULT_DESCRIPTION,
  backgroundImage,
  backgroundVideo = "/videos/home-video.mp4",
}: AboutHeroProps) {
  const imageSrc = backgroundImage ? resolveUploadSrc(backgroundImage) : undefined;
  const videoSrc = resolveUploadSrc(backgroundVideo);

  return (
    <section className="relative mt-20 overflow-hidden lg:min-h-[85vh]">
      <div className="absolute inset-0 z-0">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover object-[center_30%] lg:object-center"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover object-[center_30%] lg:object-center"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a3d3d]/80 via-[#0d1f4a]/75 to-[#0a1a3a]/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12 lg:flex lg:min-h-[85vh] lg:flex-col lg:px-10">
        <div className="lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:pb-16 lg:max-w-2xl">
          <span className="mb-5 inline-block h-1 w-14 bg-white sm:mb-6" aria-hidden />
          <h1 className="text-3xl font-bold tracking-wide text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-5 text-xs leading-[1.75] tracking-[0.08em] text-white/90 uppercase sm:mt-8 sm:text-sm sm:leading-[1.9] md:text-[0.95rem]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
