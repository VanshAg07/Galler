import BlogCard from "./BlogCard";
import type { BlogPostDetail } from "@/app/lib/blog-data";

interface BlogGridProps {
  posts: BlogPostDetail[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 pb-24 text-center text-gray-400">
        No blog posts yet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
