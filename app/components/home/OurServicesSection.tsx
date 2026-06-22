import type { SiteContent } from "@/app/lib/getContent";

type ServiceCategory = {
  id: string;
  number: number;
  title: string;
  icon: "design" | "manufacturing" | "lifecycle";
  items: string[];
};

type Props = { content?: SiteContent["homeServices"] };

const DEFAULTS: NonNullable<SiteContent["homeServices"]> = {
  tagline: "WHAT WE DO",
  title: "OUR SERVICES",
  subtitle:
    "IOT-ENABLED INTEGRATED ELECTRONICS MANUFACTURING WITH END-TO-END CAPABILITIES ACROSS THE ESDM SPECTRUM",
  categories: [
    {
      id: "design",
      number: 1,
      title: "DESIGN",
      icon: "design",
      items: [
        "Concept to Design Proposal",
        "Hardware, Embedded & Mechanical Design",
        "Digital Engineering with IoT Solutions",
        "DFM / DFT / DFS & Reliability Tests",
        "Proof of Concept & Proto Build",
      ],
    },
    {
      id: "manufacturing",
      number: 2,
      title: "MANUFACTURING",
      icon: "manufacturing",
      items: [
        "Test Fixture & Functional Tester Development",
        "Pilot Build & Ramp Up",
        "OEM Turnkey Manufacturing — PCBA",
        "OEM Turnkey Manufacturing — Box Build",
        "Value Engineering & Part Localization",
      ],
    },
    {
      id: "lifecycle",
      number: 3,
      title: "LIFECYCLE SUPPORT",
      icon: "lifecycle",
      items: [
        "Obsolescence Management",
        "Repair & Refurbish",
        "Product Maintenance",
        "Spare Parts Management incl. Last Time Buy",
        "Post Warranty Servicing",
      ],
    },
  ],
};

function CategoryIcon({ icon }: { icon: ServiceCategory["icon"] }) {
  const props = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (icon === "design") {
    return (
      <svg {...props}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    );
  }

  if (icon === "manufacturing") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

function ServiceItem({ index, label }: { index: number; label: string }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex w-14 shrink-0 items-center justify-center border-r border-gray-200 bg-[#fafafa] text-sm font-bold text-primary sm:w-16">
        {num}
      </div>
      <p className="flex items-center px-4 py-3.5 font-century text-[18px] leading-snug text-[#1a1a1a] sm:px-5">
        {label}
      </p>
    </div>
  );
}

function CategoryColumn({ category }: { category: ServiceCategory }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-navy shadow-sm">
          <CategoryIcon icon={category.icon} />
        </div>
        <span className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {category.number}
        </span>
      </div>

      <h3 className="mb-6 text-center font-cinzel text-[30px] font-normal leading-[1.08] tracking-tight text-[#1a1a1a]">
        {category.title}
      </h3>

      <div className="flex w-full flex-col gap-3">
        {category.items.map((item, index) => (
          <ServiceItem key={`${category.id}-${index}`} index={index} label={item} />
        ))}
      </div>
    </div>
  );
}

export default function OurServicesSection({ content }: Props) {
  const c = {
    ...DEFAULTS,
    ...content,
    categories: content?.categories?.length ? content.categories : DEFAULTS.categories,
  };

  return (
    <section id="services" className="bg-[#f6f6f6] py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto mb-14 max-w-4xl text-center sm:mb-16 md:mb-20">
          <p className="font-mono text-xs tracking-[0.25em] text-gray-500 uppercase sm:text-sm">
            — {c.tagline} —
          </p>
          <h2 className="mt-4 font-cinzel text-[24px] font-normal leading-[1.08] tracking-tight text-[#000000] md:text-[40px]">
            {c.title}
          </h2>
          <p className="mt-5 font-century text-[18px] leading-relaxed text-gray-600">
            {c.subtitle}
          </p>
        </header>

        <div className="relative">
          <div
            className="pointer-events-none absolute top-12 right-[16.67%] left-[16.67%] hidden h-px bg-gray-200 lg:block"
            aria-hidden
          />

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-3 lg:gap-10 xl:gap-12">
            {c.categories.map((category) => (
              <CategoryColumn key={category.id} category={category as ServiceCategory} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
