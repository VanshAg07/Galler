"use client";

import React from "react";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    features?: string[];
    image?: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  const features = project.features ?? [];
  const displayFeatures = showDetails ? features : features.slice(0, 2);

  return (
    <div className="group overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all hover:shadow-lg">
      {project.image ? (
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={resolveUploadSrc(project.image)}
            alt={project.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] flex items-center justify-center bg-gray-100">
          <span className="text-gray-300">No image</span>
        </div>
      )}

      <div className="p-6">
        <h3 className="font-cinzel mb-3 text-xl font-bold uppercase tracking-wide text-gray-900">
          {project.name}
        </h3>
        {features.length > 0 ? (
          <>
            <div className="mb-4 h-0.5 w-12 bg-primary" />
            <ul className="font-century space-y-2 text-sm leading-relaxed text-gray-600">
              {displayFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {features.length > 2 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="font-century mt-4 text-sm font-medium text-gray-900 hover:text-primary"
          >
            {showDetails ? "SHOW LESS" : "VIEW DETAILS"}
          </button>
        )}
      </div>
    </div>
  );
}
