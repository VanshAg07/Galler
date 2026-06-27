import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { API_URL } from "@/app/lib/apiUrl";
import type { SiteContent } from "@/app/lib/getContent";
import { getIndustrySlug, getIndustryProducts } from "@/app/lib/industries-types";
import Navbar from "@/app/components/common/Navbar";
import Footer from "@/app/components/common/Footer";
import IndustryProductsList from "@/app/components/industries/IndustryProductsList";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getContentFromAPI(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`${API_URL}/api/content`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentFromAPI();
  const industries = content?.homeIndustries?.items ?? [];
  const industry = industries.find((item) => getIndustrySlug(item) === slug);
  if (!industry) return {};
  return {
    title: `${industry.name} – Galler`,
    description: `Products and solutions for the ${industry.name} industry.`,
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getContentFromAPI();
  const industries = content?.homeIndustries?.items ?? [];
  const industry = industries.find((item) => getIndustrySlug(item) === slug);

  if (!industry) notFound();

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
