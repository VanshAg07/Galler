import Link from "next/link";
import type { BlogPostDetail } from "@/app/lib/blog-data";
import type { SiteContent } from "@/app/lib/getContent";
import Button from "../common/Button";

type Props = {
  posts: BlogPostDetail[];
  content?: SiteContent["homeBlog"];
};

const DEFAULTS: NonNullable<SiteContent["homeBlog"]> = {
  tagline: "Insights & Article",
  heading: "Latest from our",
  headingHighlight: "blog",
  ctaText: "View all blogs",
  readMoreText: "Read full blog",
};

const CARD_BACKGROUNDS = [
  "bg-linear-to-br from-slate-900 via-blue-950 to-slate-800",
  "bg-linear-to-br from-zinc-900 via-red-950/80 to-zinc-900",
  "bg-linear-to-br from-stone-900 via-zinc-800 to-neutral-900",
];

function BlogCard({
  post,
  readMoreText,
  backgroundClass,
}: {
  post: BlogPostDetail;
  readMoreText: string;
  backgroundClass: string;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl sm:min-h-[460px] lg:min-h-[500px]"
    >
      {post.heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.heroImage}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 ${backgroundClass}`} />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />

      <div className="relative z-10 flex flex-col gap-4 p-6 sm:p-8">
        <h3 className="text-2xl leading-tight font-bold text-white sm:text-[1.75rem] lg:text-3xl">
          {post.title}
        </h3>
        <span className="text-sm font-medium text-primary underline underline-offset-4 transition-colors group-hover:text-[#e86530] sm:text-base">
          {readMoreText}
        </span>
      </div>
    </Link>
  );
}

export default function HomeBlogSection({ posts, content }: Props) {
  const c = { ...DEFAULTS, ...content };
  const displayPosts = posts.slice(0, 3);

  if (displayPosts.length === 0) return null;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-[#1a1a1a] md:text-4xl lg:text-5xl">
              {c.heading}{" "}
              <span className="text-navy">{c.headingHighlight}</span>
            </h2>
          </div>
          <Button href="/blog">{c.ctaText}</Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {displayPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              readMoreText={c.readMoreText}
              backgroundClass={CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
