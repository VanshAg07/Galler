import fs from "fs";
import path from "path";
import { resolveUploadSrc } from "./resolveUploadSrc";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "video"; thumbnail?: string }
  | { type: "quote"; text: string };

export interface BlogPostDetail {
  id: string;
  slug: string;
  category: string;
  date: string;
  title: string;
  subtitle: string;
  heroImage?: string;
  featured?: boolean;
  content: ContentBlock[];
}

const BLOG_POSTS_PATH = path.join(process.cwd(), "server", "data", "blog-posts.json");

function normalizePost(post: BlogPostDetail): BlogPostDetail {
  return {
    ...post,
    heroImage: post.heroImage ? resolveUploadSrc(post.heroImage) : undefined,
  };
}

export function loadBlogPosts(): BlogPostDetail[] {
  try {
    const raw = fs.readFileSync(BLOG_POSTS_PATH, "utf-8");
    const posts = JSON.parse(raw) as BlogPostDetail[];
    return posts.map(normalizePost);
  } catch {
    return [];
  }
}

export function getBlogPosts(): BlogPostDetail[] {
  return loadBlogPosts();
}

export function getBlogPostBySlug(slug: string): BlogPostDetail | undefined {
  return loadBlogPosts().find((p) => p.slug === slug);
}

export function getRecentPosts(excludeSlug: string, count = 3): BlogPostDetail[] {
  return loadBlogPosts()
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, count);
}

export function getHomeBlogPosts(count = 3): BlogPostDetail[] {
  return loadBlogPosts().slice(0, count);
}
