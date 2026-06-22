"use client";

import { useState } from "react";
import type { BlogPostDetail, ContentBlock } from "@/app/lib/blog-data";

function ParagraphBlock({ text }: { text: string }) {
  return (
    <p className="text-sm leading-relaxed text-gray-700">{text}</p>
  );
}

function BulletsBlock({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function VideoBlock() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-[#0f0f1a]">
      <div className="relative h-80 w-full flex items-center justify-center">
        {/* Decorative blobs mimicking the screenshot */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/3 h-32 w-32 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-24 w-24 rounded-full bg-purple-600/40 blur-2xl" />
          <div className="absolute left-1/2 bottom-1/3 h-20 w-20 rounded-full bg-orange-500/30 blur-2xl" />
        </div>

        {/* Play / Pause button */}
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-105"
        >
          {playing ? (
            /* Pause icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            /* Play icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function QuoteBlock({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-[var(--primary-orange)] p-8">
      <p className="text-base font-medium leading-relaxed text-white">{text}</p>
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock text={block.text} />;
    case "bullets":
      return <BulletsBlock items={block.items} />;
    case "video":
      return <VideoBlock />;
    case "quote":
      return <QuoteBlock text={block.text} />;
  }
}

export default function BlogDetailContent({ post }: { post: BlogPostDetail }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-2xl px-6">
        <div className="flex flex-col gap-7">
          {post.content.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}
