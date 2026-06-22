import Link from "next/link";
import { getStepIcon } from "@/app/lib/careers-icons";
import type { SiteContent } from "@/app/lib/getContent";

type HiringProcessContent = NonNullable<SiteContent["careersPage"]>["hiringProcess"];

interface HiringProcessProps {
  content?: HiringProcessContent;
}

const DEFAULT_CONTENT: HiringProcessContent = {
  heading: "OUR HIRING PROCESS",
  steps: [
    { number: 1, title: "STEP 1", subtitle: "Application Submission", icon: "application" },
    { number: 2, title: "STEP 2", subtitle: "Resume Review", icon: "review" },
    { number: 3, title: "STEP 3", subtitle: "Technical Evaluation", icon: "technical" },
    { number: 4, title: "STEP 4", subtitle: "Interview Process", icon: "interview" },
    { number: 5, title: "STEP 5", subtitle: "Offer & Documentation", icon: "offer" },
    { number: 6, title: "STEP 6", subtitle: "Welcome to Galler", icon: "welcome" },
  ],
  contactBanner: {
    heading: "HAVE QUESTIONS?",
    description: "Reach out to our recruitment team.",
    email: "careers@gallerindia.com",
    phone: "+91 120 456 7890",
    buttonText: "CONTACT RECRUITMENT TEAM",
  },
};

export default function HiringProcess({ content }: HiringProcessProps) {
  const section = { ...DEFAULT_CONTENT, ...content };
  const steps = section.steps?.length ? section.steps : DEFAULT_CONTENT.steps;
  const banner = { ...DEFAULT_CONTENT.contactBanner, ...section.contactBanner };

  return (
    <section className="bg-[#f8f9fa] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center font-serif text-2xl tracking-[0.1em] text-[#0b1f4a] sm:text-3xl">
          {section.heading}
        </h2>
        <div className="mx-auto mt-3 h-0.5 w-16 bg-[#c9a227]" />

        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-12 hidden h-0.5 border-t-2 border-dashed border-[#c9a227] lg:block" />

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {steps.map((step, index) => (
              <div key={step.number || index} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#0b1f4a] text-white shadow-lg">
                  {getStepIcon(step.icon, index)}
                </div>
                <p className="mt-4 text-xs font-bold tracking-wider text-[#0b1f4a]">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#4a4a4a]">{step.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-10">
        <div className="rounded-lg bg-[#0b1f4a] px-8 py-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-wider">{banner.heading}</h3>
            <p className="mt-1 text-sm">{banner.description}</p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-6 sm:mt-0">
            <a
              href={`mailto:${banner.email}`}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#c9a227]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" strokeLinecap="round" />
              </svg>
              {banner.email}
            </a>
            <a
              href={`tel:${banner.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#c9a227]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {banner.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-[#c9a227] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a8871f]"
            >
              {banner.buttonText}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
