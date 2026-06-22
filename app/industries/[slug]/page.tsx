import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { getContent } from "@/app/lib/getContent";
import { getIndustryBySlug } from "@/app/lib/industries-data";
import Navbar from "@/app/components/common/Navbar";
import Footer from "@/app/components/common/Footer";
import IndustryProductsList from "@/app/components/industries/IndustryProductsList";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return {};
  return {
    title: `${industry.name} – Galler`,
    description: `Products and solutions for the ${industry.name} industry.`,
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) notFound();

  const content = getContent();

  return (
    <>
      <Navbar activePage="home" />
      <main>
        <IndustryProductsList industry={industry} />
      </main>
      <Footer content={content?.footer} />
    </>
  );
}
