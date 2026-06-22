"use client";

import { useEffect, useState } from "react";
import {
  enrichCareersJob,
  INITIAL_VISIBLE_JOB_POINTS,
  JOB_CATEGORIES,
  type CareersJob,
  type JobCategory,
} from "@/app/lib/careers-data";
import ApplyJobModal from "./ApplyJobModal";
import SubmitResumeModal from "./SubmitResumeModal";

import { API_URL } from "@/app/lib/apiUrl";
const categories = JOB_CATEGORIES;

function JobIcon({ category }: { category: JobCategory }) {
  const icons = {
    engineering: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M22 12h-4M6 12H2" strokeLinecap="round" />
      </svg>
    ),
    sales: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 20l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12v8h-8" strokeLinecap="round" />
      </svg>
    ),
    operations: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path
          d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    manufacturing: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" />
      </svg>
    ),
    support: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 14v-2a6 6 0 1112 0v2" strokeLinecap="round" />
        <rect x="4" y="14" width="4" height="6" rx="1.5" />
        <rect x="16" y="14" width="4" height="6" rx="1.5" />
      </svg>
    ),
  };
  return <div className="text-[#4a4a4a]">{icons[category]}</div>;
}

import type { SiteContent } from "@/app/lib/getContent";

type OpeningsSidebarContent = NonNullable<SiteContent["careersPage"]>["openingsSidebar"];

interface CurrentOpeningsProps {
  initialJobs?: CareersJob[];
  sidebarContent?: OpeningsSidebarContent;
}

const DEFAULT_SIDEBAR: OpeningsSidebarContent = {
  ctaHeading: "DON'T SEE A SUITABLE ROLE?",
  ctaParagraph1: "We are always looking for talented and passionate individuals.",
  ctaParagraph2: "Submit your profile and we'll contact you when a suitable opportunity becomes available.",
  ctaButtonText: "SUBMIT GENERAL RESUME",
  networkHeading: "JOIN OUR TALENT NETWORK",
  networkDescription: "Stay updated with our latest job openings and career opportunities.",
};

export default function CurrentOpenings({ initialJobs = [], sidebarContent }: CurrentOpeningsProps) {
  const [jobs, setJobs] = useState<CareersJob[]>(initialJobs);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]["id"]>("all");
  const [email, setEmail] = useState("");
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CareersJob | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const sidebar = { ...DEFAULT_SIDEBAR, ...sidebarContent };

  useEffect(() => {
    fetch(`${API_URL}/api/careers/jobs`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setJobs(data.map(enrichCareersJob));
      })
      .catch(() => {});
  }, []);

  const filteredJobs =
    activeCategory === "all" ? jobs : jobs.filter((job) => job.category === activeCategory);

  const openApplyModal = (job: CareersJob) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  return (
    <section id="openings" className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-serif text-2xl tracking-[0.1em] text-[#0b1f4a] sm:text-3xl">
          CURRENT OPENINGS
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-md px-5 py-2 text-sm font-semibold transition-colors ${
                    activeCategory === cat.id
                      ? "bg-[#0b1f4a] text-white"
                      : "border border-[#ddd] bg-white text-[#4a4a4a] hover:border-[#0b1f4a]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-6">
              {filteredJobs.length === 0 ? (
                <div className="rounded-lg border border-[#e5e5e5] p-8 text-center text-sm text-[#666]">
                  No openings in this category right now.
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job.id} className="flex gap-4 rounded-lg border border-[#e5e5e5] p-6">
                    <JobIcon category={job.category} />
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-[#0b1f4a]">{job.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#666]">
                        <span className="flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z" />
                          </svg>
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          {job.experience}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                          {job.type}
                        </span>
                      </div>
                      {job.descriptionPoints.length > 0 ? (
                        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#4a4a4a]">
                          {(expandedJobId === job.id
                            ? job.descriptionPoints
                            : job.descriptionPoints.slice(0, INITIAL_VISIBLE_JOB_POINTS)
                          ).map((point, index) => (
                            <li key={`${job.id}-point-${index}`}>{point}</li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-3">
                        {job.descriptionPoints.length > INITIAL_VISIBLE_JOB_POINTS ? (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedJobId((prev) => (prev === job.id ? null : job.id))
                            }
                            className="rounded-md border border-[#0b1f4a] bg-white px-5 py-2 text-sm font-semibold text-[#0b1f4a] transition-colors hover:bg-[#f8f9fa]"
                          >
                            {expandedJobId === job.id ? "HIDE DETAILS" : "VIEW DETAILS"}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => openApplyModal(job)}
                          className="rounded-md bg-[#c9a227] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a8871f]"
                        >
                          APPLY NOW
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-[#0b1f4a] p-6 text-white">
              <h3 className="text-sm font-bold tracking-wider">{sidebar.ctaHeading}</h3>
              <div className="mt-1 h-0.5 w-12 bg-[#c9a227]" />
              <p className="mt-4 text-sm leading-relaxed">{sidebar.ctaParagraph1}</p>
              <p className="mt-2 text-sm leading-relaxed">{sidebar.ctaParagraph2}</p>
              <button
                type="button"
                onClick={() => setResumeModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#c9a227] px-5 py-2.5 text-sm font-semibold text-[#c9a227] transition-colors hover:bg-[#c9a227] hover:text-white"
              >
                {sidebar.ctaButtonText}
              </button>
            </div>

            <div className="rounded-lg border border-[#e5e5e5] bg-white p-6">
              <h3 className="text-sm font-bold tracking-wider text-[#0b1f4a]">{sidebar.networkHeading}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4a4a4a]">
                {sidebar.networkDescription}
              </p>
              <div className="mt-5 flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-md border border-[#ddd] px-4 py-2.5 text-sm outline-none focus:border-[#0b1f4a]"
                />
                <button className="flex items-center justify-center rounded-md bg-[#c9a227] px-4 py-2.5 text-white transition-colors hover:bg-[#a8871f]">
                  <svg
                    width="18"
                    height="18"
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
        </div>
      </div>

      <SubmitResumeModal open={resumeModalOpen} onClose={() => setResumeModalOpen(false)} />
      <ApplyJobModal
        job={selectedJob}
        open={applyModalOpen}
        onClose={() => {
          setApplyModalOpen(false);
          setSelectedJob(null);
        }}
      />
    </section>
  );
}
