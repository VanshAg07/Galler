import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";
import GoldAccentLine from "./GoldAccentLine";

interface ContactHeroProps {
  heading?: string;
  description?: string;
  backgroundImage?: string;
}

const DEFAULT_DESCRIPTION =
  "We are here to help. Whether you have a question about our products, need a technical consultation, or want to explore a partnership, our team is ready to assist you.";

export default function ContactHero({
  heading = "CONTACT US",
  description = DEFAULT_DESCRIPTION,
  backgroundImage,
}: ContactHeroProps) {
  const imageSrc = backgroundImage ? resolveUploadSrc(backgroundImage) : undefined;

  return (
    <section className="relative mt-20 min-h-[55vh] overflow-hidden lg:min-h-[70vh]">
      <div className="absolute inset-0">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[55vh] max-w-7xl flex-col justify-center px-6 py-12 sm:px-10 lg:min-h-[70vh] lg:px-16 lg:py-16">
        <h1 className="font-serif text-3xl tracking-[0.12em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:text-4xl">
          {heading}
        </h1>
        <GoldAccentLine className="mt-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-[0.95rem]">
          {description}
        </p>
      </div>
    </section>
  );
}
