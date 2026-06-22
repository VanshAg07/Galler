"use client";

import { useEffect, useRef, useState } from "react";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";
import type { SiteContent } from "@/app/lib/getContent";

type LifeAtGallerContent = NonNullable<SiteContent["careersPage"]>["lifeAtGaller"];

interface LifeAtGallerProps {
  content?: LifeAtGallerContent;
}

const GAP = 20;
const PORTRAIT_RATIO = 5 / 4;

const DEFAULT_CONTENT: LifeAtGallerContent = {
  heading: "LIFE AT GALLER",
  subtitle: "A culture of collaboration, innovation and excellence.",
  images: [
    { id: "1", src: "", label: "Product Development" },
    { id: "2", src: "", label: "Engineering Reviews" },
    { id: "3", src: "", label: "Manufacturing Operations" },
    { id: "4", src: "", label: "Field Deployments" },
    { id: "5", src: "", label: "Trade Shows" },
    { id: "6", src: "", label: "Team Celebrations" },
  ],
};

function getVisibleCount(viewportWidth: number) {
  if (viewportWidth >= 1024) return 5;
  if (viewportWidth >= 768) return 3;
  if (viewportWidth >= 480) return 2;
  return 1;
}

function useGalleryLayout(viewportRef: React.RefObject<HTMLDivElement | null>) {
  const [layout, setLayout] = useState({
    visibleCount: 5,
    cardWidth: 280,
    slideStep: 300,
    imageHeight: 350,
  });

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      const visibleCount = getVisibleCount(width);
      const cardWidth = (width - (visibleCount - 1) * GAP) / visibleCount;
      const imageHeight = cardWidth * PORTRAIT_RATIO;

      setLayout({
        visibleCount,
        cardWidth,
        slideStep: cardWidth + GAP,
        imageHeight,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [viewportRef]);

  return layout;
}

const arrowClass =
  "absolute z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#ddd] bg-white text-[#4a4a4a] shadow-md transition-colors hover:bg-[#0b1f4a] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#4a4a4a]";

export default function LifeAtGaller({ content }: LifeAtGallerProps) {
  const section = { ...DEFAULT_CONTENT, ...content };
  const images = section.images?.length ? section.images : DEFAULT_CONTENT.images;
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { visibleCount, cardWidth, slideStep, imageHeight } = useGalleryLayout(viewportRef);
  const maxIndex = Math.max(0, images.length - visibleCount);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="bg-[#f8f9fa] py-14 sm:py-16">
      <div className="mx-auto max-w-[1720px] px-6 lg:px-10">
        <h2 className="text-center font-serif text-2xl tracking-[0.1em] text-[#0b1f4a] sm:text-3xl">
          {section.heading}
        </h2>
        <p className="mt-3 text-center text-sm text-[#4a4a4a] sm:text-[0.95rem]">
          {section.subtitle}
        </p>

        <div className="relative mt-10">
          <div ref={viewportRef} className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                gap: GAP,
                transform: `translateX(-${currentIndex * slideStep}px)`,
              }}
            >
              {images.map((image, index) => {
                const imageSrc = image.src ? resolveUploadSrc(image.src) : null;
                return (
                  <div
                    key={image.id || index}
                    className="shrink-0 overflow-hidden rounded-lg border border-[#e5e5e5] bg-white shadow-sm"
                    style={{ width: cardWidth }}
                  >
                    <div
                      className="relative w-full bg-gradient-to-br from-blue-100 to-blue-200"
                      style={{ height: imageHeight }}
                    >
                      {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageSrc} alt={image.label} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#0b1f4a]/20">
                          <svg
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="bg-[#0b1f4a] px-3 py-3 text-center">
                      <p className="text-xs font-medium text-white sm:text-sm">{image.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={prev}
            disabled={currentIndex === 0}
            className={`${arrowClass} left-0 -translate-x-1/2`}
            style={{ top: imageHeight / 2 }}
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            disabled={currentIndex >= maxIndex}
            className={`${arrowClass} right-0 translate-x-1/2`}
            style={{ top: imageHeight / 2 }}
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
