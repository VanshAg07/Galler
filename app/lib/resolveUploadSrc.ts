export function resolveUploadSrc(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/uploads/")) {
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}${src}`;
  }
  return src;
}
