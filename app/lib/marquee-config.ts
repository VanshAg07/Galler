export type MarqueeLogo = {
  id: string;
  src: string;
  alt: string;
};

/** Every logo is rendered inside a fixed-height slot; width follows aspect ratio. */
export const MARQUEE_SLOT_CLASS =
  "relative flex h-24 shrink-0 items-center sm:h-28 md:h-32 lg:h-36";

/** On-screen slot height at the largest breakpoint. */
export const MARQUEE_SLOT_DISPLAY_HEIGHT = 144;

/** Recommended logo image dimensions (square or landscape, transparent background). */
export const MARQUEE_RECOMMENDED_WIDTH = 400;
export const MARQUEE_RECOMMENDED_HEIGHT = 400;

/** Approximate slot width including horizontal margins — used before layout measure. */
export const MARQUEE_SLOT_WIDTH_ESTIMATE = 200;

/** Maximum logos allowed in the marquee (admin + site). */
export const MARQUEE_MAX_LOGOS = 18;

/** Two horizontal rows, nine logos each. */
export const MARQUEE_ROW_COUNT = 2;
export const MARQUEE_LOGOS_PER_ROW = MARQUEE_MAX_LOGOS / MARQUEE_ROW_COUNT;

export const MARQUEE_MIN_DURATION = 20;
export const MARQUEE_MAX_DURATION = 72;
export const MARQUEE_SECONDS_PER_LOGO = 2.5;

export function getMarqueeDuration(logoCount: number): string {
  const seconds = Math.min(
    MARQUEE_MAX_DURATION,
    Math.max(MARQUEE_MIN_DURATION, logoCount * MARQUEE_SECONDS_PER_LOGO)
  );
  return `${seconds}s`;
}

/** Repeat logos within one set until it is wide enough for the viewport. */
export function buildMarqueeSet(logos: MarqueeLogo[], viewportWidth: number): MarqueeLogo[] {
  if (logos.length === 0) return [];

  const minSetWidth = viewportWidth * 1.15;
  const estimatedSetWidth = logos.length * MARQUEE_SLOT_WIDTH_ESTIMATE;
  const repeats = Math.max(1, Math.ceil(minSetWidth / estimatedSetWidth));

  return Array.from({ length: repeats }, () => logos).flat().map((logo, index) => ({
    ...logo,
    id: `${logo.id}-slot-${index}`,
  }));
}

export function buildMarqueeTrack(logos: MarqueeLogo[], viewportWidth: number): MarqueeLogo[] {
  const singleSet = buildMarqueeSet(logos, viewportWidth);
  return [...singleSet, ...singleSet];
}

export function splitMarqueeRows(logos: MarqueeLogo[]): MarqueeLogo[][] {
  const rows: MarqueeLogo[][] = [];

  for (let row = 0; row < MARQUEE_ROW_COUNT; row += 1) {
    const slice = logos.slice(
      row * MARQUEE_LOGOS_PER_ROW,
      row * MARQUEE_LOGOS_PER_ROW + MARQUEE_LOGOS_PER_ROW
    );
    if (slice.length > 0) rows.push(slice);
  }

  return rows;
}

export const DEFAULT_MARQUEE_LOGOS: MarqueeLogo[] = [
  { id: "bsnl", src: "/marquee/bsnl.png", alt: "BSNL" },
  { id: "honda", src: "/marquee/honda.svg", alt: "Honda" },
  { id: "lnt", src: "/marquee/lnt.png", alt: "L&T" },
  { id: "nokia", src: "/marquee/nokia.png", alt: "Nokia" },
  { id: "reliance", src: "/marquee/reliance.png", alt: "Reliance" },
  { id: "skoda", src: "/marquee/skoda.jpeg", alt: "Skoda" },
  { id: "suzuki", src: "/marquee/suzuki.webp", alt: "Suzuki" },
  { id: "toyota", src: "/marquee/toyota.jpg", alt: "Toyota" },
];

export function resolveMarqueeSrc(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/uploads/")) {
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}${src}`;
  }
  return src;
}
