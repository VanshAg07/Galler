import Link from "next/link";
import type { BlogPostDetail } from "@/app/lib/blog-data";

export default function BlogCard({ post }: { post: BlogPostDetail }) {
  if (post.featured) {
    return <FeaturedCard post={post} />;
  }
  return <RegularCard post={post} />;
}

function FeaturedCard({ post }: { post: BlogPostDetail }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[var(--primary-orange)] px-3 py-1 text-xs font-semibold text-white">
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.date}</span>
        </div>
        <h3 className="text-base font-bold leading-snug text-[#1a1a1a] transition-colors group-hover:text-[var(--primary-orange)]">
          {post.title}
        </h3>
      </div>

      <div className="relative flex-1">
        <div className="absolute right-3 top-3 z-10 rounded-full bg-[var(--primary-orange)] px-3 py-1 text-xs font-semibold text-white">
          Featured
        </div>
        <div className="relative h-56 w-full overflow-hidden sm:h-64">
          {post.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.heroImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </div>
    </Link>
  );
}

function RegularCard({ post }: { post: BlogPostDetail }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-52 w-full overflow-hidden sm:h-56">
        {post.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.heroImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--primary-orange)]">
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.date}</span>
        </div>
        <h3 className="text-base font-bold leading-snug text-[#1a1a1a] transition-colors group-hover:text-[var(--primary-orange)]">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
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
  );
}
