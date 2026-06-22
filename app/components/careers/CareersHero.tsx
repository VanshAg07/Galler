"use client";

import Link from "next/link";
import { useState } from "react";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";
import type { SiteContent } from "@/app/lib/getContent";
import SubmitResumeModal from "./SubmitResumeModal";

type CareersHeroContent = NonNullable<SiteContent["careersPage"]>["hero"];

interface CareersHeroProps {
  content?: CareersHeroContent;
}

const DEFAULT_CONTENT: CareersHeroContent = {
  headingLine1: "BUILD PRODUCTS.",
  headingLine2: "SOLVE REAL PROBLEMS.",
  headingLine3: "CREATE IMPACT.",
  description:
    "At Galler, we engineer innovative solutions that power industries across Telecom, Petroleum, Defense, Automotive, Industrial Automation, Energy and Emerging Technologies.",
  viewPositionsText: "VIEW OPEN POSITIONS",
  submitResumeText: "SUBMIT YOUR RESUME",
  image: "",
};

export default function CareersHero({ content }: CareersHeroProps) {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const hero = { ...DEFAULT_CONTENT, ...content };
  const imageSrc = hero.image ? resolveUploadSrc(hero.image) : undefined;

  return (
    <>
      <section className="relative mt-20 min-h-[480px] overflow-hidden bg-[#f8f9fa] lg:min-h-[520px]">
        {/* Image — flush to right viewport edge on desktop */}
        <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
          {imageSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt="" className="h-full w-full object-cover object-center" />
              <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#f8f9fa] via-[#f8f9fa]/70 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#f8f9fa] via-[#f8f9fa]/70 to-transparent" />
              <svg
                width="200"
                height="200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-[#0b1f4a]/20"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl items-center px-6 py-12 lg:min-h-[520px] lg:px-5 lg:py-16">
          <div className="max-w-xl lg:w-[46%] lg:max-w-none lg:pr-8">
            <h1 className="font-serif text-3xl tracking-[0.12em] text-[#0b1f4a] sm:text-4xl">
              {hero.headingLine1}
              <br />
              {hero.headingLine2}
              <br />
              {hero.headingLine3}
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-[#4a4a4a] sm:text-[0.95rem]">
              {hero.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#openings"
                className="inline-flex items-center gap-2 rounded-md bg-[#0b1f4a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0a1840]"
              >
                {hero.viewPositionsText}
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
              <button
                type="button"
                onClick={() => setResumeModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border-2 border-[#0b1f4a] bg-white px-6 py-3 text-sm font-semibold text-[#0b1f4a] transition-colors hover:bg-[#0b1f4a] hover:text-white"
              >
                {hero.submitResumeText}
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
              </button>
            </div>
          </div>
        </div>
      </section>

      <SubmitResumeModal open={resumeModalOpen} onClose={() => setResumeModalOpen(false)} />
    </>
  );
}
