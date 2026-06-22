import Link from "next/link";
import type { BlogPostDetail } from "@/app/lib/blog-data";

function RecentCard({ post }: { post: BlogPostDetail }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-[#f5f5f5] transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden sm:h-56">
        {post.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.heroImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-300 to-gray-400">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-primary">
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.date}</span>
        </div>
        <h3 className="text-sm font-bold leading-snug text-[#1a1a1a] transition-colors group-hover:text-primary">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

export default function RecentBlogs({ posts }: { posts: BlogPostDetail[] }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Insights &amp; Article
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[#1a1a1a]">
            Recent blogs
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <RecentCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
