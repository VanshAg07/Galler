"use client";

import { useState } from "react";
import Image from "next/image";
import aboutImage from "@/Assets/about.jpg";
import type { SiteContent } from "@/app/lib/getContent";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";
import LogoMarquee from "../home/LogoMarquee";

export interface AchievementStat {
  value: string;
  label: string;
  tone: "team" | "devices" | "clients" | "industries";
  backgroundImage?: string;
}

interface AboutAchievementsContactProps {
  heading?: string;
  stats?: AchievementStat[];
  formHeading?: string;
  submitText?: string;
  formBackgroundImage?: string;
  marquee?: SiteContent["marquee"];
}

const DEFAULT_STATS: AchievementStat[] = [
  { value: "450+", label: "Team Members", tone: "team" },
  { value: "300K+", label: "Devices Deployed", tone: "devices" },
  { value: "50+", label: "Happy Clients", tone: "clients" },
  { value: "6+", label: "Industries Worked", tone: "industries" },
];

export default function AboutAchievementsContact({
  heading = "ACHIEVEMENTS",
  stats = DEFAULT_STATS,
  formHeading = "How can we meet your requirement?",
  submitText = "SUBMIT",
  formBackgroundImage,
  marquee,
}: AboutAchievementsContactProps) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ fullName: "", email: "", phone: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section>
      <div className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <h2 className="text-center font-serif text-3xl tracking-[0.15em] text-[#1a1a1a] sm:text-4xl">
            {heading}
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {stats.map((stat) => {
              const bgImageSrc = stat.backgroundImage 
                ? resolveUploadSrc(stat.backgroundImage) 
                : aboutImage.src;

              return (
                <div
                  key={stat.label}
                  className="relative min-h-[180px] overflow-hidden rounded-sm px-6 py-10 text-center text-white shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bgImageSrc}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/55" />
                  <div className="relative">
                    <p className="text-4xl font-light sm:text-5xl">{stat.value}</p>
                    <p className="mt-2 text-sm text-white/90 sm:text-base">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative min-h-[420px] overflow-hidden sm:min-h-[480px]">
        {formBackgroundImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveUploadSrc(formBackgroundImage)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#4a6a8a] via-[#2a4a6a] to-[#1a3050]" />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,255,255,0.15),transparent_55%)]" />
        <div
          className="absolute bottom-0 right-0 top-0 w-[55%] bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.2)_100%)]"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-center px-6 py-14 sm:min-h-[480px] sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <h3 className="text-2xl font-medium text-white sm:text-3xl">{formHeading}</h3>

            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              {[
                { name: "fullName", label: "Full Name", type: "text" },
                { name: "email", label: "Email Address", type: "email" },
                { name: "phone", label: "Contact Number", type: "tel" },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="text-sm text-white/90">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required
                    value={form[field.name as keyof typeof form]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [field.name]: e.target.value }))
                    }
                    className="mt-2 w-full border-0 border-b border-white/80 bg-transparent pb-2 text-white outline-none placeholder:text-white/40 focus:border-white"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="mt-4 border border-white px-10 py-2.5 text-sm font-medium tracking-widest text-white transition-colors hover:bg-white hover:text-[#1a3050]"
              >
                {submitted ? "SENT" : submitText}
              </button>
            </form>
          </div>
        </div>
      </div>

      <LogoMarquee content={marquee} />
    </section>
  );
}
