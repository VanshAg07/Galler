"use client";

import Link from "next/link";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";
import {
  getIndustryProducts,
  getIndustrySlug,
  getProductGallery,
  getProductSlug,
  type IndustryItem,
} from "@/app/lib/industries-types";

export default function IndustryProductsList({ industry }: { industry: IndustryItem }) {
  const products = getIndustryProducts(industry);
  const industrySlug = getIndustrySlug(industry);

  return (
    <section className="bg-white pt-28 pb-10 sm:pt-32 sm:pb-14 md:pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-3xl tracking-[0.08em] text-[#0b1f4a] sm:text-4xl md:text-[2.5rem]">
            {industry.name}
          </h1>
          <div className="mt-3 flex items-center justify-center gap-0.5" aria-hidden>
            <div className="h-px w-10 bg-[#c9a227]" />
            <div className="h-1 w-8 bg-[#c9a227]" />
            <div className="h-px w-10 bg-[#c9a227]" />
          </div>
          <p className="mt-5 text-sm text-gray-600 sm:text-base">
            Explore products and solutions for the {industry.name.toLowerCase()} industry.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {products.map((product) => {
              const gallery = getProductGallery(product);
              const thumb = product.image || gallery[0]?.src || "";
              const thumbSrc = thumb ? resolveUploadSrc(thumb) : "";

              return (
                <Link
                  key={product.id}
                  href={`/industries/${industrySlug}/${getProductSlug(product)}`}
                  className="group overflow-hidden border border-gray-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f3f3]">
                    {thumbSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbSrc}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-4">
                    <h2 className="font-serif text-lg tracking-[0.06em] text-[#0b1f4a] sm:text-xl">
                      {product.name}
                    </h2>
                    {product.description ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                        {product.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-gray-500">
            No products added yet for this industry.
          </p>
        )}
      </div>
    </section>
  );
}
