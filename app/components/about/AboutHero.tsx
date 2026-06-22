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
    <section className="relative mt-20 min-h-[70vh] overflow-hidden lg:min-h-[85vh]">
      <div className="absolute inset-0 z-0">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover object-center"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a3d3d]/80 via-[#0d1f4a]/75 to-[#0a1a3a]/70" />
      </div>

      <svg
        className="pointer-events-none absolute right-0 top-1/2 z-[1] hidden h-[70%] w-auto -translate-y-1/2 opacity-80 lg:block"
        viewBox="0 0 400 600"
        fill="none"
        aria-hidden
      >
        <path
          d="M380 580 L120 320 L280 160 L40 40"
          stroke="#4dd9f0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#about-glow)"
        />
        <defs>
          <filter id="about-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col px-6 py-10 sm:px-8 lg:min-h-[85vh] lg:px-10">
        <nav className="text-sm text-white/75">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">About Us</span>
        </nav>

        <div className="flex flex-1 flex-col justify-center pb-8 pt-12 lg:max-w-2xl lg:pb-16">
          <span className="mb-6 inline-block h-1 w-14 bg-white" aria-hidden />
          <h1 className="text-4xl font-bold tracking-wide text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-8 text-xs leading-[1.9] tracking-[0.08em] text-white/90 uppercase sm:text-sm md:text-[0.95rem]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
