"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface JourneyMilestone {
  year: string;
  description: string;
}

interface AboutJourneyProps {
  heading?: string;
  milestones?: JourneyMilestone[];
}

const DEFAULT_MILESTONES: JourneyMilestone[] = [
  {
    year: "2022",
    description:
      "Exploring new avenues to provide creative and customized solutions across various industries.",
  },
  {
    year: "2018-19",
    description: "Fuel Automation for Petroleum - Reliance BP Mobility Limited.",
  },
  {
    year: "2015-16",
    description:
      "Telecom Infra networking & monitoring systems - Reliance Jio Infocomm Limited.",
  },
  {
    year: "2012-13",
    description: "Electro Mechanical Solutions - Reliance Jio Infocomm Limited.",
  },
];

function AstronautGraphic() {
  return (
    <svg
      viewBox="0 0 280 420"
      fill="none"
      className="h-full w-full opacity-90"
      aria-hidden
    >
      <ellipse cx="140" cy="380" rx="70" ry="12" fill="white" opacity="0.15" />
      <circle cx="140" cy="95" r="52" fill="#f4f4f4" />
      <circle cx="140" cy="95" r="44" fill="#d8dce3" />
      <ellipse cx="140" cy="95" rx="38" ry="34" fill="#b8c0cc" opacity="0.5" />
      <rect x="88" y="145" width="104" height="130" rx="36" fill="#eceff3" />
      <rect x="98" y="155" width="84" height="90" rx="20" fill="#d5dbe3" />
      <rect x="52" y="168" width="36" height="88" rx="18" fill="#eceff3" />
      <rect x="192" y="168" width="36" height="88" rx="18" fill="#eceff3" />
      <rect x="108" y="268" width="28" height="72" rx="14" fill="#eceff3" />
      <rect x="144" y="268" width="28" height="72" rx="14" fill="#eceff3" />
      <circle cx="72" cy="252" r="14" fill="#d5dbe3" />
      <circle cx="208" cy="252" r="14" fill="#d5dbe3" />
      <path
        d="M118 340 L108 390 M162 340 L172 390"
        stroke="#d5dbe3"
        strokeWidth="16"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TimelineDot({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const position = total <= 1 ? 0 : index / (total - 1);
  const dotScale = useTransform(
    scrollYProgress,
    [Math.max(0, position - 0.12), position + 0.02],
    [0.75, 1.15]
  );
  const dotOpacity = useTransform(
    scrollYProgress,
    [Math.max(0, position - 0.12), position + 0.02],
    [0.35, 1]
  );
  const ringScale = useTransform(
    scrollYProgress,
    [Math.max(0, position - 0.08), position + 0.1],
    [0.5, 2.2]
  );
  const ringOpacity = useTransform(
    scrollYProgress,
    [Math.max(0, position - 0.08), position + 0.1],
    [0, 0.55]
  );

  return (
    <div className="relative flex h-3 w-3 shrink-0 items-center justify-center">
      <motion.span
        className="absolute h-3 w-3 rounded-full bg-[#4dd9f0]/40"
        style={{ scale: ringScale, opacity: ringOpacity }}
        aria-hidden
      />
      <motion.span
        className="relative z-1 h-3 w-3 rounded-full bg-white shadow-[0_0_10px_rgba(77,217,240,0.8)]"
        style={{ scale: dotScale, opacity: dotOpacity }}
        aria-hidden
      />
    </div>
  );
}

function AnimatedLine({ progress }: { progress: MotionValue<number> }) {
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);
  const dotTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div className="absolute top-2 bottom-2 left-0 w-px" aria-hidden>
      <div className="absolute inset-0 w-px bg-white/20" />

      <motion.div
        className="absolute top-0 left-0 w-px overflow-hidden rounded-full"
        style={{ height }}
      >
        <div className="h-full w-full bg-linear-to-b from-[#4dd9f0] via-white to-[#7ee8ff]" />
        <div className="animate-timeline-shimmer-vertical absolute inset-0 bg-linear-to-b from-transparent via-white/70 to-transparent" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4dd9f0] shadow-[0_0_14px_#4dd9f0,0_0_28px_rgba(77,217,240,0.5)]"
        style={{ top: dotTop }}
      />
    </div>
  );
}

function TimelineItem({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: JourneyMilestone;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const position = total <= 1 ? 0 : index / (total - 1);
  const textOpacity = useTransform(
    scrollYProgress,
    [Math.max(0, position - 0.15), position + 0.05],
    [0.45, 1]
  );

  return (
    <motion.li
      className="relative pb-12 pl-8 last:pb-0 sm:pb-14 sm:pl-10 lg:pb-16"
      style={{ opacity: textOpacity }}
    >
      <div className="absolute top-1 left-0 -translate-x-1/2">
        <TimelineDot index={index} total={total} scrollYProgress={scrollYProgress} />
      </div>
      <p className="text-sm font-medium text-white sm:text-base lg:text-lg">{item.year}</p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base lg:max-w-2xl">
        {item.description}
      </p>
    </motion.li>
  );
}

export default function AboutJourney({
  heading = "JOURNEY",
  milestones = DEFAULT_MILESTONES,
}: AboutJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#0b1f4a] pb-16 pt-20 sm:pb-20 sm:pt-24"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-1 h-40 w-[55%] rounded-bl-[100%] bg-white"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(77,217,240,0.12),transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <h2 className="font-serif text-4xl tracking-[0.2em] text-white sm:text-5xl md:text-6xl">
          {heading}
        </h2>

        <div className="relative mt-14 max-w-3xl sm:mt-16 lg:mt-20">
          <AnimatedLine progress={smoothProgress} />
          <ul className="relative">
            {milestones.map((item, index) => (
              <TimelineItem
                key={item.year}
                item={item}
                index={index}
                total={milestones.length}
                scrollYProgress={smoothProgress}
              />
            ))}
          </ul>
        </div>
      </div>

      <div className="pointer-events-none absolute right-0 bottom-0 hidden h-[min(420px,55vh)] w-[min(280px,30vw)] lg:block">
        <AstronautGraphic />
      </div>
    </section>
  );
}
