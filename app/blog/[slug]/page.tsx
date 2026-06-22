import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

import { getBlogPostBySlug, getRecentPosts } from "@/app/lib/blog-data";
import { getContent } from "@/app/lib/getContent";
import Navbar from "@/app/components/common/Navbar";
import Footer from "@/app/components/common/Footer";
import BlogDetailHero from "@/app/components/blog/detail/BlogDetailHero";
import BlogDetailContent from "@/app/components/blog/detail/BlogDetailContent";
import RecentBlogs from "@/app/components/blog/RecentBlogs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} – Galler`,
    description: post.subtitle,
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const recentPosts = getRecentPosts(slug, 3);
  const content = getContent();

  return (
    <>
      <Navbar activePage="blog" />
      <main>
        <BlogDetailHero post={post} />
        <BlogDetailContent post={post} />
        <RecentBlogs posts={recentPosts} />
      </main>
      <Footer content={content?.footer} />
    </>
  );
}
