import GoldAccentLine from "../common/GoldAccentLine";
import { getBenefitIcon } from "@/app/lib/careers-icons";
import type { SiteContent } from "@/app/lib/getContent";

type WhyWorkContent = NonNullable<SiteContent["careersPage"]>["whyWork"];

interface WhyWorkAtGallerProps {
  content?: WhyWorkContent;
}

const DEFAULT_CONTENT: WhyWorkContent = {
  heading: "WHY WORK AT GALLER?",
  benefits: [
    {
      title: "MEANINGFUL WORK",
      description: "Work on products and solutions used by leading organizations.",
      icon: "meaningful",
    },
    {
      title: "LEARN & GROW",
      description: "Learn from experienced engineers and industry experts.",
      icon: "learn",
    },
    {
      title: "DIVERSE EXPOSURE",
      description: "Exposure to multiple industries and cutting-edge technologies.",
      icon: "diverse",
    },
    {
      title: "OWNERSHIP",
      description: "Take responsibility, drive innovation and see your ideas grow.",
      icon: "ownership",
    },
    {
      title: "CONTINUOUS GROWTH",
      description: "Opportunities to build expertise and advance your career.",
      icon: "growth",
    },
    {
      title: "LONG-TERM CAREER",
      description: "A place to build a career with purpose and stability.",
      icon: "career",
    },
  ],
};

export default function WhyWorkAtGaller({ content }: WhyWorkAtGallerProps) {
  const section = { ...DEFAULT_CONTENT, ...content };
  const benefits = section.benefits?.length ? section.benefits : DEFAULT_CONTENT.benefits;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center font-serif text-2xl tracking-[0.1em] text-[#0b1f4a] sm:text-3xl">
          {section.heading}
        </h2>
        <div className="mx-auto mt-4 flex justify-center">
          <GoldAccentLine />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {benefits.map((benefit, index) => (
            <div
              key={`${benefit.title}-${index}`}
              className={`text-center ${
                index < benefits.length - 1 ? "border-b border-[#e5e5e5] pb-8 sm:border-b-0 sm:pb-0" : ""
              } ${index % 3 !== 2 ? "lg:border-r lg:border-[#e5e5e5] lg:pr-10" : ""}`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center text-[#c9a227]">
                {getBenefitIcon(benefit.icon, index)}
              </div>
              <h3 className="mt-5 text-sm font-bold tracking-wider text-[#0b1f4a]">{benefit.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#4a4a4a]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
