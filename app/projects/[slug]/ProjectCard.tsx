"use client";

import React from "react";
import { motion } from "framer-motion";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    features?: string[];
    image?: string;
  };
  index?: number;
}

const entryEase = [0.25, 0.1, 0.25, 1] as const;
const viewport = { once: true, amount: 0.25 };

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  const features = project.features ?? [];
  const displayFeatures = showDetails ? features : features.slice(0, 2);

  return (
    <motion.div
      className="group overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all hover:shadow-lg"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.55, ease: entryEase, delay: index * 0.08 }}
    >
      {project.image ? (
        <motion.div
          className="aspect-[4/3] overflow-hidden bg-gray-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, ease: entryEase, delay: index * 0.08 + 0.05 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveUploadSrc(project.image)}
            alt={project.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </motion.div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-gray-100">
          <span className="font-century text-[15px] text-gray-300">No image</span>
        </div>
      )}

      <div className="p-6">
        <motion.h3
          className="font-cinzel mb-3 text-[20px] font-normal leading-[1.08] tracking-tight text-gray-900"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, ease: entryEase, delay: index * 0.08 + 0.1 }}
        >
          {project.name}
        </motion.h3>
        {features.length > 0 ? (
          <>
            <motion.div
              className="mb-4 h-0.5 w-12 bg-primary"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={viewport}
              transition={{ duration: 0.45, ease: entryEase, delay: index * 0.08 + 0.14 }}
            />
            <motion.ul
              className="font-century space-y-2 text-[15px] leading-relaxed text-gray-600"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.55, ease: entryEase, delay: index * 0.08 + 0.18 }}
            >
              {displayFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </motion.ul>
          </>
        ) : null}

        {features.length > 2 && (
          <motion.button
            onClick={() => setShowDetails(!showDetails)}
            className="font-century mt-4 text-[15px] font-medium text-gray-900 hover:text-primary"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.55, ease: entryEase, delay: index * 0.08 + 0.22 }}
          >
            {showDetails ? "SHOW LESS" : "VIEW DETAILS"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
