import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { getContent } from "@/app/lib/getContent";
import { getIndustryProduct } from "@/app/lib/industries-data";
import { getIndustrySlug } from "@/app/lib/industries-types";
import Navbar from "@/app/components/common/Navbar";
import Footer from "@/app/components/common/Footer";
import IndustryDetailContent from "@/app/components/industries/IndustryDetailContent";

interface PageProps {
  params: Promise<{ slug: string; productSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, productSlug } = await params;
  const result = getIndustryProduct(slug, productSlug);
  if (!result) return {};
  return {
    title: `${result.product.name} – ${result.industry.name} – Galler`,
    description: result.product.description,
  };
}

export default async function IndustryProductPage({ params }: PageProps) {
  const { slug, productSlug } = await params;
  const result = getIndustryProduct(slug, productSlug);

  if (!result) notFound();

  const { industry, product } = result;
  const content = getContent();

  return (
    <>
      <Navbar activePage="home" />
      <main>
        <IndustryDetailContent
          product={product}
          backLink={{
            href: `/industries/${getIndustrySlug(industry)}`,
            label: `Back to ${industry.name}`,
          }}
        />
      </main>
      <Footer content={content?.footer} />
    </>
  );
}
