import { API_URL } from "@/app/lib/apiUrl";

export type MarqueeLogo = {
  id: string;
  src: string;
  alt: string;
};

/** Every logo is rendered inside a fixed 120×120 px slot. */
export const MARQUEE_SLOT_CLASS =
  "relative flex h-[120px] w-[120px] shrink-0 items-center justify-center";

/** On-screen slot size (px). */
export const MARQUEE_SLOT_DISPLAY_HEIGHT = 120;
export const MARQUEE_SLOT_DISPLAY_WIDTH = 120;

/** Recommended logo image dimensions (square, transparent background). */
export const MARQUEE_RECOMMENDED_WIDTH = 120;
export const MARQUEE_RECOMMENDED_HEIGHT = 120;

/** Approximate slot width including horizontal margins — used before layout measure. */
export const MARQUEE_SLOT_WIDTH_ESTIMATE = 168;

/** Maximum logos allowed in the marquee (admin + site). */
export const MARQUEE_MAX_LOGOS = 18;

/** Two horizontal rows, nine logos each. */
export const MARQUEE_ROW_COUNT = 2;
export const MARQUEE_LOGOS_PER_ROW = MARQUEE_MAX_LOGOS / MARQUEE_ROW_COUNT;

export const MARQUEE_MIN_DURATION = 40;
export const MARQUEE_MAX_DURATION = 120;
export const MARQUEE_SECONDS_PER_LOGO = 5;

/** Duration from logo count — legacy estimate only; prefer getMarqueeDurationFromShift. */
export function getMarqueeDuration(logoCount: number): string {
  const seconds = Math.min(
    MARQUEE_MAX_DURATION,
    Math.max(MARQUEE_MIN_DURATION, logoCount * MARQUEE_SECONDS_PER_LOGO)
  );
  return `${seconds}s`;
}

/** Duration from measured track width so every row scrolls at the same px/s. */
export function getMarqueeDurationFromShift(shiftPx: number): string {
  if (shiftPx <= 0) return `${MARQUEE_MIN_DURATION}s`;

  const secondsPerPixel = MARQUEE_SECONDS_PER_LOGO / MARQUEE_SLOT_WIDTH_ESTIMATE;
  const seconds = Math.min(
    MARQUEE_MAX_DURATION,
    Math.max(MARQUEE_MIN_DURATION, shiftPx * secondsPerPixel)
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
    return `${API_URL}${src}`;
  }
  return src;
}
