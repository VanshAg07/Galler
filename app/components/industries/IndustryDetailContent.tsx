"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";
import {
  getProductGallery,
  getVisibleProductDownloadButtons,
  type IndustryGalleryItem,
  type IndustryProduct,
} from "@/app/lib/industries-types";
import { downloadUploadedFile } from "@/app/lib/downloadFile";

function CornerBracketBox({ children }: { children: ReactNode }) {
  return (
    <div className="relative px-5 py-6 sm:px-8 sm:py-8">
      <span className="absolute top-0 left-0 h-5 w-5 border-t border-l border-[#1a1a1a]" />
      <span className="absolute top-0 right-0 h-5 w-5 border-t border-r border-[#1a1a1a]" />
      <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-[#1a1a1a]" />
      <span className="absolute right-0 bottom-0 h-5 w-5 border-r border-b border-[#1a1a1a]" />
      {children}
    </div>
  );
}

function GalleryThumb({
  item,
  active,
  onClick,
}: {
  item: IndustryGalleryItem;
  active: boolean;
  onClick: () => void;
}) {
  const src = item.src ? resolveUploadSrc(item.src) : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative aspect-[4/3] min-w-0 flex-1 overflow-hidden bg-white"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={item.alt || ""} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] text-gray-400">
          No image
        </div>
      )}
      {item.type === "video" ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/35">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#0b1f4a]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      ) : null}
    </button>
  );
}

export default function IndustryDetailContent({
  product,
  backLink,
}: {
  product: IndustryProduct;
  backLink?: { href: string; label: string };
}) {
  const gallery = useMemo(() => getProductGallery(product), [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const visibleThumbCount = 4;
  const maxThumbStart = Math.max(0, gallery.length - visibleThumbCount);
  const activeItem = gallery[activeIndex] ?? gallery[0];
  const activeSrc = activeItem?.src ? resolveUploadSrc(activeItem.src) : "";
  const features = product.keyFeatures?.length ? product.keyFeatures : [];
  const featureColumns = [
    features.filter((_, i) => i % 2 === 0),
    features.filter((_, i) => i % 2 === 1),
  ];
  const downloadButtons = getVisibleProductDownloadButtons(product);
  const [downloading, setDownloading] = useState<"brochure" | "model3d" | null>(null);

  const handleDownload = async (type: "brochure" | "model3d") => {
    const file = type === "brochure" ? downloadButtons.brochure : downloadButtons.model3d;
    if (!file) return;

    setDownloading(type);
    try {
      await downloadUploadedFile(file.url, file.fileName);
    } catch {
      window.open(resolveUploadSrc(file.url), "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(null);
    }
  };

  const selectImage = (index: number) => {
    setActiveIndex(index);
    setZoomed(false);
    if (index < thumbStart) setThumbStart(index);
    else if (index >= thumbStart + visibleThumbCount) {
      setThumbStart(Math.min(index, maxThumbStart));
    }
  };

  return (
    <section className="bg-white pt-28 pb-10 sm:pt-32 sm:pb-14 md:pb-16">
      <div className="mx-auto max-w-7xl px-6">
        {backLink ? (
          <Link
            href={backLink.href}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#0b1f4a]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {backLink.label}
          </Link>
        ) : null}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Left — gallery */}
        <div>
          <div
            className={`relative overflow-hidden bg-[#f7f7f7] ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            onClick={() => setZoomed((prev) => !prev)}
          >
            {activeSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeSrc}
                alt={activeItem?.alt || product.name}
                className={`aspect-[4/3] w-full object-contain transition-transform duration-300 ${
                  zoomed ? "scale-150" : "scale-100"
                }`}
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-sm text-gray-400">
                No image uploaded
              </div>
            )}

            <button
              type="button"
              aria-label="Toggle zoom"
              onClick={(e) => {
                e.stopPropagation();
                setZoomed((prev) => !prev);
              }}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0b1f4a] shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            </button>
          </div>

          {gallery.length > 0 ? (
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous thumbnails"
                disabled={thumbStart === 0}
                onClick={() => setThumbStart((prev) => Math.max(0, prev - 1))}
                className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-[#0b1f4a] disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div className="flex min-w-0 flex-1 gap-2">
                {gallery.slice(thumbStart, thumbStart + visibleThumbCount).map((item, offset) => {
                  const index = thumbStart + offset;
                  return (
                    <GalleryThumb
                      key={item.id}
                      item={item}
                      active={index === activeIndex}
                      onClick={() => selectImage(index)}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                aria-label="Next thumbnails"
                disabled={thumbStart >= maxThumbStart}
                onClick={() => setThumbStart((prev) => Math.min(maxThumbStart, prev + 1))}
                className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-[#0b1f4a] disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>

        {/* Right — content */}
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl tracking-[0.08em] text-[#0b1f4a] sm:text-4xl md:text-[2.5rem]">
            {product.name}
          </h1>
            <p className="text-sm leading-7 text-[#333] sm:text-[0.95rem] sm:leading-8">
              {product.description ||
                "Add a basic description for this product from the admin panel."}
            </p>

          {features.length > 0 ? (
            <div className="mt-8 sm:mt-10">
              <h2 className="text-sm font-bold tracking-[0.08em] text-[#0b1f4a] uppercase sm:text-base">
                Key Features
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {featureColumns.map((column, columnIndex) => (
                  <ul key={columnIndex} className="space-y-2">
                    {column.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-2 text-sm leading-relaxed text-[#333] sm:text-[0.95rem]"
                      >
                        <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b1f4a]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          ) : null}

          {downloadButtons.brochure || downloadButtons.model3d ? (
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
              {downloadButtons.brochure ? (
                <button
                  type="button"
                  onClick={() => handleDownload("brochure")}
                  disabled={downloading === "brochure"}
                  className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-[#b8451a] px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-[#d4531a] disabled:opacity-60"
                >
                  {downloading === "brochure" ? "Downloading…" : "Download Brochure"}
                </button>
              ) : null}
              {downloadButtons.model3d ? (
                <button
                  type="button"
                  onClick={() => handleDownload("model3d")}
                  disabled={downloading === "model3d"}
                  className="inline-flex min-w-[180px] items-center justify-center rounded-full border-2 border-[#0b1f4a] px-6 py-3 text-sm font-medium tracking-wide text-[#0b1f4a] transition-colors hover:bg-[#0b1f4a] hover:text-white disabled:opacity-60"
                >
                  {downloading === "model3d" ? "Downloading…" : "3D Model"}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        </div>
      </div>
    </section>
  );
}
