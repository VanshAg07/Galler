import type { SiteContent } from "@/app/lib/getContent";
import { DEFAULT_MARQUEE_LOGOS } from "@/app/lib/marquee-config";
import MarqueeTrack from "./MarqueeTrack";

type Props = { content?: SiteContent["marquee"]; heading?: string };

export default function LogoMarquee({ content, heading = "OUR CLIENTS" }: Props) {
  const logos = content?.logos?.filter((logo) => logo.src) ?? DEFAULT_MARQUEE_LOGOS;
  if (logos.length === 0) return null;

  return (
    <section aria-label="Partner logos" className="bg-white py-14 sm:py-16">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <h2 className="mb-10 text-center font-serif text-3xl tracking-[0.15em] text-[#1a1a1a] sm:mb-12 sm:text-4xl">
          {heading}
        </h2>
        <MarqueeTrack logos={logos} />
      </div>
    </section>
  );
}
