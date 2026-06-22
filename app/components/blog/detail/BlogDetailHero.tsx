import type { BlogPostDetail } from "@/app/lib/blog-data";

export default function BlogDetailHero({ post }: { post: BlogPostDetail }) {
  return (
    <section className="mt-20 bg-white">
      {/* Text block */}
      <div className="mx-auto max-w-4xl px-6 pt-12 pb-10 text-center sm:pt-16">
        {/* Tags row */}
        <div className="flex items-center justify-center gap-4">
          <span className="rounded-full bg-[var(--primary-orange)] px-4 py-1.5 text-xs font-semibold text-white">
            {post.date}
          </span>
          <span className="text-sm font-semibold text-[var(--primary-orange)]">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight text-[#1a1a1a] sm:text-6xl">
          {post.title}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 mx-auto max-w-2xl text-sm leading-relaxed text-gray-500">
          {post.subtitle}
        </p>
      </div>

      {/* Full-width hero image */}
      <div className="w-full overflow-hidden">
        {post.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.heroImage}
            alt={post.title}
            className="h-[520px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[520px] w-full items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-[#1a1145]">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              strokeWidth="1"
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
    </section>
  );
}
