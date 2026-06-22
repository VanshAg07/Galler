import Link from "next/link";
import { resolveUploadSrc } from "@/app/lib/resolveUploadSrc";
import { getIndustrySlug } from "@/app/lib/industries-types";
import type { SiteContent } from "@/app/lib/getContent";

type IndustryItem = {
  id: string;
  name: string;
  image: string;
};

type Props = { content?: SiteContent["homeIndustries"] };

const DEFAULT_ITEMS: IndustryItem[] = [
  { id: "telecommunication", name: "TELECOMMUNICATION", image: "" },
  { id: "petroleum", name: "PETROLEUM", image: "" },
  { id: "automobile", name: "AUTOMOBILE", image: "" },
];

const DEFAULTS: NonNullable<SiteContent["homeIndustries"]> = {
  title: "INDUSTRIES",
  items: DEFAULT_ITEMS,
};

function IndustryCard({ item }: { item: IndustryItem }) {
  const imageSrc = item.image ? resolveUploadSrc(item.image) : "";
  const href = `/industries/${getIndustrySlug(item)}`;

  return (
    <Link href={href} className="block">
      <article className="group relative aspect-[8/5] overflow-hidden bg-[#d8d8d8] sm:aspect-[3/2]">
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={item.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#c8c8c8] to-[#a8a8a8]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <h3 className="absolute inset-x-0 bottom-0 px-3 pb-3 text-center font-serif text-base tracking-[0.12em] text-white sm:text-lg md:text-xl">
        {item.name}
      </h3>
      </article>
    </Link>
  );
}

export default function IndustriesSection({ content }: Props) {
  const c = {
    ...DEFAULTS,
    ...content,
    items: content?.items?.length ? content.items : DEFAULTS.items,
  };

  return (
    <section id="industries" className="bg-white py-8 sm:py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center font-serif text-2xl tracking-[0.12em] text-[#1a1a1a] sm:text-3xl md:text-4xl">
          {c.title}
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:mt-7 lg:grid-cols-3 lg:gap-5">
          {c.items.map((item) => (
            <IndustryCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
