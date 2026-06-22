import type { Metadata } from "next";
import { getContent } from "../lib/getContent";
import { getBlogPosts } from "../lib/blog-data";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import BlogGrid from "../components/blog/BlogGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Galler Engineering",
  description: "Insights, updates, and stories from the world of precision manufacturing.",
};

export default function BlogPage() {
  const content = getContent();
  const blogPage = content?.blogPage;
  const posts = getBlogPosts();

  return (
    <>
      <Navbar activePage="blog" />
      <main className="min-h-screen bg-[#f5f5f5]">
        <div className="flex items-center justify-center pt-40 pb-16">
          <h1 className="text-6xl font-extrabold tracking-tight text-[#1a1a1a] md:text-7xl">
            {blogPage?.heading ?? "Our blogs"}
          </h1>
        </div>

        <BlogGrid posts={posts} />
      </main>
      <Footer content={content?.footer} />
    </>
  );
}
